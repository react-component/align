/* eslint-disable class-methods-use-this */
import React from 'react';
import { mount } from 'enzyme';
import Align from '../src';

describe('element align', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const align = {
    points: ['bc', 'tc'],
  };

  class Test extends React.Component {
    getTarget = () => this.$target;

    targetRef = ele => {
      this.$target = ele;
    };

    render() {
      return (
        <div style={{ paddingTop: 100 }}>
          <div
            ref={this.targetRef}
            style={{ display: 'inline-block', width: 50, height: 50 }}
          >
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

    const wrapper = mount(<Test monitorWindowResize onAlign={onAlign} />);
    expect(onAlign).toHaveBeenCalled();

    // Window resize
    onAlign.mockReset();
    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalled();

    // Not listen resize
    onAlign.mockReset();
    wrapper.setProps({ monitorWindowResize: false });
    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    expect(onAlign).not.toHaveBeenCalled();

    // Remove should not crash
    wrapper.setProps({ monitorWindowResize: true });
    wrapper.unmount();
  });

  it('disabled should trigger align', () => {
    const onAlign = jest.fn();

    const wrapper = mount(
      <Test monitorWindowResize onAlign={onAlign} disabled />,
    );
    expect(onAlign).not.toHaveBeenCalled();

    wrapper.setProps({ disabled: false });
    jest.runAllTimers();
    expect(onAlign).toHaveBeenCalled();
  });

  it('keepAlign', () => {
    const triggerAlign = jest.fn();

    class TestAlign extends React.Component {
      state = {};

      render = () => <Test INTERNAL_TRIGGER_ALIGN={triggerAlign} keepAlign />;
    }

    const wrapper = mount(<TestAlign />);
    const times = triggerAlign.mock.calls.length;

    for (let i = 0; i < 10; i += 1) {
      wrapper.instance().forceUpdate();
    }

    expect(triggerAlign.mock.calls.length > times).toBeTruthy();
  });
});
/* eslint-enable */
