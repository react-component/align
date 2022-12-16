/**
 * Removed props:
 *  - childrenProps
 */

import { alignElement, alignPoint } from 'dom-align';
import isEqual from 'lodash/isEqual';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import isVisible from 'rc-util/lib/Dom/isVisible';
import { composeRef } from 'rc-util/lib/ref';
import React from 'react';

import useBuffer from './hooks/useBuffer';
import type { AlignResult, AlignType, TargetPoint, TargetType } from './interface';
import { isSamePoint, monitorResize, restoreFocus } from './util';

type OnAlign = (source: HTMLElement, result: AlignResult) => void;

export interface AlignProps {
  align: AlignType;
  target: TargetType;
  onAlign?: OnAlign;
  monitorBufferTime?: number;
  monitorWindowResize?: boolean;
  disabled?: boolean;
  children: React.ReactElement;
}

// interface MonitorRef {
//   element?: HTMLElement;
//   cancel: () => void;
// }

export interface RefAlign {
  forceAlign: () => void;
}

function getElement(func: TargetType) {
  if (typeof func !== 'function') return null;
  return func();
}

function getPoint(point: TargetType) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

const Align: React.ForwardRefRenderFunction<RefAlign, AlignProps> = (
  { children, disabled, target, align, onAlign, monitorWindowResize, monitorBufferTime = 0 },
  ref,
) => {
  const cacheRef = React.useRef<{ element?: HTMLElement; point?: TargetPoint; align?: AlignType }>(
    {},
  );

  /** Popup node ref */
  const nodeRef = React.useRef();
  let childNode = React.Children.only(children);

  // ===================== Align ======================
  // We save the props here to avoid closure makes props ood
  const forceAlignPropsRef = React.useRef<{
    disabled?: boolean;
    target?: TargetType;
    align?: AlignType;
    onAlign?: OnAlign;
  }>({});
  forceAlignPropsRef.current.disabled = disabled;
  forceAlignPropsRef.current.target = target;
  forceAlignPropsRef.current.align = align;
  forceAlignPropsRef.current.onAlign = onAlign;

  const [forceAlign, cancelForceAlign] = useBuffer(() => {
    const {
      disabled: latestDisabled,
      target: latestTarget,
      align: latestAlign,
      onAlign: latestOnAlign,
    } = forceAlignPropsRef.current;
    if (!latestDisabled && latestTarget) {
      const source = nodeRef.current;

      let result: AlignResult;
      const element = getElement(latestTarget);
      const point = getPoint(latestTarget);

      cacheRef.current.element = element;
      cacheRef.current.point = point;
      cacheRef.current.align = latestAlign;

      // IE lose focus after element realign
      // We should record activeElement and restore later
      const { activeElement } = document;

      // We only align when element is visible
      if (element && isVisible(element)) {
        result = alignElement(source, element, latestAlign);
      } else if (point) {
        result = alignPoint(source, point, latestAlign);
      }

      restoreFocus(activeElement, source);

      if (latestOnAlign && result) {
        latestOnAlign(source, result);
      }

      return true;
    }

    return false;
  }, monitorBufferTime);

  // ===================== Effect =====================
  // Listen for target updated
  // const resizeMonitor = React.useRef<MonitorRef>({
  //   cancel: () => {},
  // });
  // Listen for source updated
  // const sourceResizeMonitor = React.useRef<MonitorRef>({
  //   cancel: () => {},
  // });

  // Handle props change
  const element = getElement(target);
  const point = getPoint(target);

  React.useEffect(() => {
    if (
      cacheRef.current.element !== element ||
      !isSamePoint(cacheRef.current.point, point) ||
      !isEqual(cacheRef.current.align, align)
    ) {
      forceAlign();
    }
  });

  // Watch popup element resize
  React.useEffect(() => {
    const cancelFn = monitorResize(nodeRef.current, forceAlign);
    return cancelFn;
  }, [nodeRef.current]);

  // Watch target element resize
  React.useEffect(() => {
    const cancelFn = monitorResize(element, forceAlign);
    return cancelFn;
  }, [element]);

  // React.useEffect(() => {
  //   // const element = getElement(target);
  //   // const point = getPoint(target);

  //   // if (nodeRef.current !== sourceResizeMonitor.current.element) {
  //   //   sourceResizeMonitor.current.cancel();
  //   //   sourceResizeMonitor.current.element = nodeRef.current;
  //   //   sourceResizeMonitor.current.cancel = monitorResize(nodeRef.current, forceAlign);
  //   // }

  //   if (
  //     cacheRef.current.element !== element ||
  //     !isSamePoint(cacheRef.current.point, point) ||
  //     !isEqual(cacheRef.current.align, align)
  //   ) {
  //     forceAlign();

  //     // Add resize observer
  //     if (resizeMonitor.current.element !== element) {
  //       resizeMonitor.current.cancel();
  //       resizeMonitor.current.element = element;
  //       resizeMonitor.current.cancel = monitorResize(element, forceAlign);
  //     }
  //   }
  // });

  // Listen for disabled change
  React.useEffect(() => {
    if (!disabled) {
      forceAlign();
    } else {
      cancelForceAlign();
    }
  }, [disabled]);

  // Listen for window resize
  React.useEffect(() => {
    if (monitorWindowResize) {
      const cancelFn = addEventListener(window, 'resize', forceAlign);

      return cancelFn.remove;
    }
  }, [monitorWindowResize]);

  // Clear all if unmount
  React.useEffect(
    () => () => {
      // resizeMonitor.current.cancel();
      // sourceResizeMonitor.current.cancel();
      // if (winResizeRef.current) winResizeRef.current.remove();
      cancelForceAlign();
    },
    [],
  );

  // ====================== Ref =======================
  React.useImperativeHandle(ref, () => ({
    forceAlign: () => forceAlign(true),
  }));

  // ===================== Render =====================
  if (React.isValidElement(childNode)) {
    childNode = React.cloneElement<any>(childNode, {
      ref: composeRef((childNode as any).ref, nodeRef),
    });
  }

  return childNode;
};

const RcAlign = React.forwardRef(Align);
RcAlign.displayName = 'Align';

export default RcAlign;
