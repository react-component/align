/* eslint react/no-render-return-value:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import expect from 'expect.js';
import Align from '../src';

describe('point align', () => {
  let container;

  function createAlign(props, callback) {
    class Test extends React.Component {
      state = {};

      render() {
        return (
          <Align {...props} {...this.state}>
            <div
              id="align"
              style={{ width: 20, height: 20, position: 'fixed' }}
            />
          </Align>
        );
      }
    }

    return ReactDOM.render(<Test />, container[0], callback);
  }

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

  it('not pass point', (done) => {
    createAlign(
      {
        align: { points: ['cc'] },
        target: null,
      },
      () => {
        const $align = $('#align')[0];
        expect($align).to.be.ok();
        expect($align.style.left).to.not.be.ok();
        expect($align.style.top).to.not.be.ok();
        done();
      },
    );
  });

  it('pass point', (done) => {
    const wrapper = createAlign(
      {
        align: { points: ['tc'] },
        target: null,
      },
    );

    wrapper.setState({
      target: { pageX: 1128, pageY: 903 },
    }, () => {
      const $align = $('#align');
      expect($align[0]).to.be.ok();
      expect($align.offset().left).to.be(1118);
      expect($align.offset().top).to.be(903);

      wrapper.setState({
        target: { pageX: 321, pageY: 613 },
      }, () => {
        expect($align.offset().left).to.be(311);
        expect($align.offset().top).to.be(613);

        done();
      });
    });
  });
});
