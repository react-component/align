/**
 * Removed props:
 *  - childrenProps
 */

import React from 'react';
import { composeRef } from 'rc-util/lib/ref';
import findDOMNode from 'rc-util/lib/Dom/findDOMNode';
import ResizeObserver from 'rc-resize-observer';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

import { isWindow, buffer, isSamePoint, isSimilarValue, restoreFocus } from './util';
import { AlignType, AlignResult, TargetType, TargetPoint } from './interface';

export interface AlignProps {
  align: AlignType;
  target: TargetType;
  onAlign: (source: HTMLElement, result: AlignResult) => void;
  monitorBufferTime: number;
  monitorWindowResize: boolean;
  disabled: boolean;
  children: React.ReactElement;
}

export interface RefAlign {
  forceAlign: () => void;
}

function getElement(func: TargetType) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point: TargetType) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

const Align: React.RefForwardingComponent<RefAlign, AlignProps> = (
  { children, disabled, target, align, onAlign, monitorWindowResize, monitorBufferTime },
  ref,
) => {
  const cacheRef = React.useRef<{ element?: HTMLElement; point?: TargetPoint }>({});
  const nodeRef = React.useRef();
  let childNode = React.Children.only(children);

  // ===================== Align ======================
  const forceAlign = () => {
    if (!disabled && target) {
      const source = findDOMNode<HTMLElement>(nodeRef.current);

      let result: AlignResult;
      const element = getElement(target);
      const point = getPoint(target);

      cacheRef.current.element = element;
      cacheRef.current.point = point;

      // IE lose focus after element realign
      // We should record activeElement and restore later
      const { activeElement } = document;

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
  };

  // ===================== Effect =====================
  // Listen for target updated
  React.useEffect(() => {
    const element = getElement(target);
    const point = getPoint(target);

    if (cacheRef.current.element !== element || !isSamePoint(cacheRef.current.point, point)) {
      forceAlign();
    }
  });

  // Listen for window resize
  const bufferRef = React.useRef<{ clear: Function }>();
  const resizeRef = React.useRef<{ remove: Function }>();
  React.useEffect(() => {
    if (monitorWindowResize) {
      if (!resizeRef.current) {
        bufferRef.current = buffer(forceAlign, monitorBufferTime);
        resizeRef.current = addEventListener(window, 'resize', bufferRef.current);
      }
    } else if (resizeRef.current) {
      bufferRef.current.clear();
      resizeRef.current.remove();
      resizeRef.current = null;
    }
  }, [monitorWindowResize]);

  // ====================== Ref =======================
  React.useImperativeHandle(ref, () => ({
    forceAlign,
  }));

  // ===================== Render =====================
  if (React.isValidElement(childNode)) {
    childNode = React.cloneElement(childNode, {
      ref: composeRef((childNode as any).ref, nodeRef),
    });
  }

  return <ResizeObserver onResize={forceAlign}>{childNode}</ResizeObserver>;
};

const RefAlign = React.forwardRef(Align);
RefAlign.displayName = 'Align';

export default RefAlign;
