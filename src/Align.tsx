/**
 * Removed props:
 *  - childrenProps
 */

import React from 'react';
import { composeRef } from 'rc-util/lib/ref';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

import { isSamePoint, restoreFocus, monitorResize } from './util';
import { AlignType, AlignResult, TargetType, TargetPoint } from './interface';
import useBuffer from './hooks/useBuffer';

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

interface MonitorRef {
  element?: HTMLElement;
  cancel: () => void;
}

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

const Align: React.RefForwardingComponent<RefAlign, AlignProps> = (
  { children, disabled, target, align, onAlign, monitorWindowResize, monitorBufferTime = 0 },
  ref,
) => {
  const cacheRef = React.useRef<{ element?: HTMLElement; point?: TargetPoint }>({});
  const nodeRef = React.useRef();
  let childNode = React.Children.only(children);

  // ===================== Align ======================
  // We save the props here to avoid closure makes props ood
  const forceAlignPropsRef = React.useRef<{
    disabled?: boolean;
    target?: TargetType;
    onAlign?: OnAlign;
  }>({});
  forceAlignPropsRef.current.disabled = disabled;
  forceAlignPropsRef.current.target = target;
  forceAlignPropsRef.current.onAlign = onAlign;

  const [forceAlign, cancelForceAlign] = useBuffer(() => {
    const { disabled: latestDisabled, target: latestTarget } = forceAlignPropsRef.current;
    if (!latestDisabled && latestTarget) {
      const source = nodeRef.current;

      let result: AlignResult;
      const element = getElement(latestTarget);
      const point = getPoint(latestTarget);

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

      return true;
    }

    return false;
  }, monitorBufferTime);

  // ===================== Effect =====================
  // Listen for target updated
  const resizeMonitor = React.useRef<MonitorRef>({
    cancel: () => {},
  });
  // Listen for source updated
  const sourceResizeMonitor = React.useRef<MonitorRef>({
    cancel: () => {},
  });
  React.useEffect(() => {
    const element = getElement(target);
    const point = getPoint(target);

    if (nodeRef.current !== sourceResizeMonitor.current.element) {
      sourceResizeMonitor.current.cancel();
      sourceResizeMonitor.current.element = nodeRef.current;
      sourceResizeMonitor.current.cancel = monitorResize(nodeRef.current, forceAlign);
    }

    if (cacheRef.current.element !== element || !isSamePoint(cacheRef.current.point, point)) {
      forceAlign();

      // Add resize observer
      if (resizeMonitor.current.element !== element) {
        resizeMonitor.current.cancel();
        resizeMonitor.current.element = element;
        resizeMonitor.current.cancel = monitorResize(element, forceAlign);
      }
    }
  });

  // Listen for disabled change
  React.useEffect(() => {
    if (!disabled) {
      forceAlign();
    } else {
      cancelForceAlign();
    }
  }, [disabled]);

  // Listen for window resize
  const winResizeRef = React.useRef<{ remove: Function }>(null);
  React.useEffect(() => {
    if (monitorWindowResize) {
      if (!winResizeRef.current) {
        winResizeRef.current = addEventListener(window, 'resize', forceAlign);
      }
    } else if (winResizeRef.current) {
      winResizeRef.current.remove();
      winResizeRef.current = null;
    }
  }, [monitorWindowResize]);

  // Clear all if unmount
  React.useEffect(
    () => () => {
      resizeMonitor.current.cancel();
      sourceResizeMonitor.current.cancel();
      if (winResizeRef.current) winResizeRef.current.remove();
      cancelForceAlign();
    },
    [],
  );

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

  return childNode;
};

const RefAlign = React.forwardRef(Align);
RefAlign.displayName = 'Align';

export default RefAlign;
