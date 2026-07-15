# Theming Specification

## Purpose

Define the KCD Lima Chasquis theme configuration for the GitLab wind-turbine template skeleton: team constants, static assets, app metadata, and asset tooling. `Config.js` remains the single source of truth for team tuning. Scope is limited to `scaffolder-templates/gitlab/quinoa-wind-turbine/skeleton/`; backend Java MUST NOT change.

## ADDED Requirements

### Requirement: Team configuration in TEAMS_CONFIG

The skeleton MUST define exactly two entries in `src/main/webui/src/Config.js` `TEAMS_CONFIG`, each with a `car` field (MUST NOT rename to `sprite` or equivalent). Code identifiers MUST remain English.

| Index | `name` | `color` | `car` |
|-------|--------|---------|-------|
| 0 | `Blue Team` | `#2E6DA4` | `car-blue` |
| 1 | `Red Team` | `#C0392B` | `car-red` |

`TAP_POWER`, `SHOW_TOP`, and all `ENABLE_*` flags MUST remain unchanged from the pre-theme skeleton. `NB_TAP_NEEDED_PER_USER` MUST be `100` (changed from `150`).

#### Scenario: Config loads on app start

- GIVEN the skeleton webui starts with updated `Config.js`
- WHEN any component imports `TEAMS_CONFIG`
- THEN it MUST receive two teams named `Blue Team` and `Red Team`
- AND each entry MUST include `color` and `car` per the table above

#### Scenario: Backend team contract unchanged

- GIVEN the backend assigns teams by ID `1` or `2`
- WHEN a player selects a team via `gameApi.assign(team)`
- THEN the sent ID MUST remain `1` or `2` with no API change
- AND Kafka topics, SSE events, and Infinispan counters MUST behave as before the rebrand

### Requirement: Spanish team labels in TEAM_LABELS_ES

The skeleton MUST export `TEAM_LABELS_ES = ['Equipo Azul', 'Equipo Rojo']` from `Config.js`. UI components MUST use this constant for Spanish display labels instead of raw `TEAMS_CONFIG[].name`.

#### Scenario: Spanish labels available to UI

- GIVEN `Config.js` is updated in the skeleton
- WHEN `ChooseTeamModal`, `TopBar`, `LeftBar`, `Winner`, or `GameController` import `TEAM_LABELS_ES`
- THEN index `0` MUST resolve to `Equipo Azul` and index `1` to `Equipo Rojo`

### Requirement: Static assets in public/

The skeleton MUST serve these files from `src/main/webui/public/`:

| File | Purpose |
|------|---------|
| `machu-picchu-circuit.png` | Dashboard race-track background (1024×682 px) |
| `car-blue.png` | Blue chasqui sprite |
| `car-red.png` | Red chasqui sprite |
| `favicon.ico` | Browser/PWA icon |
| `kcd-lima-2026.png` | Event badge on mobile generator |

Assets MUST be simple stylized illustrations (not rights-restricted photographs). Filenames MUST match `TEAMS_CONFIG[n].car` + `.png` for sprites.

#### Scenario: Assets available without 404

- GIVEN the skeleton runs with `./mvnw quarkus:dev`
- WHEN the browser requests each file listed above
- THEN each resource MUST respond HTTP 200
- AND images MUST render on dashboard and mobile player screens

#### Scenario: Missing sprite blocks verification

- GIVEN a `TEAMS_CONFIG[].car` value without a matching PNG in `public/`
- WHEN `RaceTrack` or `GameController` reference `./{car}.png`
- THEN verification MUST fail (broken image or network error in DevTools)

### Requirement: Application metadata (index.html and manifest.json)

The skeleton MUST update `src/main/webui/index.html` and `src/main/webui/public/manifest.json` without introducing an i18n framework.

| File | Field | Expected value |
|------|-------|----------------|
| `index.html` | `lang` | `es` |
| `index.html` | `<title>` | `KCD Lima — Chasquis en Machu Picchu` |
| `index.html` | `meta description` | Spanish copy referencing KCD Lima chasqui race (e.g. `KCD Lima — Carrera de chasquis alrededor del Machu Picchu`) |
| `index.html` | `theme-color` | `#2E6DA4` |
| `index.html` | `link rel="icon"` | `./favicon.ico` |
| `manifest.json` | `short_name` | `KCD Lima Chasquis` |
| `manifest.json` | `name` | `KCD Lima — Chasquis en Machu Picchu` |
| `manifest.json` | `theme_color` | `#2E6DA4` |

#### Scenario: Document title in Spanish

- GIVEN an operator or player opens the scaffolded app
- WHEN they inspect the browser tab
- THEN the title MUST display `KCD Lima — Chasquis en Machu Picchu`

#### Scenario: PWA manifest reflects the event

- GIVEN `manifest.json` is deployed in `public/`
- WHEN the browser reads the manifest
- THEN `short_name` MUST be `KCD Lima Chasquis`
- AND `name` MUST be `KCD Lima — Chasquis en Machu Picchu`

### Requirement: Reproducible asset generation script

The skeleton MUST include `scripts/generate-kcd-assets.py` that regenerates the five theme assets. Running the script MUST produce output files matching the names and approximate dimensions in the static-assets requirement.

#### Scenario: Script regenerates assets

- GIVEN `scripts/generate-kcd-assets.py` exists in the skeleton
- WHEN an operator runs it from the skeleton root with required dependencies installed
- THEN it MUST write `machu-picchu-circuit.png`, `car-blue.png`, `car-red.png`, `favicon.ico`, and `kcd-lima-2026.png` into `src/main/webui/public/`

### Requirement: Backend Java unchanged

Files under `src/main/java/org/acme/` in the GitLab skeleton MUST remain byte-identical to the KCD Lima demo app (`quinoa-wind-turbine`). No Java, `pom.xml`, or `application.properties` changes are in scope.

#### Scenario: Java diff is empty

- GIVEN the skeleton port is complete
- WHEN `diff -rq` compares `src/main/java/org/acme/` against the KCD demo app
- THEN there MUST be no differences
