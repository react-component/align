/* eslint-disable class-methods-use-this */
import React from 'react';
import { mount } from 'enzyme';
import Align from '../src';

describe('element align', () => {
  it('resize', () => {
    jest.useFakeTimers();

    const align = {
      points: ['bc', 'tc'],
    };

    const onAlign = jest.fn();

    class Test extends React.Component {
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
            <Align target={this.getTarget} align={align} onAlign={onAlign} {...this.props}>
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

    const wrapper = mount(<Test monitorWindowResize />);
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

    jest.useRealTimers();
  });
});
/* eslint-enable */
