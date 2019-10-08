import React, { Component } from 'react';
import Align from '../src';

class Test extends Component {
  state = {
    monitor: true,
    random: false,
    randomWidth: 100,
    align: {
      points: ['cc', 'cc'],
    },
  };

  componentDidMount() {
    this.id = setInterval(() => {
      const { random } = this.state;
      if (random) {
        this.setState(
          {
            randomWidth: 60 + 40 * Math.random(),
          },
          () => {
            this.forceAlign();
          },
        );
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.id);
  }

  getTarget = () => {
    if (!this.$container) {
      // parent ref not attached
      this.$container = document.getElementById('container');
    }
    return this.$container;
  };

  containerRef = ele => {
    this.$container = ele;
  };

  alignRef = node => {
    this.$align = node;
  };

  toggleMonitor = () => {
    this.setState(({ monitor }) => ({
      monitor: !monitor,
    }));
  };

  toggleRandom = () => {
    this.setState(({ random }) => ({
      random: !random,
    }));
  };

  forceAlign = () => {
    this.$align.forceAlign();
  };

  render() {
    const { random, randomWidth } = this.state;

    return (
      <div
        style={{
          margin: 50,
        }}
      >
        <p>
          <button type="button" onClick={this.forceAlign}>
            Force align
          </button>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input type="checkbox" checked={this.state.monitor} onChange={this.toggleMonitor} />
            &nbsp; Monitor window resize
          </label>
          <label>
            <input type="checkbox" checked={this.state.random} onChange={this.toggleRandom} />
            &nbsp; Random Size
          </label>
        </p>
        <div
          ref={this.containerRef}
          id="container"
          style={{
            // width: '80%',
            maxWidth: 1000,
            height: 500,
            border: '1px solid red',
            ...(random
              ? {
                  width: `${randomWidth}%`,
                }
              : null),
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
              <input defaultValue="source" style={{ width: '100%' }} />
            </div>
          </Align>
        </div>
      </div>
    );
  }
}

export default Test;
