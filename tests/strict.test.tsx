/* eslint-disable class-methods-use-this */
import { act, render } from '@testing-library/react';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import React from 'react';
import Align from '../src';

(global as any).watchCnt = 0;

jest.mock('../src/util', () => {
  const originUtil = jest.requireActual('../src/util');

  return {
    ...originUtil,
    monitorResize: (...args: any[]) => {
      (global as any).watchCnt += 1;
      console.log('mount', (global as any).watchCnt);
      const cancelFn = originUtil.monitorResize(...args);

      return () => {
        (global as any).watchCnt -= 1;
        console.log('unmount', (global as any).watchCnt);
        cancelFn();
      };
    },
  };
});

describe('element align', () => {
  beforeAll(() => {
    spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => ({}),
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('StrictMode should keep resize observer', () => {
    const Demo = () => {
      const targetRef = React.useRef(null);

      return (
        <>
          <div ref={targetRef} />
          <Align target={() => targetRef.current} align={{ points: ['bc', 'tc'] }}>
            <div
              style={{
                position: 'absolute',
                width: 50,
                height: 80,
              }}
            />
          </Align>
        </>
      );
    };

    render(
      <React.StrictMode>
        <Demo />
      </React.StrictMode>,
    );

    act(() => {
      jest.runAllTimers();
    });

    console.log('====================================');
  });
});
/* eslint-enable */
