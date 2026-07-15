import React from 'react';
import styled from 'styled-components';
import { TEAMS_CONFIG, TEAM_LABELS_ES } from '../../Config';

const TeamContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(3px);
  align-items: center;
  justify-content: center;
`;

const TeamHeader = styled.div`
  display:block;
  float:right;
  position:relative;
  clear:both;
  font-size: 2rem;
`;

const TeamSelectionButton = styled.div`
  
  width: 200px;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  
  svg {
    margin-right: 10px;
  }

  .button1 {
    padding: 10px;
    background-color: ${TEAMS_CONFIG[0].color};
  }
  .button2 {
    padding: 10px;
    background-color: ${TEAMS_CONFIG[1].color};
  }
`;



export default function ChooseTeamModal(props) {
  return (
    <TeamContainer>  
      <TeamHeader>
        Elige tu equipo:
      </TeamHeader>
      <TeamSelectionButton onClick={() => props.onClick(1)}>
        <div className='button1'>{TEAM_LABELS_ES[0]}</div>     
      </TeamSelectionButton>
      <TeamSelectionButton onClick={() => props.onClick(2)}>
        <div className='button2'>{TEAM_LABELS_ES[1]}</div>
      </TeamSelectionButton>          
    </TeamContainer>
  );
}
