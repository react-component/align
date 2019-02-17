import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
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
      const source = ReactDOM.findDOMNode(this);
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
      const source = ReactDOM.findDOMNode(this);

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

      // get correct points
      // in dom-align, points will be reset after failed match
      // https://github.com/ant-design/ant-design/issues/14582
      if (result.overflow.adjustX || result.overflow.adjustY) {
        const sourceOffset = source.getBoundingClientRect();
        const targetOffset = element.getBoundingClientRect();
        const sourceCenter = {
          left: sourceOffset.left + sourceOffset.width / 2,
          top: sourceOffset.top + sourceOffset.height / 2,
        };
        const targetCenter = {
          left: targetOffset.left + targetOffset.width / 2,
          top: targetOffset.top + targetOffset.height / 2,
        }
        const ratio = (sourceCenter.left - targetCenter.left) / (sourceCenter.top - targetCenter.top);
        if (ratio >= -1 || ratio <= 1) {
          if (sourceCenter.top < targetCenter.top) {
            result.points = ["bc", "tc"];
          } else {
            result.points = ["tc", "bc"];
          }
        } else {
          /* eslint-disable-next-line */
          if (sourceCenter.left < targetCenter.left) {
            result.points = ["rc", "lc"];
          } else {
            result.points = ["lc", "rc"];
          }
        }
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
