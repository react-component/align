/* eslint react/no-render-return-value:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import expect from 'expect.js';
import Align from '../src';

describe('point align', () => {
  let container;

  beforeEach(() => {
    container = $('<div>').appendTo(document.body);
  });

  afterEach(() => {
    try {
      ReactDOM.unmountComponentAtNode(container[0]);
    } catch (e) {
      // do nothing...
    }
    if (container) container.remove();
    container = null;
  });

  it('resize', () => {
    const align = {
      points: ['bc', 'tc'],
    };

    class Test extends React.Component {
      state = {
        height: 80,
      };

      getTarget = () => this.$target;

      targetRef = (ele) => {
        this.$target = ele;
      };

      render() {
        const { height } = this.state;

        return (
          <div style={{ paddingTop: 100 }}>
            <div ref={this.targetRef} style={{ display: 'inline-block', width: 50, height: 50 }}>
              target
            </div>
            <Align
              target={this.getTarget}
              align={align}
            >
              <div
                id="ele_src"
                style={{
                  position: 'absolute',
                  width: 50,
                  height,
                }}
              >
                source
              </div>
            </Align>
          </div>
        );
      }
    }

    const instance = ReactDOM.render(<Test />, container[0]);
    const $src = $('#ele_src');
    expect($src.offset().top).to.be(20);

    instance.setState({
      height: 60,
    });
    expect($src.offset().top).to.be(40);
  });
});
