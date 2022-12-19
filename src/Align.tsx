/**
 * Removed props:
 *  - childrenProps
 */

import { alignElement, alignPoint } from 'dom-align';
import isEqual from 'rc-util/lib/isEqual';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import isVisible from 'rc-util/lib/Dom/isVisible';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
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

    const source = nodeRef.current;

    if (!latestDisabled && latestTarget && source) {
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
  // Handle props change
  const [element, setElement] = React.useState<HTMLElement>();
  const [point, setPoint] = React.useState<TargetPoint>();

  useLayoutEffect(() => {
    setElement(getElement(target));
    setPoint(getPoint(target));
  });

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
