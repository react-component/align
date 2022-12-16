/* eslint-disable @typescript-eslint/no-this-alias */
import 'resize-observer-polyfill';
import { isSamePoint, monitorResize } from '../src/util';

let observer: any;


jest.mock('resize-observer-polyfill', () => {
  return class ResizeObserverMock {
    onResize: any;
    element: any;

    constructor(onResize) {
      this.onResize = onResize;
      observer = this;
    }

    observe(element) {
      this.element = element;
    }

    disconnect() {
      this.element = null;
      this.onResize = null;
    }

    triggerResize() {
      this.onResize([{ target: this.element }]);
    }
  };
});

describe('util', () => {
  describe('isSamePoint', () => {
    it('by page', () => {
      expect(
        isSamePoint(
          { pageX: 1, pageY: 2, clientX: 3, clientY: 4 },
          { pageX: 1, pageY: 2, clientX: 1, clientY: 5 },
        ),
      ).toBeTruthy();
      expect(
        isSamePoint(
          { pageX: 1, pageY: 2, clientX: 3, clientY: 4 },
          { pageX: 5, pageY: 6, clientX: 3, clientY: 4 },
        ),
      ).toBeFalsy();
    });

    it('by client', () => {
      expect(
        isSamePoint(
          { pageX: 0, pageY: 2, clientX: 3, clientY: 4 },
          { pageY: 2, clientX: 3, clientY: 4 },
        ),
      ).toBeTruthy();
      expect(
        isSamePoint({ pageX: 0, pageY: 2, clientX: 3, clientY: 4 }, { clientX: 5, clientY: 4 }),
      ).toBeFalsy();
    });

    it('null should be false', () => {
      expect(isSamePoint({ pageX: 0, pageY: 2, clientX: 3, clientY: 4 }, null)).toBeFalsy();
      expect(isSamePoint(null, { pageX: 0, pageY: 2, clientX: 3, clientY: 4 })).toBeFalsy();
    });
    it('2 empty should be false', () => {
      expect(isSamePoint({}, {})).toBeFalsy();
    });
  });

  describe('monitorResize', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      element.getBoundingClientRect = jest.fn().mockReturnValueOnce({
        width: 100,
        height: 100,
      });
      document.body.appendChild(element);
      jest.useFakeTimers();
      (global as any).requestAnimationFrame = fn => {
        setTimeout(fn, 16);
      };
    });

    afterEach(() => {
      if (element) element.remove();
      jest.useRealTimers();
    });

    it('should defer callback to next frame', async () => {
      const callback = jest.fn();
      monitorResize(element, callback);
      observer.triggerResize();
      jest.runAllTimers();
      await Promise.resolve();
      expect(callback).toHaveBeenCalled();
    });

    it('should skip calling if target is removed already', () => {
      const callback = jest.fn();
      monitorResize(element, callback);
      element.remove();
      observer.triggerResize();
      jest.runAllTimers();
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
