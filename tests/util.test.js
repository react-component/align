import { isSamePoint } from '../src/util';

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

    it('by change', () => {
      expect(isSamePoint({ pageX: 0, pageY: 2, clientX: 3, clientY: 4 }, null)).toBeFalsy();
      expect(isSamePoint(null, { pageX: 0, pageY: 2, clientX: 3, clientY: 4 })).toBeFalsy();
    });
    it('2 empty should be false', () => {
      expect(isSamePoint({}, {})).toBeFalsy();
    });
  });
});
