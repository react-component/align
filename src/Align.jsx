'use strict';

import React from 'react';
import align from 'dom-align';
import rcUtil from 'rc-util';

function isWindow(obj) {
  /*eslint-disable eqeqeq */
  return obj != null && obj == obj.window;
  /*eslint-enable eqeqeq */
}


class Align extends React.Component {
  constructor(props) {
    super(...arguments);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentDidMount() {
    var props = this.props;
    // parent ref not attached ....
    setTimeout(() => {
      align(React.findDOMNode(this), props.target(), props.align);
    }, 0);

    if (props.monitorWindowResize) {
      this.startMonitorWindowResize();
    }
  }

  startMonitorWindowResize() {
    if (!this.resizeHandler) {
      this.resizeHandler = rcUtil.Dom.addEventListener(window, 'resize', this.handleWindowResize);
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
    align(React.findDOMNode(this), props.target(), props.align);
  }

  componentWillUnmount() {
    this.stopMonitorWindowResize();
  }

  componentDidUpdate(prevProps) {
    var reAlign = false;
    var props = this.props;
    var currentTarget;

    if (prevProps.align !== props.align) {
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

    if (reAlign) {
      align(React.findDOMNode(this), currentTarget, props.align);
    }

    if (props.monitorWindowResize) {
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
  }
};

Align.PropTypes = {
  align: React.PropTypes.object.isRequired,
  target: React.PropTypes.func
};

export default Align;
