/* eslint-disable class-methods-use-this */
import React from 'react';
import { mount } from 'enzyme';
import Align from '../src';

describe('point align', () => {
  function createAlign(props) {
    return mount(
      <Align {...props}>
        <div id="align" style={{ width: 20, height: 20, position: 'fixed' }} />
      </Align>,
    );
  }

  it('not pass point', () => {
    const onAlign = jest.fn();

    createAlign({
      align: { points: ['cc'] },
      target: null,
      onAlign,
    });

    expect(onAlign).not.toHaveBeenCalled();
  });

  it('pass point', () => {
    jest.useFakeTimers();
    const onAlign = jest.fn();
    const wrapper = createAlign({
      align: { points: ['tc'] },
      target: null,
      onAlign,
    });

    expect(onAlign).not.toHaveBeenCalled();

    wrapper.setProps({ target: { pageX: 1128, pageY: 903 } });
    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
/* eslint-enable */
