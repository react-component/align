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
      this.hackRefTimer = setTimeout(() => {
        var source = React.findDOMNode(this);
        props.onAlign(source, align(source, props.target(), props.align));
      }, 0);
      if (props.monitorWindowResize) {
        this.startMonitorWindowResize();
      }
    }
  }

  componentWillReceiveProps() {
    this.clearHackRefTimer();
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

  clearHackRefTimer() {
    if (this.hackRefTimer) {
      clearTimeout(this.hackRefTimer);
      this.hackRefTimer = null;
    }
  }

  handleWindowResize() {
    var props = this.props;
    if (!props.disabled) {
      var source = React.findDOMNode(this);
      props.onAlign(source, align(source, props.target(), props.align));
    }
  }

  componentWillUnmount() {
    this.stopMonitorWindowResize();
    this.clearHackRefTimer();
  }

  componentDidUpdate(prevProps) {
    var reAlign = false;
    var props = this.props;
    var self = this;
    var currentTarget;

    this.hackRefTimer = setTimeout(() => {
      if (!props.disabled) {
        currentTarget = props.target();
        if (prevProps.disabled || prevProps.align !== props.align) {
          reAlign = true;
        } else {
          var prevTarget = prevProps.target();
          if (isWindow(prevTarget) && isWindow(currentTarget)) {
            reAlign = false;
          } else if (prevTarget !== currentTarget) {
            reAlign = true;
          } else if (prevTarget === currentTarget) {
            var currentTargetClientRect = currentTarget.getBoundingClientRect();
            // `rcUtil.shallowEqual` does not work here,
            // for `top`, `right`, `bottom`, `left` are in the prototype of `ClientRect`.
            if (self._prevTargetClientRect &&
                (self._prevTargetClientRect.top !== currentTargetClientRect.top ||
                 self._prevTargetClientRect.right !== currentTargetClientRect.right ||
                 self._prevTargetClientRect.bottom !== currentTargetClientRect.bottom ||
                 self._prevTargetClientRect.left !== currentTargetClientRect.left)) {
              reAlign = true;
            }
            self._prevTargetClientRect = currentTargetClientRect;
          }
        }
      }

      if (reAlign) {
        var source = React.findDOMNode(this);
        props.onAlign(source, align(source, currentTarget, props.align));
      }
    }, 0);

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
  disabled: false
};

Align.PropTypes = {
  align: React.PropTypes.object.isRequired,
  target: React.PropTypes.func,
  onAlign: React.PropTypes.func,
  monitorBufferTime: React.PropTypes.number,
  monitorWindowResize: React.PropTypes.bool,
  disabled: React.PropTypes.bool
};

export default Align;
