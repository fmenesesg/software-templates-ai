import React from 'react';

export default function Turbine(props) {
  return (
    <img
      src={`./${props.sprite}.png`}
      alt="chasqui"
      id="generator"
      onTouchStart={props.onTap}
      onClick={props.onClick}
      style={{
        height: '320px',
        width: 'auto',
        imageRendering: 'pixelated',
        cursor: 'pointer',
        userSelect: 'none',
        transform: `rotate(${props.generated * 3}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 400ms',
      }}
    />
  );
}
