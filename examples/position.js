import React, { Component } from 'react';
import Align from '../src';

const align = {
  points: ['cc', 'cc'],
};

class Demo extends Component {
  state = {
    left: 0,
    top: 0,
  };

  eleRef = React.createRef();

  render() {
    const { left, top } = this.state;

    return (
      <div style={{ marginBottom: 170 }}>
        <div
          style={{
            margin: 20,
            border: '1px solid red',
            padding: '100px 0',
            textAlign: 'center',
            position: 'relative',
          }}
          onClick={this.onClick}
        >
          <div
            ref={this.eleRef}
            style={{
              width: 10,
              height: 10,
              background: 'red',
              position: 'absolute',
              left,
              top,
            }}
          />
        </div>

        <Align
          ref={this.alignRef}
          target={() => this.eleRef.current}
          align={align}
          keepingAlign
        >
          <div
            style={{
              position: 'absolute',
              width: 100,
              height: 100,
              background: 'rgba(0, 255, 0, 0.5)',
              pointerEvents: 'none',
            }}
          >
            Align
          </div>
        </Align>

        <button
          type="button"
          onClick={() => {
            this.setState({
              left: Math.random() * 500,
              top: Math.random() * 200,
            });
          }}
        >
          Random Position
        </button>
      </div>
    );
  }
}

export default Demo;
