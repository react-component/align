import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

import { isWindow, buffer, isSamePoint, isSimilarValue, restoreFocus } from './util';

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

  constructor(props) {
    super(props);
    this.alignRef = React.createRef();
  }

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
      const source = this.alignRef.current;
      const sourceRect = source ? source.getBoundingClientRect() : null;

      if (prevProps.disabled) {
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
          (lastElement && !currentElement && currentPoint) || // Change from element to point
          (lastPoint && currentPoint && currentElement) || // Change from point to element
          (currentPoint && !isSamePoint(lastPoint, currentPoint))
        ) {
          reAlign = true;
        }

        // If source element size changed
        const preRect = this.sourceRect || {};
        if (
          !reAlign &&
          source &&
          (!isSimilarValue(preRect.width, sourceRect.width) || !isSimilarValue(preRect.height, sourceRect.height))
        ) {
          reAlign = true;
        }
      }

      this.sourceRect = sourceRect;
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
      const source = this.alignRef.current;

      let result;
      const element = getElement(target);
      const point = getPoint(target);

      // IE lose focus after element realign
      // We should record activeElement and restore later
      const activeElement = document.activeElement;

      if (element) {
        result = alignElement(source, element, align);
      } else if (point) {
        result = alignPoint(source, point, align);
      }

      restoreFocus(activeElement, source);

      if (onAlign) {
        onAlign(source, result);
      }
    }
  }

  render() {
    const { childrenProps, children } = this.props;
    const child = React.Children.only(children);
    const newProps = {};
    const propList = Object.keys(childrenProps || {});
    propList.forEach((prop) => {
      newProps[prop] = this.props[childrenProps[prop]];
    });
    newProps.ref = this.alignRef;
    return React.cloneElement(child, newProps);
  }
}

export default Align;
