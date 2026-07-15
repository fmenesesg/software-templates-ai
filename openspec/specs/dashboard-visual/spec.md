# Dashboard Visual Specification

## Purpose

Specify the Spanish operator dashboard appearance for the GitLab wind-turbine template skeleton: Machu Picchu circuit background, chasqui sprites on the track, sidebar copy, and winner screen. Race mechanics (SSE distances, `offset-path` animation, start/pause/reset controls) MUST remain intact.

## ADDED Requirements

### Requirement: Circuit and sprites in RaceTrack

`src/main/webui/src/components/Dashboard/RaceTrack.jsx` MUST use `machu-picchu-circuit.png` as the SVG background (replacing `race-track-1.png`). Sprites MUST load from `TEAMS_CONFIG[n].car` + `.png` in groups `#car1` and `#car2`.

| Element | Behavior |
|---------|----------|
| Background | `xlinkHref="machu-picchu-circuit.png"` |
| ViewBox | `0 0 1024 682` (`TRACK_WIDTH` × `TRACK_HEIGHT`) |
| Team 1 sprite | `TEAMS_CONFIG[0].car.png` in `#car1` |
| Team 2 sprite | `TEAMS_CONFIG[1].car.png` in `#car2` |
| Animation | `offset-distance` with `transition: offset-distance 2000ms linear` |
| `offset-path` | MUST use calibrated paths from the KCD demo app for 1024×682 circuit |
| `transform-origin` | `35px 60px` on `#car1` and `#car2` |

CSS class `.car` and IDs `#car1`/`#car2` MUST NOT be renamed.

#### Scenario: Dashboard during active race

- GIVEN the operator opens the dashboard with `status === 'started'`
- WHEN `RaceTrack` receives `distances` from SSE
- THEN the background MUST show the Machu Picchu circuit
- AND two chasqui sprites (blue and red) MUST move along their `offset-path`
- AND `offset-distance 2000ms linear` transition MUST apply

#### Scenario: Sprite misalignment adjustment

- GIVEN the new circuit renders with sprites visibly off the track path
- WHEN the team evaluates misalignment in DevTools
- THEN they MAY adjust `offset-path` coordinates
- AND if no adjustment is made, calibrated demo paths MUST be used as the acceptable baseline

### Requirement: Sidebar copy (LeftBar)

`src/main/webui/src/components/Dashboard/LeftBar.jsx` MUST display Spanish copy. Operator controls (Play/Pause/Reset) and `gameApi.sendEvent` MUST remain functionally unchanged.

| UI element | Expected text |
|------------|---------------|
| Main title | `La Carrera` |
| Team 1 header | `Equipo Azul` (via `TEAM_LABELS_ES[0]`) |
| Team 2 header | `Equipo Rojo` (via `TEAM_LABELS_ES[1]`) |
| Empty player list | `Esperando jugadores...` |

Power values MUST format via `powerApi.humanPower` (displaying `energía`). `The Race` and `Waiting for players...` MUST NOT remain visible.

#### Scenario: Dashboard before game start

- GIVEN the dashboard loads with no connected players
- WHEN `LeftBar` renders
- THEN the title MUST be `La Carrera`
- AND each player list MUST show `Esperando jugadores...`

#### Scenario: Operator starts game

- GIVEN `winner < 0` and `status !== 'started'`
- WHEN the operator presses Play
- THEN `gameApi.sendEvent('start')` MUST execute unchanged
- AND team headers MUST still show `Equipo Azul` and `Equipo Rojo`

### Requirement: Winner screen (Winner)

`src/main/webui/src/components/Dashboard/Winner.jsx` MUST show victory message and leaderboard titles in Spanish. Border and text color MUST use `TEAMS_CONFIG[winner - 1].color`.

| Element | Expected text |
|---------|---------------|
| Blue team wins | `¡Ganó el Equipo Azul!` |
| Red team wins | `¡Ganó el Equipo Rojo!` |
| Overall leaderboard | `Clasificación general` |
| Team 1 leaderboard | `Equipo Azul` |
| Team 2 leaderboard | `Equipo Rojo` |

English patterns `Team {name} won the game!` and `Overall leaderboard` MUST NOT remain visible.

#### Scenario: Blue team wins

- GIVEN `props.rank.winner === 1` with leaderboard data
- WHEN `Winner` renders
- THEN the header MUST show `¡Ganó el Equipo Azul!`
- AND the frame color MUST be `TEAMS_CONFIG[0].color`
- AND columns MUST be titled `Clasificación general`, `Equipo Azul`, `Equipo Rojo`

#### Scenario: Leaderboard preserves power data

- GIVEN players with `generated` power values
- WHEN entries render in any `Winner` column
- THEN each entry MUST show `name - {formatted power}` via `powerApi.humanPower`
- AND numeric values MUST match backend data without unit transformation

### Requirement: Operator dashboard without API regression

The dashboard MUST continue receiving game state and power via existing SSE/API. `LeftBar` offline/started/paused controls MUST behave as before the rebrand.

#### Scenario: Pause and reset unchanged

- GIVEN a `started` game visible on the dashboard
- WHEN the operator presses Pause then Reset
- THEN `pause` and `reset` MUST be sent via `gameApi.sendEvent` as before
- AND `RaceTrack` MUST stop advancing sprites per SSE distance format without data-shape changes
