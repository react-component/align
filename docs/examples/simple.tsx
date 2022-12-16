import Align, { type RefAlign } from 'rc-align';
import React, { Component } from 'react';

const allPoints = ['tl', 'tc', 'tr', 'cl', 'cc', 'cr', 'bl', 'bc', 'br'];

interface TestState {
  monitor: boolean;
  random: boolean;
  disabled: boolean;
  randomWidth: number;
  align: any;
  sourceWidth: number;
}

class Test extends Component<{}, TestState> {
  state = {
    monitor: true,
    random: false,
    disabled: false,
    randomWidth: 100,
    align: {
      points: ['cc', 'cc'],
    },
    sourceWidth: 50,
  };

  id: NodeJS.Timer;
  $container: HTMLElement;
  $align: RefAlign;

  componentDidMount() {
    this.id = setInterval(() => {
      const { random } = this.state;
      if (random) {
        this.setState({
          randomWidth: 60 + 40 * Math.random(),
        });
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

  toggleDisabled = () => {
    this.setState(({ disabled }) => ({
      disabled: !disabled,
    }));
  };

  randomAlign = () => {
    const randomPoints = [];
    randomPoints.push(allPoints[Math.floor(Math.random() * 100) % allPoints.length]);
    randomPoints.push(allPoints[Math.floor(Math.random() * 100) % allPoints.length]);
    this.setState({
      align: {
        points: randomPoints,
      },
    });
  };

  forceAlign = () => {
    this.$align.forceAlign();
  };

  toggleSourceSize = () => {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      sourceWidth: this.state.sourceWidth + 10,
    });
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
          <button type="button" onClick={this.toggleSourceSize}>
            Resize Source
          </button>
          &nbsp;&nbsp;&nbsp;
          <button type="button" onClick={this.randomAlign}>
            Random Align
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
          <label>
            <input type="checkbox" checked={this.state.disabled} onChange={this.toggleDisabled} />
            &nbsp; Disabled
          </label>
        </p>
        <div
          ref={this.containerRef}
          id="container"
          style={{
            width: '80%',
            // maxWidth: 1000,
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
            disabled={this.state.disabled}
          >
            <div
              style={{
                position: 'absolute',
                width: this.state.sourceWidth,
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
