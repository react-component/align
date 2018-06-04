import Align from 'rc-align';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Test extends Component {
  state = {
    monitor: true,
    align: {
      points: ['cc', 'cc'],
    },
  };

  getTarget = () => {
    if (!this.$container) {
      // parent ref not attached
      this.$container = document.getElementById('container');
    }
    return this.$container;
  }

  containerRef = (ele) => {
    this.$container = ele;
  }

  alignRef = (node) => {
    this.$align = node;
  }

  toggleMonitor = () => {
    this.setState({
      monitor: !this.state.monitor,
    });
  }

  forceAlign = () => {
    this.$align.forceAlign();
  }

  render() {
    return (
      <div
        style={{
          margin: 50,
        }}
      >
        <p>
          <button onClick={this.forceAlign}>Force align</button>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input type="checkbox" checked={this.state.monitor} onChange={this.toggleMonitor} />
            &nbsp;
            Monitor window resize
          </label>
        </p>
        <div
          ref={this.containerRef}
          id="container"
          style={{
            width: '80%',
            height: 500,
            border: '1px solid red',
          }}
        >
          <Align
            ref={this.alignRef}
            target={this.getTarget}
            monitorWindowResize={this.state.monitor}
            align={this.state.align}
          >
            <div
              style={{
                position: 'absolute',
                width: 50,
                height: 50,
                background: 'yellow',
              }}
            >
              source
            </div>
          </Align>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
