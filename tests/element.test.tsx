/* eslint-disable class-methods-use-this */
import { render } from '@testing-library/react';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Align from '../src';

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

  const align = {
    points: ['bc', 'tc'],
  };

  class Test extends React.Component<any> {
    $target: any;

    getTarget = () => this.$target;

    targetRef = ele => {
      this.$target = ele;
    };

    render() {
      return (
        <div style={{ paddingTop: 100 }}>
          <div ref={this.targetRef} style={{ display: 'inline-block', width: 50, height: 50 }}>
            target
          </div>
          <Align target={this.getTarget} align={align} {...this.props}>
            <div
              id="ele_src"
              style={{
                position: 'absolute',
                width: 50,
                height: 80,
              }}
            >
              source
            </div>
          </Align>
        </div>
      );
    }
  }

  it('resize', () => {
    const onAlign = jest.fn();

    const { unmount, rerender } = render(<Test monitorWindowResize onAlign={onAlign} />);
    expect(onAlign).toHaveBeenCalled();

    // Window resize
    onAlign.mockReset();
    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalled();

    // Not listen resize
    onAlign.mockReset();
    rerender(<Test monitorWindowResize={false} onAlign={onAlign} />);
    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    expect(onAlign).not.toHaveBeenCalled();

    // Remove should not crash
    rerender(<Test monitorWindowResize onAlign={onAlign} />);
    unmount();
  });

  it('disabled should trigger align', () => {
    const onAlign = jest.fn();

    const { rerender } = render(<Test monitorWindowResize onAlign={onAlign} disabled />);
    expect(onAlign).not.toHaveBeenCalled();

    rerender(<Test monitorWindowResize onAlign={onAlign} disabled={false} />);
    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/31717
  it('changing align should trigger onAlign', () => {
    const onAlign = jest.fn();
    const { rerender } = render(<Test align={{ points: ['cc', 'cc'] }} onAlign={onAlign} />);
    expect(onAlign).toHaveBeenCalledTimes(1);
    expect(onAlign).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ points: ['cc', 'cc'] }),
    );
    // wrapper.setProps({ align: { points: ['cc', 'tl'] } });
    rerender(<Test align={{ points: ['cc', 'tl'] }} onAlign={onAlign} />);
    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalledTimes(2);
    expect(onAlign).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ points: ['cc', 'tl'] }),
    );
  });

  it('should switch to the correct align callback after starting the timers', () => {
    // This test case is tricky. An error occurs if the following things happen
    // exactly in this order:
    // * Render <Align> with `onAlign1`.
    // * The callback in useBuffer is queued using setTimeout, to trigger after
    //   `monitorBufferTime` ms (which even when it's set to 0 is queued and
    //   not synchronously executed).
    // * The onAlign prop is changed to `onAlign2`.
    // * The callback from useBuffer is called. The now correct onAlign
    //   callback would be `onAlign2`, and `onAlign1` should not be called.
    // This changing of the prop in between a 0 ms timeout is extremely rare.
    // It does however occur more often in real-world applications with
    // react-component/trigger, when its requestAnimationFrame and this timeout
    // race against each other.

    const onAlign1 = jest.fn();
    const onAlign2 = jest.fn();

    const { rerender } = render(<Test onAlign={onAlign1} />);

    // Make sure the initial render's call to onAlign does not matter.
    onAlign1.mockReset();
    onAlign2.mockReset();

    // Re-render the component with the new callback. Expect from here on all
    // callbacks to call the new onAlign2.
    rerender(<Test onAlign={onAlign2} />);

    // Now the timeout is executed, and we expect the onAlign2 callback to
    // receive the call, not onAlign1.
    jest.runAllTimers();

    expect(onAlign1).not.toHaveBeenCalled();
    expect(onAlign2).toHaveBeenCalled();
  });

  it('SSR no break', () => {
    const str = renderToString(
      <Test
        align={{ points: ['cc', 'cc'] }}
        target={() => {
          throw new Error('Not Call In Render');
        }}
      />,
    );
    expect(str).toBeTruthy();
  });
});
/* eslint-enable */
