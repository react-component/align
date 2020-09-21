import React from 'react';
import Align from '../src';

const Demo = () => {
  const [width, setWidth] = React.useState(100);
  const [height, setHeight] = React.useState(100);
  const [left, setLeft] = React.useState(100);
  const [top, setTop] = React.useState(100);
  const [visible, setVisible] = React.useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setLeft(`${Math.random() * 100}%`);
          setTop(`${Math.random() * 100}%`);
          setWidth(50 + Math.random() * 50);
          setHeight(50 + Math.random() * 50);
        }}
      >
        Random Size and Position
      </button>
      <button
        type="button"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        Trigger Visible
      </button>

      <div
        style={{
          border: '1px solid red',
          width: '90vw',
          height: '50vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            width,
            height,
            border: '1px solid green',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left,
            top,
            display: visible ? 'flex' : 'none',
          }}
          id="content"
        >
          Content
        </div>

        <Align
          target={() => document.getElementById('content')}
          align={{ points: ['tc', 'bc'] }}
        >
          <div
            style={{
              border: '1px solid blue',
              position: 'absolute',
            }}
          >
            Popup
          </div>
        </Align>
      </div>
    </div>
  );
};

export default Demo;
