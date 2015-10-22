import React from 'react';
import align from 'dom-align';
import rcUtil from 'rc-util';
import isWindow from './isWindow';

function buffer(fn, ms) {
  let timer;
  return function bufferFn() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, ms);
  };
}

class Align extends React.Component {
  constructor() {
    super(...arguments);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  componentDidMount() {
    const props = this.props;
    // if parent ref not attached .... use document.getElementById
    if (!props.disabled) {
      const source = React.findDOMNode(this);
      props.onAlign(source, align(source, props.target(), props.align));
      if (props.monitorWindowResize) {
        this.startMonitorWindowResize();
      }
    }
  }

  startMonitorWindowResize() {
    if (!this.resizeHandler) {
      this.resizeHandler = rcUtil.Dom.addEventListener(window, 'resize',
        buffer(this.onWindowResize, this.props.monitorBufferTime));
    }
  }

  stopMonitorWindowResize() {
    if (this.resizeHandler) {
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  }

  onWindowResize() {
    const props = this.props;
    if (!props.disabled) {
      const source = React.findDOMNode(this);
      props.onAlign(source, align(source, props.target(), props.align));
    }
  }

  componentWillUnmount() {
    this.stopMonitorWindowResize();
  }

  componentDidUpdate(prevProps) {
    let reAlign = false;
    const props = this.props;
    let currentTarget;

    if (!props.disabled) {
      if (prevProps.disabled || prevProps.align !== props.align) {
        reAlign = true;
        currentTarget = props.target();
      } else {
        const lastTarget = prevProps.target();
        currentTarget = props.target();
        if (isWindow(lastTarget) && isWindow(currentTarget)) {
          reAlign = false;
        } else if (lastTarget !== currentTarget) {
          reAlign = true;
        }
      }
    }

    if (reAlign) {
      const source = React.findDOMNode(this);
      props.onAlign(source, align(source, currentTarget, props.align));
    }

    if (props.monitorWindowResize && !props.disabled) {
      this.startMonitorWindowResize();
    } else {
      this.stopMonitorWindowResize();
    }
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Align.defaultProps = {
  target() {
    return window;
  },
  onAlign() {
  },
  monitorBufferTime: 50,
  monitorWindowResize: false,
  disabled: false,
};

Align.PropTypes = {
  align: React.PropTypes.object.isRequired,
  target: React.PropTypes.func,
  onAlign: React.PropTypes.func,
  monitorBufferTime: React.PropTypes.number,
  monitorWindowResize: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
};

export default Align;
