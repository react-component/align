'use strict';

import React from 'react';
import align from 'dom-align';
import rcUtil from 'rc-util';

function isWindow(obj) {
  /*eslint-disable eqeqeq */
  return obj != null && obj == obj.window;
  /*eslint-enable eqeqeq */
}

function buffer(fn, ms) {
  var timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, ms);
  };
}

class Align extends React.Component {
  constructor(props) {
    super(...arguments);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentDidMount() {
    var props = this.props;
    // parent ref not attached ....
    if (!props.disabled) {
      setTimeout(() => {
        align(React.findDOMNode(this), props.target(), props.align);
      }, 0);
      if (props.monitorWindowResize) {
        this.startMonitorWindowResize();
      }
    }
  }

  startMonitorWindowResize() {
    if (!this.resizeHandler) {
      this.resizeHandler = rcUtil.Dom.addEventListener(window, 'resize',
        buffer(this.handleWindowResize, this.props.monitorBufferTime));
    }
  }

  stopMonitorWindowResize() {
    if (this.resizeHandler) {
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  }

  handleWindowResize() {
    var props = this.props;
    if (!props.disabled) {
      align(React.findDOMNode(this), props.target(), props.align);
    }
  }

  componentWillUnmount() {
    this.stopMonitorWindowResize();
  }

  componentDidUpdate(prevProps) {
    var reAlign = false;
    var props = this.props;
    var currentTarget;

    if (!props.disabled) {
      if (prevProps.disabled || prevProps.align !== props.align) {
        reAlign = true;
        currentTarget = props.target();
      } else {
        var lastTarget = prevProps.target();
        currentTarget = props.target();
        if (isWindow(lastTarget) && isWindow(currentTarget)) {
          reAlign = false;
        } else if (lastTarget !== currentTarget) {
          reAlign = true;
        }
      }
    }

    if (reAlign) {
      align(React.findDOMNode(this), currentTarget, props.align);
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
  monitorBufferTime: 50,
  monitorWindowResize: false,
  disabled: false
};

Align.PropTypes = {
  align: React.PropTypes.object.isRequired,
  target: React.PropTypes.func,
  monitorBufferTime: React.PropTypes.number,
  monitorWindowResize: React.PropTypes.bool,
  disabled: React.PropTypes.bool
};

export default Align;
