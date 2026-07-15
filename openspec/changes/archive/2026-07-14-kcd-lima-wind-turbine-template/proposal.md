# Proposal: KCD Lima Chasquis Theme — GitLab Wind Turbine Skeleton

## Intent

Port the completed KCD Lima chasquis demo theme from `quinoa-wind-turbine` into the **GitLab** wind-turbine template skeleton so scaffolded repos match the booth demo before future RHDH + GitLab Kind deployment. Backend Java stays unchanged; only frontend theme, assets, and metadata update.

## Scope

### In Scope

Target: `scaffolder-templates/gitlab/quinoa-wind-turbine/skeleton/` only.

| Group | Files |
|-------|-------|
| **Config** | `src/main/webui/src/Config.js` — Blue/Red teams, `TEAM_LABELS_ES`, `NB_TAP_NEEDED_PER_USER=100`, `car-blue`/`car-red` |
| **Dashboard UI** | `LeftBar.jsx`, `Winner.jsx`, `RaceTrack.jsx`, `Dashboard.jsx` — Spanish copy, Machu Picchu circuit, recalibrated `offset-path` |
| **Player UI** | `ChooseTeamModal.jsx`, `TopBar.jsx`, `GameController.jsx`, `Generator.jsx`, `Turbine.jsx`, `RankModal.jsx`, `EnableShakingModal.jsx` |
| **API helpers** | `PowerApi.js` (`energía` labels), `GameApi.js` (no `reset` on SSE connect) |
| **Metadata** | `index.html`, `public/manifest.json` — `lang="es"`, KCD title, `theme-color` `#2E6DA4` |
| **Assets** | `public/machu-picchu-circuit.png`, `car-blue.png`, `car-red.png`, `favicon.ico`, `kcd-lima-2026.png` |
| **Tooling** | `scripts/generate-kcd-assets.py` |

### Out of Scope (Non-Goals)

- `template.yaml`, `manifests/`, `catalog-info.yaml` (template-level)
- `kcd-lima-2026` catalog registration or env prep
- GitLab Kind deployment or `scaffolder-backend-module-gitlab`
- GitHub root variant (`scaffolder-templates/quinoa-wind-turbine/skeleton/`)
- Backend Java, `application.properties` local tweaks, `pom.xml` bumps, docs/README

## Capabilities

### New Capabilities

- `theming`: `TEAMS_CONFIG`, assets, `index.html`/`manifest.json` — source: archived `kcd-lima-chasquis-theme` + `quinoa-wind-turbine/openspec/specs/theming`
- `player-ui`: Spanish mobile copy, chasqui sprites — source: archived specs + `openspec/specs/player-ui`
- `dashboard-visual`: Machu Picchu circuit, Spanish operator UI — source: archived specs + `openspec/specs/dashboard-visual`

### Modified Capabilities

- None (`openspec/specs/` empty in this repo)

## Approach

1. Copy/port frontend deltas from `/home/fmeneses/Documents/demos/quinoa-wind-turbine/` (post-`kcd-lima-chasquis-theme`) into GitLab skeleton paths above.
2. Use archived change `2026-07-13-kcd-lima-chasquis-theme` and its three spec deltas as source of truth.
3. Copy 5 binary assets from demo app or regenerate via `generate-kcd-assets.py`.
4. Verify backend Java unchanged (`diff -rq` against demo); smoke-test with `./mvnw quarkus:dev` in skeleton.

## GitLab vs GitHub Pipeline Analysis

| Aspect | GitHub (kcd-lima-2026 today) | GitLab (user's Kind plan) |
|--------|------------------------------|---------------------------|
| **Integration** | `integrations.github`, `scaffolder-backend-module-github`, `GITHUB_TOKEN` in `deploy/kind/secret.yaml` | **Not configured** — no `integrations.gitlab`, no `scaffolder-backend-module-gitlab` |
| **Demo viability** | Viable for quick demo **if** env configured (later phase) | Aligns with user's GitLab Kind direction but needs backend modules + GitLab deploy (later phase) |
| **This change** | N/A — skeleton-only; variant choice affects **which skeleton path** gets the theme, not pipeline |

**Answer:** GitHub pipeline can demo today once `GITHUB_TOKEN` is set; GitLab variant is correct for the planned Kind+GitLab stack but requires a future env change. Pipeline choice matters in Phase 2, not Phase 1.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `gitlab/quinoa-wind-turbine/skeleton/src/main/webui/**` | Modified | ~20 frontend files + Config.js |
| `gitlab/quinoa-wind-turbine/skeleton/src/main/webui/public/**` | New/Modified | 5 KCD assets |
| `gitlab/quinoa-wind-turbine/skeleton/scripts/generate-kcd-assets.py` | New | Asset regeneration |
| `gitlab/quinoa-wind-turbine/template.yaml` | — | Unchanged (Phase 2) |
| `scaffolder-templates/quinoa-wind-turbine/` (GitHub) | — | Unchanged |

## Phased Delivery

| Phase | Scope | When |
|-------|-------|------|
| **Phase 1 (this change)** | GitLab skeleton chasquis port | Now |
| **Phase 2 (future)** | `template.yaml`, `manifests/`, `kcd-lima-2026` catalog, GitLab Kind env | Deferred |

## Effort Estimate

| Metric | Value |
|--------|-------|
| Time | ~4–6 h |
| Lines | ~200–350 (authored) |
| PR shape | Single PR within 400-line budget |

## Review Workload Forecast

Decision needed before apply: No  
Chained PRs recommended: No  
400-line budget risk: Low

Skeleton-only port is isolated to one template variant; no cross-template shared-pattern edits.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `offset-path` misalignment after port | Medium | Port exact calibrated paths from demo app |
| Binary asset bloat in PR | Medium | Commit via `generate-kcd-assets.py`; document regeneration |
| GitHub skeleton drift | Low | Document GitLab-only scope; defer sync |

## Rollback Plan

Revert all skeleton changes under `scaffolder-templates/gitlab/quinoa-wind-turbine/skeleton/` via `git checkout` or `git revert` on the merge commit. No template.yaml, manifests, or kcd-lima-2026 files touched — rollback is a single-directory git operation.

## Dependencies

- Source app: `/home/fmeneses/Documents/demos/quinoa-wind-turbine/` (applied `kcd-lima-chasquis-theme`)
- Reference specs: `quinoa-wind-turbine/openspec/specs/{theming,player-ui,dashboard-visual}.md`
- Archived change: `quinoa-wind-turbine/openspec/changes/archive/2026-07-13-kcd-lima-chasquis-theme/`

## Success Criteria

- [ ] GitLab skeleton frontend diff matches KCD demo theme (Config, Dashboard, Player, API helpers, metadata)
- [ ] Backend Java (`src/main/java/org/acme/*`) unchanged vs demo app
- [ ] All 5 assets present in `public/` with HTTP 200 on `./mvnw quarkus:dev`
- [ ] Spanish UI copy and Machu Picchu circuit render correctly on dashboard and mobile player
- [ ] `scripts/generate-kcd-assets.py` committed for reproducible assets
