# Tasks: KCD Lima Chasquis Theme — GitLab Wind Turbine Skeleton

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200–350 authored |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | GitLab skeleton KCD theme port | PR 1 | `diff -q` each of 16 frontend files vs demo | `cd scaffolder-templates/gitlab/quinoa-wind-turbine/skeleton && ./mvnw quarkus:dev` | Revert `scaffolder-templates/gitlab/quinoa-wind-turbine/skeleton/` only |

## Phase 1: Foundation (gitlab/quinoa-wind-turbine/skeleton)

- [x] 1.1 Confirm source `/home/fmeneses/Documents/demos/quinoa-wind-turbine/` and target `scaffolder-templates/gitlab/quinoa-wind-turbine/skeleton/`; verify `template.yaml`, `manifests/`, GitHub skeleton out of scope
- [x] 1.2 Copy `src/main/webui/src/Config.js` — `TEAMS_CONFIG` Blue/Red, `TEAM_LABELS_ES`, `NB_TAP_NEEDED_PER_USER=100`, `car-blue`/`car-red`

## Phase 2: Frontend Port (16 source files)

- [x] 2.1 Copy Dashboard: `LeftBar.jsx`, `Winner.jsx`, `RaceTrack.jsx`, `Dashboard.jsx` — Spanish copy, Machu Picchu circuit, 1024×682 `offset-path`
- [x] 2.2 Copy Player: `ChooseTeamModal.jsx`, `TopBar.jsx`, `GameController.jsx` — Spanish modal (`Elige tu equipo:`), waiting screen (`Esperando partida…`)
- [x] 2.3 Copy Player: `Generator.jsx`, `Turbine.jsx`, `RankModal.jsx`, `EnableShakingModal.jsx` — chasqui `<img>`, `kcd-lima-2026.png` badge, `Clasificación general`
- [x] 2.4 Copy API: `src/main/webui/src/api/PowerApi.js` (`energía` labels), `GameApi.js` (no `reset` on SSE `onopen`)
- [x] 2.5 Copy metadata: `src/main/webui/index.html`, `public/manifest.json` — `lang="es"`, KCD title, `theme-color` `#2E6DA4`

## Phase 3: Assets & Tooling

- [x] 3.1 Copy 5 assets to `src/main/webui/public/`: `machu-picchu-circuit.png`, `car-blue.png`, `car-red.png`, `favicon.ico`, `kcd-lima-2026.png` (1024×682 circuit from demo, not script-only)
- [x] 3.2 Copy `scripts/generate-kcd-assets.py` from demo to skeleton `scripts/` for reproducible regeneration

## Phase 4: Verification

- [x] 4.1 Run `diff -q` on all 16 frontend files (skeleton vs demo) — expect zero differences per file
- [x] 4.2 Run `diff -rq src/main/java/org/acme/` skeleton vs demo — expect no differences (backend Java unchanged)
- [x] 4.3 Smoke: `./mvnw quarkus:dev` in skeleton; Network tab confirms 5 KCD assets HTTP 200
- [x] 4.4 Visual `/dashboard`: Machu Picchu background, chasquis on path, Spanish sidebar (`La Carrera`, `Esperando jugadores...`)
- [x] 4.5 Visual `/`: Spanish team modal, `kcd-lima-2026.png` badge, energía power display, tap animation
- [x] 4.6 Grep UI strings for residual English (`The Race`, `Overall Rank`, `Waiting for game`) — allow code identifiers only
