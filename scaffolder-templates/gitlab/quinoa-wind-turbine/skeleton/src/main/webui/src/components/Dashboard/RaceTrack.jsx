import * as React from 'react';
import styled from 'styled-components';
import { TEAMS_CONFIG } from '../../Config';

const TRACK_WIDTH = 1024;
const TRACK_HEIGHT = 682;

const RaceDiv = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  position: fixed;
  left: 350px;
  top: 0;
  right: 0;
  bottom: 0;
  
  svg {
    height: auto;
    width: 100%;
  }
  
  .car {
    transition: offset-distance 2000ms linear;
    image-rendering: pixelated;
  }
  
  #car1 {
    offset-path: path('M 981.8 319.9 Q 988.4 447.6 988.4 553.0 Q 915.9 678.1 738.0 618.8 Q 645.8 460.8 553.5 474.0 Q 461.3 460.8 408.5 553.0 Q 316.3 671.5 237.2 592.5 L 105.4 355.5 Q 92.3 263.3 158.1 197.5 L 355.8 118.5 Q 408.5 92.2 461.3 118.5 L 540.3 144.8 Q 619.4 144.8 672.1 105.3 L 751.2 52.7 Q 790.7 26.3 843.4 26.3 Q 883.0 39.5 922.5 65.8 Q 948.9 105.3 948.9 144.8 Q 975.2 237.0 988.4 421.3');
    offset-distance: ${(props) => `${props.distance1}%`};
    transform-origin: 35px 60px;
  }
  #car2 {
    offset-path: path('M 948.9 302.8 Q 968.6 441.1 948.9 566.1 Q 883.0 645.1 751.2 579.3 Q 665.5 441.1 553.5 434.5 Q 434.9 434.5 382.2 539.8 Q 316.3 645.1 250.4 546.4 L 138.4 342.3 Q 118.6 256.7 197.7 210.7 L 369.0 144.8 Q 408.5 118.5 461.3 144.8 L 553.5 171.2 Q 632.6 171.2 698.5 131.7 L 777.6 79.0 Q 803.9 52.7 843.4 52.7 Q 909.3 105.3 929.1 151.4 Q 948.9 237.0 948.9 421.3');
    offset-distance: ${(props) => `${props.distance2}%`};
    transform-origin: 35px 60px;
  }
`;

function RaceTrackSvg(props) {
  return (
    <svg
      width={TRACK_WIDTH}
      height={TRACK_HEIGHT}
      viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
      xmlSpace="preserve"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <image
        width={TRACK_WIDTH}
        height={TRACK_HEIGHT}
        preserveAspectRatio="xMidYMid meet"
        xlinkHref="machu-picchu-circuit.png"
      />

      <g className="car" id="car1">
        <image
          xlinkHref={`${TEAMS_CONFIG[0].car}.png`}
        />
      </g>
      <g className="car" id="car2">
        <image
          xlinkHref={`${TEAMS_CONFIG[1].car}.png`}
        />
      </g>
    </svg>
  );
}

function RaceTrack(props) {
  return (
    <RaceDiv distance1={props.distances[0]} distance2={props.distances[1]}>
      <RaceTrackSvg />
    </RaceDiv>
  );
}

export default RaceTrack;
