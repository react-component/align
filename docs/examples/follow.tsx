import React from 'react';
import Align from '../../src';

const Demo = () => {
  const [width, setWidth] = React.useState(100);
  const [height, setHeight] = React.useState(100);
  const [left, setLeft] = React.useState<string | number>(100);
  const [top, setTop] = React.useState<string | number>(100);
  const [visible, setVisible] = React.useState(true);
  const [svg, setSvg] = React.useState(false);

  const sharedStyle: React.CSSProperties = {
    width,
    height,
    position: 'absolute',
    left,
    top,
    display: visible ? 'flex' : 'none',
  };

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
      <button
        type="button"
        onClick={() => {
          setSvg(!svg);
        }}
      >
        Follow SVG ({String(svg)})
      </button>

      <div
        style={{
          border: '1px solid red',
          height: '50vh',
          position: 'relative',
        }}
      >
        {svg ? (
          <svg id="content" width={width} height={height} style={sharedStyle}>
            <rect x="0" y="0" width={width} height={height} />
          </svg>
        ) : (
          <div
            style={{
              border: '1px solid green',
              boxSizing: 'border-box',
              alignItems: 'center',
              justifyContent: 'center',
              ...sharedStyle,
            }}
            id="content"
          >
            Content
          </div>
        )}

        <Align target={() => document.getElementById('content')} align={{ points: ['tc', 'bc'] }}>
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
