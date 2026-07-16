import _ from 'lodash';
import { Trophy } from '@styled-icons/ionicons-outline';
import React from 'react';
import styled from 'styled-components';
import { powerApi } from '../../api';
import { TEAM_LABELS_ES, TEAMS_CONFIG } from '../../Config';

const WinnerDiv = styled.div`
  position: fixed;
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color};
  left: calc(50% - 400px);
  top: calc(50% - 250px);
  padding: 30px;
  box-sizing: border-box;
  width: 800px;
  height: 600px;
  background-color: #262626;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .winner {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;

    h1 {
      margin-left: 20px;
      font-size: 2.5rem;
    }
  }
  .scroller {
    overflow-y: auto;
    padding: 0px 20px 0 20px;
    height: 100%;
  }
  h3 {
    color: white;
    margin-bottom: 0px;
    text-align: center;
  }
  li {
    color: white;
    line-height: 25px;
  }
  
  ol {
    padding-bottom: 30px;
  }
  
  .leaderboards {
    display: flex;
  }

  .leaderboards > div {
    height: 400px;
    overflow: hidden;
  }
`;

function Leaderboard(props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div className="scroller">
        <ol>
          {props.players.map((u) => (
            <li key={u.name}>
              {u.name}
              {' '}
              -
              {' '}
              {powerApi.humanPower(u.generated)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Winner(props) {
  const teamConfig = TEAMS_CONFIG[props.rank.winner - 1];
  const winnerLabel = TEAM_LABELS_ES[props.rank.winner - 1];
  return (
    <WinnerDiv color={teamConfig.color}>
      <div className="winner">
        <Trophy size={150} />
        <h1>
          ¡Ganó el
          {' '}
          {winnerLabel}
          !
        </h1>
      </div>
      <div className="leaderboards">
        <Leaderboard players={props.rank.overall} title="Clasificación general" />
        <Leaderboard players={props.rank.team1} title={TEAM_LABELS_ES[0]} />
        <Leaderboard players={props.rank.team2} title={TEAM_LABELS_ES[1]} />
      </div>
    </WinnerDiv>
  );
}
