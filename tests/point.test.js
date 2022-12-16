/* eslint-disable class-methods-use-this */
import { render } from '@testing-library/react';
import React from 'react';
import Align from '../src';

describe('point align', () => {
  function createAlign(props) {
    return (
      <Align {...props}>
        <div id="align" style={{ width: 20, height: 20, position: 'fixed' }} />
      </Align>
    );
  }

  it('not pass point', () => {
    const onAlign = jest.fn();

    render(
      createAlign({
        align: { points: ['cc'] },
        target: null,
        onAlign,
      }),
    );

    expect(onAlign).not.toHaveBeenCalled();
  });

  it('pass point', () => {
    jest.useFakeTimers();
    const onAlign = jest.fn();

    const sharedProps = {
      align: { points: ['tc'] },
      target: null,
      onAlign,
    };

    const { rerender } = render(createAlign(sharedProps));

    expect(onAlign).not.toHaveBeenCalled();

    rerender(
      createAlign({
        ...sharedProps,
        target: { pageX: 1128, pageY: 903 },
      }),
    );

    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
/* eslint-enable */
