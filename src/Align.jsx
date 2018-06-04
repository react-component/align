import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import shallowequal from 'shallowequal';

import { isWindow, buffer, isSamePoint } from './util';

function getElement(func) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

class Align extends Component {
  static propTypes = {
    childrenProps: PropTypes.object,
    align: PropTypes.object.isRequired,
    target: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        clientX: PropTypes.number,
        clientY: PropTypes.number,
        pageX: PropTypes.number,
        pageY: PropTypes.number,
      }),
    ]),
    onAlign: PropTypes.func,
    monitorBufferTime: PropTypes.number,
    monitorWindowResize: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.any,
  };

  static defaultProps = {
    target: () => window,
    monitorBufferTime: 50,
    monitorWindowResize: false,
    disabled: false,
  };

  componentDidMount() {
    const props = this.props;
    // if parent ref not attached .... use document.getElementById
    this.forceAlign();
    if (!props.disabled && props.monitorWindowResize) {
      this.startMonitorWindowResize();
    }
  }

  componentDidUpdate(prevProps) {
    let reAlign = false;
    const props = this.props;

    if (!props.disabled) {
      if (prevProps.disabled || !shallowequal(prevProps.align, props.align)) {
        reAlign = true;
      } else {
        const lastElement = getElement(prevProps.target);
        const currentElement = getElement(props.target);
        const lastPoint = getPoint(prevProps.target);
        const currentPoint = getPoint(props.target);

        if (isWindow(lastElement) && isWindow(currentElement)) {
          // Skip if is window
          reAlign = false;
        } else if (
          lastElement !== currentElement || // Element change
          (!lastElement && currentPoint) || // Change from element to point
          (!lastPoint && currentElement) || // Change from point to element
          (currentPoint && !isSamePoint(lastPoint, currentPoint))
        ) {
          reAlign = true;
        }
      }
    }

    if (reAlign) {
      this.forceAlign();
    }

    if (props.monitorWindowResize && !props.disabled) {
      this.startMonitorWindowResize();
    } else {
      this.stopMonitorWindowResize();
    }
  }

  componentWillUnmount() {
    this.stopMonitorWindowResize();
  }

  startMonitorWindowResize() {
    if (!this.resizeHandler) {
      this.bufferMonitor = buffer(this.forceAlign, this.props.monitorBufferTime);
      this.resizeHandler = addEventListener(window, 'resize', this.bufferMonitor);
    }
  }

  stopMonitorWindowResize() {
    if (this.resizeHandler) {
      this.bufferMonitor.clear();
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  }

  forceAlign = () => {
    const { disabled, target, align, onAlign } = this.props;
    if (!disabled && target) {
      const source = ReactDOM.findDOMNode(this);

      let result;
      const element = getElement(target);
      const point = getPoint(target);

      if (element) {
        result = alignElement(source, element, align);
      } else if (point) {
        result = alignPoint(source, point, align);
      }

      if (onAlign) {
        onAlign(source, result);
      }
    }
  }

  render() {
    const { childrenProps, children } = this.props;
    const child = React.Children.only(children);
    if (childrenProps) {
      const newProps = {};
      const propList = Object.keys(childrenProps);
      propList.forEach((prop) => {
        newProps[prop] = this.props[childrenProps[prop]];
      });

      return React.cloneElement(child, newProps);
    }
    return child;
  }
}

export default Align;
