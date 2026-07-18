# Agent instructions — ${{ values.component_id }}

## Product

**Carrera de Chasquis** (KCD Lima): race game with player mobile UI and operator dashboard. Keep changes small and demo-visible.

## Workflow

1. Prefer **OpenSpec** for non-trivial features: `openspec/changes/<name>/` → spec → design → tasks → implement → verify.
2. Read `openspec/config.yaml` for **strict TDD** and test commands (`./mvnw test`).
3. Use **project skills** under `.cursor/skills/` when the user invokes SDD phases (`sdd-spec`, `sdd-verify`, …) or scaffolding (`create-rule`, `create-hook`).
4. **Hooks** in `.cursor/hooks.json` run on agent edits — avoid breaking JSON contracts.

## Code

- Backend: Quarkus REST under `src/main/java/org/acme` (`GameResource`, `PowerResource`).
- Frontend: React in `src/main/webui` (Quinoa); player `/`, dashboard `/dashboard`.
- Game tuning: `src/main/webui/src/Config.js` (teams, power, sensors).
- Runtime deps on Kind: Kafka + Infinispan (platform namespace) via Quarkus profiles.
