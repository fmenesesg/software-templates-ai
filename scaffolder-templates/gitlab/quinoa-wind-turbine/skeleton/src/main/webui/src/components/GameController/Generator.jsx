import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  TAP_POWER, ENABLE_BLOWING, ENABLE_TAPPING, ENABLE_SWIPING, IS_TOUCH_DEVICE,
} from '../../Config';
import { powerApi, sensors } from '../../api';

const GeneratorDiv = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BadgeImage = styled.img`
  height: 320px;
  width: auto;
  cursor: pointer;
  user-select: none;
  image-rendering: auto;
  transform: rotate(${(props) => props.generated * 3}deg);
  transform-origin: center center;
  transition: transform 400ms;
`;

const GeneratedIndicatorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  line-height: 3rem;
  margin-top: 40px;
  color: #007bff;

  &:after {
    content: '${(props) => props.unit}';
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: bold;
  }
`;

function Generator(props) {
  if (ENABLE_BLOWING) {
    useEffect(() => {
      const interval = setInterval(() => {
        const volume = sensors.getVolume();
        if (!volume) {
          return;
        }
        if (volume > 20) {
          props.generatePower(volume);
        }
      }, 200);
      return () => clearInterval(interval);
    }, []);
  }

  if (ENABLE_SWIPING) {
    useEffect(() => {
      sensors.startSwipeSensor((d, diff) => {
        const power = Math.min(100, Math.round(Math.abs(diff) / 5));
        props.generatePower(power);
      });
    }, []);
  }

  if (props.shakingEnabled) {
    useEffect(() => {
      sensors.startShakeSensor((magnitude) => {
        const power = Math.min(magnitude, 100);
        props.generatePower(power);
      });
    }, []);
  }

  const onTap = () => {
    if (ENABLE_TAPPING) {
      props.generatePower(TAP_POWER, true);
    }
  };

  const onClick = () => {
    if (!IS_TOUCH_DEVICE && ENABLE_TAPPING) {
      props.generatePower(TAP_POWER, true);
    }
  };

  return (
    <>
      <GeneratorDiv>
        <BadgeImage
          src="./kcd-lima-2026.png"
          alt="KCD Lima 2026"
          id="generator"
          generated={props.generated}
          onTouchStart={onTap}
          onClick={onClick}
        />
      </GeneratorDiv>
      <GeneratedIndicatorDiv
        unit={powerApi.humanPowerUnit(props.generated)}
        id="power-generator"
      >
        {powerApi.humanPowerValue(props.generated)}
      </GeneratedIndicatorDiv>
    </>
  );
}

export default Generator;
