import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import align from 'dom-align';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import isWindow from './isWindow';

function buffer(fn, ms) {
  let timer;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function bufferFn() {
    clear();
    timer = setTimeout(fn, ms);
  }

  (bufferFn as any).clear = clear;

  return bufferFn;
}

export interface IAlignProps {
  childrenProps?: {};
  align: {};
  target: () => void;
  onAlign?: (source: any, align: any) => void;
  monitorBufferTime?: number;
  monitorWindowResize?: boolean;
  disabled?: boolean;
}

class Align extends Component<IAlignProps, any> {
  static defaultProps = {
    target: () => window,
    onAlign: () => {},
    monitorBufferTime: 50,
    monitorWindowResize: false,
    disabled: false,
  };

  resizeHandler: any;
  bufferMonitor: any;

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
      if (prevProps.disabled || prevProps.align !== props.align) {
        reAlign = true;
      } else {
        const lastTarget = prevProps.target();
        const currentTarget = props.target();
        if (isWindow(lastTarget) && isWindow(currentTarget)) {
          reAlign = false;
        } else if (lastTarget !== currentTarget) {
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
    const props = this.props;
    if (!props.disabled) {
      const source = ReactDOM.findDOMNode(this);
      props.onAlign!(source, align(source, props.target(), props.align));
    }
  }

  render() {
    const { childrenProps, children } = this.props;
    const child = React.Children.only(children);
    if (childrenProps) {
      const newProps = {};
      for (const prop in childrenProps) {
        if (childrenProps.hasOwnProperty(prop)) {
          newProps[prop] = this.props[childrenProps[prop]];
        }
      }
      return React.cloneElement(child, newProps);
    }
    return child;
  }
}

export default Align;
