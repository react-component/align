/* eslint react/no-render-return-value:0 */

import expect from 'expect.js';
import { isSamePoint } from '../src/util';

describe('util', () => {
  describe('isSamePoint', () => {
    it('by page', () => {
      expect(
        isSamePoint(
          { pageX: 1, pageY: 2, clientX: 3, clientY: 4 },
          { pageX: 1, pageY: 2, clientX: 1, clientY: 5 },
        )
      ).to.be.ok();
      expect(
        isSamePoint(
          { pageX: 1, pageY: 2, clientX: 3, clientY: 4 },
          { pageX: 5, pageY: 6, clientX: 3, clientY: 4 },
        )
      ).not.to.be.ok();
    });

    it('by client', () => {
      expect(
        isSamePoint(
          { pageX: 0, pageY: 2, clientX: 3, clientY: 4 },
          { pageY: 2, clientX: 3, clientY: 4 },
        )
      ).to.be.ok();
      expect(
        isSamePoint(
          { pageX: 0, pageY: 2, clientX: 3, clientY: 4 },
          { clientX: 5, clientY: 4 },
        )
      ).not.to.be.ok();
    });
  });
});
