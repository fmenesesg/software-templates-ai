# Player UI Specification

## Purpose

Specify Spanish copy and KCD Lima chasqui theming for the mobile player interface (`GameController/`) in the GitLab wind-turbine template skeleton. Tap→power→SSE mechanics, game states (`start`/`pause`/`reset`/`finish`), and backend power units MUST remain unchanged. No i18n framework: Spanish strings are hardcoded or sourced from `TEAM_LABELS_ES` in `Config.js`.

## ADDED Requirements

### Requirement: Team selection modal (ChooseTeamModal)

`src/main/webui/src/components/GameController/ChooseTeamModal.jsx` MUST display Spanish copy only. Buttons MUST invoke `onClick(1)` and `onClick(2)` without altering assignment logic.

| UI element | Expected text |
|------------|---------------|
| Header | `Elige tu equipo:` |
| Team 1 button | `Equipo Azul` (from `TEAM_LABELS_ES[0]`) |
| Team 2 button | `Equipo Rojo` (from `TEAM_LABELS_ES[1]`) |

Button background colors MUST derive from `TEAMS_CONFIG[0].color` and `TEAMS_CONFIG[1].color`. The English prefix `Team` MUST NOT appear in visible UI.

#### Scenario: First visit without team assigned

- GIVEN a player opens the mobile app without a team (`teamChosen === false`)
- WHEN `ChooseTeamModal` renders
- THEN the header MUST show `Elige tu equipo:`
- AND buttons MUST show `Equipo Azul` and `Equipo Rojo`

#### Scenario: Blue team selection

- GIVEN the modal is visible with both buttons
- WHEN the player taps `Equipo Azul`
- THEN `onClick(1)` MUST execute
- AND `gameApi.assign(1)` MUST be sent with no API contract change

### Requirement: Player top bar (TopBar)

`TopBar.jsx` MUST show the player name, Spanish team label, and connection/game status. The team label MUST be `Equipo Azul` or `Equipo Rojo` (via `TEAM_LABELS_ES`), not raw `Blue Team` / `Red Team`.

| Element | Behavior |
|---------|----------|
| Team label | `TEAM_LABELS_ES[user.team - 1]` |
| Bar color | `TEAMS_CONFIG[user.team - 1].color` |
| Status icons | Unchanged: `Bolt` (started), `CloudDone` (paused), `CloudOffline` (offline) |

#### Scenario: Red team player during active game

- GIVEN a user with `team === 2` and `status === 'started'`
- WHEN `TopBar` renders
- THEN the team label MUST show `Equipo Rojo`
- AND the background color MUST be `TEAMS_CONFIG[1].color`
- AND the `Bolt` icon MUST be visible

### Requirement: Waiting screen (GameController — not started)

When `status.value` is neither `started` nor `finished`, `StatusContent` MUST show the team chasqui sprite and a Spanish waiting message.

| Element | Expected value |
|---------|----------------|
| Image | `./${TEAMS_CONFIG[user.team - 1].car}.png` |
| Message | `Esperando partida…` |

The English string `Waiting for game...` MUST NOT remain visible.

#### Scenario: Player waiting for game start

- GIVEN a user with an assigned team and `status.value === 'paused'` or `'initial'`
- WHEN the waiting screen renders
- THEN the team chasqui sprite MUST be visible
- AND the text MUST be exactly `Esperando partida…`

### Requirement: Themed generator (Turbine / Generator)

`Turbine.jsx` MUST render a chasqui sprite as an `<img>` (not a wind-turbine SVG), loading `./${props.sprite}.png` with `imageRendering: 'pixelated'`. `Generator.jsx` MUST preserve:

- `.turbine` rotation proportional to `generated` on tap
- `onTap` / `onClick` handlers unchanged
- Power display via `powerApi.humanPowerValue` / `humanPowerUnit`

Component names (`Turbine`, `Generator`) and CSS classes (`.turbine`, `.turbine-item`) MUST NOT be renamed. `Generator.jsx` MUST display the `kcd-lima-2026.png` event badge.

#### Scenario: Tap generates power with animation

- GIVEN `status.value === 'started'` and `ENABLE_TAPPING === true`
- WHEN the player taps the generator
- THEN `generatePower(TAP_POWER)` MUST be invoked
- AND visual rotation MUST update per `generated`
- AND the numeric indicator MUST use `powerApi` formatting

#### Scenario: Chasqui sprite visible during game

- GIVEN an active game on a mobile device
- WHEN `Generator` renders
- THEN the generator MUST show a chasqui `<img>` sprite (not wind-turbine blades)
- AND the `kcd-lima-2026.png` badge MUST be visible

### Requirement: Post-game rank modal (RankModal)

`RankModal.jsx` MUST use Spanish copy without changing rank calculation logic.

| Element | Expected text |
|---------|---------------|
| Title | `Clasificación general` |

The string `Overall Rank` MUST NOT remain visible.

#### Scenario: Finished game shows Spanish rank

- GIVEN `status.value === 'finished'` with ranking data
- WHEN `RankModal` renders
- THEN the title MUST show `Clasificación general`
- AND position MUST still compute as `overall.findIndex + 1`

### Requirement: Power display labels (PowerApi)

`src/main/webui/src/api/PowerApi.js` MUST display power using the flat Spanish label `energía` via `humanPowerUnit()`, `humanPowerValue()`, and `humanPower()`. MW/KW unit switching MUST NOT appear in the UI.

#### Scenario: Power shown as energía

- GIVEN a player or dashboard displays formatted power
- WHEN `powerApi.humanPower(watts)` is called
- THEN the output MUST match `{watts} energía`
- AND `humanPowerUnit()` MUST return `energía`

### Requirement: Game SSE connect without auto-reset (GameApi)

`src/main/webui/src/api/GameApi.js` MUST NOT send `sendEvent('reset')` on SSE `onopen`. Reconnection MUST only update status from `offline` to `initial` when applicable.

#### Scenario: SSE reconnect preserves game state

- GIVEN an active or paused game session
- WHEN the game event SSE stream reconnects (`onopen`)
- THEN `sendEvent('reset')` MUST NOT be called
- AND status MUST transition from `offline` to `initial` only when current status is `offline`

### Requirement: Player flow without API regression

The full player flow MUST preserve: choose team → wait → generate power during game → view rank on finish. `EnableShakingModal.jsx` MAY remain unchanged.

#### Scenario: End-to-end flow unchanged

- GIVEN a player completes team selection, waiting, and active play
- WHEN interacting only with the mobile UI
- THEN all `gameApi` and `powerApi` calls MUST use the same endpoints and payloads as the pre-theme skeleton
- AND SSE events MUST be processed without handler modification
