import React, { Component } from 'react';
import Align from '../../src';

const align = {
  points: ['cc', 'cc'],
};

class Demo extends Component {
  state = {
    point: null,
  };

  onClick = ({ pageX, pageY }) => {
    this.setState({ point: { pageX, pageY } });
  };

  render() {
    return (
      <div style={{ marginBottom: 170 }}>
        <div
          style={{ margin: 20, border: '1px solid red', padding: '100px 0', textAlign: 'center' }}
          onClick={this.onClick}
        >
          Click this region please : )
        </div>

        <Align ref={this.alignRef} target={this.state.point} align={align}>
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
      </div>
    );
  }
}

export default Demo;
