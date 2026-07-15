# Exploration: KCD Lima Wind Turbine Template for RHDH

**Change**: `kcd-lima-wind-turbine-template`  
**Date**: 2026-07-14  
**Mode**: hybrid (OpenSpec + Engram)

## Executive Summary

The `quinoa-wind-turbine` scaffolder template skeleton is still the **original English wind-turbine theme** (Mountains/Beach, `race-track-1.png`, MW units). The KCD Lima app at `/home/fmeneses/Documents/demos/quinoa-wind-turbine/` has a completed `kcd-lima-chasquis-theme` change (archived 2026-07-13) with ~20 frontend files and 5 new assets differing from the template. **Backend Java is unchanged** between both repos.

The template **will not run end-to-end** in `kcd-lima-2026` without modifications: it depends on Janus-specific `argocd:create-resources`, hardcoded OpenShift workshop cluster defaults (`.apps.wearedevs.rl97.p1.openshiftapps.com`, `janus-argocd` namespace), and Tekton/Vault manifests unsuitable for the Kind local stack. The KCD Lima RHDH instance has `publish:github` and community ArgoCD backend but **no** `argocd:create-resources` scaffolder action, and does not register the wind turbine template.

**Recommendation**: Approach 3 (full integration) delivered in two phases — (1) port KCD theme to skeleton + dry-run template + catalog registration for local demo; (2) adapt `template.yaml` and manifests for KCD Kind defaults, replacing Janus-specific steps.

---

## Current State

### Template (`software-templates-ai/scaffolder-templates/quinoa-wind-turbine/`)

| Artifact | Purpose | KCD-ready? |
|----------|---------|------------|
| `template.yaml` | 6-step pipeline: fetch skeleton → publish:github → catalog:register → fetch manifests → publish gitops → **argocd:create-resources** | **No** — Janus action + workshop defaults |
| `skeleton/` | Quarkus + Quinoa React SPA scaffolded to new repo | **No** — original theme |
| `manifests/` | Helm app + Helm build (Tekton/Vault) + ArgoCD apps in `janus-argocd` | **No** — OpenShift workshop assumptions |
| `catalog-info.yaml` | Template entity registration metadata | Partial — Janus/Tekton annotations |

### KCD Lima app (`quinoa-wind-turbine/`)

- SDD change `kcd-lima-chasquis-theme` applied and archived with specs at `openspec/specs/{theming,player-ui,dashboard-visual}`.
- Frontend-only rebrand: Blue/Red teams, Spanish UI, Machu Picchu circuit, chasqui sprites, `NB_TAP_NEEDED_PER_USER=100`.
- Post-theme deltas beyond original design: recalibrated `offset-path` (1024×682), `PowerApi` uses `energía` labels, `Generator` uses `kcd-lima-2026.png` badge, `GameApi` no longer sends `reset` on SSE connect.
- `scripts/generate-kcd-assets.py` generates pixel-art assets reproducibly.
- Backend Java (`src/main/java/`) **identical** to template skeleton (confirmed via `diff -rq`).
- `application.properties` has local dev tweaks (credentials, Kafka profiles) — **not** part of KCD theme scope.

### KCD Lima RHDH (`kcd-lima-2026/`)

- `app-config.yaml` registers only local example templates (`examples/template/`, `agentic-ai-react-template/`); **no wind turbine template**.
- Backend plugins: `scaffolder-backend`, `scaffolder-backend-module-github`, `argocd-backend` (community) — **no Janus scaffolder actions**.
- ArgoCD instance: `kind-local` at `http://argocd-server.argocd.svc.cluster.local` (namespace `argocd`, not `janus-argocd`).
- `GITHUB_TOKEN` placeholder in `deploy/kind/secret.yaml` — real token required for publish/register flows.
- Existing dry-run pattern: `examples/agentic-ai-react-template/template-dry-run.yaml` (fetch:template only).

---

## A. Skeleton Diff (Template vs KCD App)

### Must port to skeleton

| Category | Files | Delta summary |
|----------|-------|---------------|
| **Config** | `src/main/webui/src/Config.js` | `TEAMS_CONFIG`: Mountains/Beach → Blue Team/Red Team; colors hex; `car-blue`/`car-red`; add `TEAM_LABELS_ES`; `NB_TAP_NEEDED_PER_USER` 150→100 |
| **Dashboard UI** | `LeftBar.jsx`, `Winner.jsx`, `RaceTrack.jsx`, `Dashboard.jsx` | Spanish copy (`La Carrera`, `Esperando jugadores…`, winner message); `TEAM_LABELS_ES`; circuit `machu-picchu-circuit.png` 1024×682; recalibrated `offset-path` paths; `transform-origin` 35px 60px; winner timing logic tweak |
| **Player UI** | `ChooseTeamModal.jsx`, `TopBar.jsx`, `GameController.jsx`, `Generator.jsx`, `Turbine.jsx`, `RankModal.jsx`, `EnableShakingModal.jsx` | Spanish copy; `TEAM_LABELS_ES` in TopBar/GameController; waiting `Esperando partida…`; Generator uses `kcd-lima-2026.png` badge; Turbine → `<img>` sprite; larger sprite sizing |
| **API helpers** | `PowerApi.js`, `GameApi.js` | Power display: MW/KW → flat `energía` units; removed `sendEvent('reset')` on SSE connect |
| **Metadata** | `index.html`, `public/manifest.json` | `lang="es"`, KCD title/description, `theme-color` `#2E6DA4`, favicon.ico |
| **Assets (new)** | `public/machu-picchu-circuit.png`, `car-blue.png`, `car-red.png` (replaced), `favicon.ico`, `kcd-lima-2026.png` | 5 binary files — copy from KCD app or regenerate via script |
| **Asset tooling** | `scripts/generate-kcd-assets.py` | Reproducible asset generation (Pillow); recommend porting to skeleton |

### Unchanged (confirmed)

| Area | Files |
|------|-------|
| **Backend Java** | `src/main/java/org/acme/*` — no diff |
| **Login** | `src/main/webui/src/components/Login/*` — no diff |
| **CSS** | `src/main/webui/src/index.css` — no diff |
| **Core app shell** | `App.jsx`, `index.jsx`, `api/Shake.js`, `api/Sensors.js`, `Dashboard/StopWatch.jsx`, `Dashboard/DashboardUtils.js` |

### Template-only concerns (do NOT port from KCD app)

| Area | Reason |
|------|--------|
| `skeleton/catalog-info.yaml` | Scaffolder-templated entity metadata with `${{values.*}}` |
| `skeleton/.devfile-vscode.yaml` | DevSpaces wiring for scaffolded repo |
| `application.properties` local dev changes | KCD app credentials (`kcdlima2026`), Kafka profiles, Confluent profile — environment-specific |
| `pom.xml` version bumps (3.34.6→3.35.3, quinoa 2.8.0→2.8.1) | Independent of theme; optional separate bump |
| `docs/*`, `README.md` screenshots | KCD app evolved docs; template keeps workshop-oriented docs unless explicitly updated |
| `scripts/dev-podman.sh`, `.atl/`, `openspec/` | KCD app SDD infrastructure only |

### RHDH wiring (not in skeleton)

| Item | Location |
|------|----------|
| Template catalog registration | `kcd-lima-2026/app-config.yaml` → `catalog.locations` |
| Dry-run template variant | New `template-dry-run.yaml` alongside `template.yaml` |
| GitHub token for publish | `kcd-lima-2026/deploy/kind/secret.yaml` |
| ArgoCD instance mapping | `app-config.yaml` / `app-config.kind.yaml` — `kind-local` |

### Deferred / out of scope

- GitLab variant (`scaffolder-templates/gitlab/quinoa-wind-turbine/`) sync
- Full Tekton/Vault pipeline adaptation for Kind (manifests/helm/build/)
- `offset-path` fine-tuning automation (manual DevTools iteration if needed post-port)
- Backend/Kafka/Infinispan changes
- i18n framework refactor

---

## B. template.yaml & Manifests vs RHDH/KCD Environment

### template.yaml blockers in kcd-lima-2026

| Issue | Current value | KCD Lima reality | Required change |
|-------|---------------|------------------|-----------------|
| **ArgoCD scaffolder action** | `argocd:create-resources` with `argoInstance: main`, `namespace: janus-argocd` | Not registered in backend; no Janus plugin | Remove or replace with manual gitops instructions; optionally add ArgoCD Application YAML to manifests for user to apply |
| **Cluster default** | `.apps.wearedevs.rl97.p1.openshiftapps.com` | Kind local / no OpenShift console | Parameter default → empty or `backstage.localhost:8080`; remove console links or make optional |
| **ArgoCD namespace in manifests** | `janus-argocd` | `argocd` | Change all `manifests/argocd/*.yaml` namespace |
| **publish:github** | Required | Supported (`scaffolder-backend-module-github`) | Works if `GITHUB_TOKEN` set |
| **catalog:register** | Required | Supported | Works with GitHub token |
| **EntityPicker owner** | `kind: [User]` | kcd-lima has `examples/org.yaml` users | OK if org data loaded |
| **Duplicate template name** | `wind-turbine-template` (same as GitLab variant) | Only matters if both registered | Rename to `wind-turbine-kcd-template` for KCD instance |
| **Image registry default** | `image-registry.openshift-image-registry.svc:5000` | Kind has no internal OCP registry | Default to `ghcr.io` or prompt user; document Kind limitations |
| **Output links** | OpenShift console URLs | Not applicable on Kind | Make conditional or remove |

### Manifests analysis

| Manifest area | Workshop assumption | Kind/KCD fit |
|---------------|--------------------|--------------|
| `manifests/helm/app/` | OpenShift Route, Kafka CR | Partially usable on Kind with edits (no Route CRD by default) |
| `manifests/helm/build/` | Tekton pipelines, Vault secrets, git webhooks | **Not usable** on Kind without full platform stack |
| `manifests/argocd/` | Apps in `janus-argocd` | Needs namespace `argocd` + instance `kind-local` annotation alignment |

### ArgoCD action availability

`grep argocd:create-resources` across `kcd-lima-2026` → **zero matches**. Backend registers `@backstage-community/plugin-argocd-backend` (read-only UI integration), not a scaffolder action module. The template's final step **will fail** at runtime.

---

## C. Developer Hub Integration Path

### Beyond skeleton changes

1. **Register template in kcd-lima-2026**
   - Option A: `catalog.locations` URL pointing to `software-templates-ai` repo `template.yaml` (requires network + repo access).
   - Option B (preferred for demo): Copy/symlink template into `kcd-lima-2026/examples/wind-turbine-kcd-template/` with local `catalog.locations` file target (matches existing pattern).

2. **Scaffolder plugins/actions required**

   | Action | kcd-lima-2026 status |
   |--------|---------------------|
   | `fetch:template` | ✅ Built-in |
   | `publish:github` | ✅ `scaffolder-backend-module-github` |
   | `catalog:register` | ✅ Built-in |
   | `argocd:create-resources` | ❌ Not available |

3. **Dry-run template** (recommended)
   - Follow `agentic-ai-react-template/template-dry-run.yaml` pattern: single `fetch:template` step, Spanish output instructions.
   - Enables KCD booth demo without GitHub token.

4. **Secrets/tokens**
   - `GITHUB_TOKEN`: replace placeholder in `deploy/kind/secret.yaml` for full pipeline.
   - `ARGOCD_ADMIN_PASSWORD`: already set (`kcd-demo-argocd`) for UI viewing, not scaffolder creation.

5. **Post-scaffold deployment on Kind**
   - Full gitops pipeline (Tekton build → push image → ArgoCD sync) is **out of scope** for initial KCD readiness.
   - Demo path: dry-run scaffold → local `./mvnw quarkus:dev` OR manual `kubectl apply` of simplified manifests.

---

## D. Approaches Comparison

| Approach | Description | Pros | Cons | Effort |
|----------|-------------|------|------|--------|
| **1. Skeleton only** | Port KCD theme files into `skeleton/`; leave `template.yaml`/manifests/RHDH unchanged | Smallest diff (~200–350 lines); reuses archived KCD specs directly | Template still broken in kcd-lima-2026; no catalog visibility; Janus steps fail | **Low** (4–6 h) |
| **2. Skeleton + template.yaml** | Approach 1 + update parameters, remove `argocd:create-resources`, fix ArgoCD namespace defaults, add dry-run variant | Runnable in kcd-lima-2026 with GitHub token; workshop-independent defaults | Manifests still OpenShift-heavy; no catalog registration; Tekton/Vault still broken on Kind | **Medium** (8–12 h) |
| **3. Full integration** | Approach 2 + kcd-lima-2026 catalog registration + docs + simplified Kind manifests (app-only, no Tekton/Vault) | End-to-end demo in KCD portal; dry-run for booth; documented operator path | Two repos touched; manifest simplification is design work | **Medium–High** (12–18 h) |

### Recommendation

**Approach 3, phased delivery:**

- **Phase A (demo-critical)**: Port skeleton KCD theme + `template-dry-run.yaml` + register in kcd-lima-2026 `catalog.locations` + brief README.
- **Phase B (full pipeline)**: Adapt `template.yaml` (rename, KCD defaults, remove Janus action) + simplify `manifests/` for Kind (app helm only, `argocd` namespace).

### Effort estimate by work stream

| Work stream | Estimate | Lines (approx.) |
|-------------|----------|-----------------|
| Skeleton KCD theme port | 4–6 h | 200–350 |
| `template-dry-run.yaml` | 1–2 h | 40–60 |
| `template.yaml` RHDH adaptation | 3–4 h | 50–80 |
| Manifests namespace/simplification | 4–6 h | 100–200 |
| kcd-lima-2026 catalog + docs | 2–3 h | 30–50 |
| Verification (scaffold dry-run + theme smoke) | 2 h | — |
| **Total** | **16–23 h** | **420–740** (may need chained PRs) |

---

## Explicit Changes Needed (RHDH-Ready Checklist)

### software-templates-ai

- [ ] Port 20 frontend files from KCD app to `skeleton/` (see Section A table)
- [ ] Copy 5 assets to `skeleton/src/main/webui/public/`
- [ ] Add `scripts/generate-kcd-assets.py` to skeleton
- [ ] Create `template-dry-run.yaml` (fetch:template only, KCD metadata/tags)
- [ ] Rename template metadata to `wind-turbine-kcd-template` (avoid GitLab collision)
- [ ] Update `template.yaml`: remove `argocd:create-resources` step; parameter defaults for KCD/Kind; optional gitops-only path
- [ ] Change `manifests/argocd/*.yaml` namespace `janus-argocd` → `argocd`
- [ ] Update `catalog-info.yaml` annotations: remove or make optional `janus-idp.io/tekton-enabled`
- [ ] Update template title/description/tags for KCD Lima branding
- [ ] Document which manifest subset works on Kind (app helm only)

### kcd-lima-2026

- [ ] Add `catalog.locations` entry for wind turbine template (file or URL)
- [ ] Optionally copy template into `examples/wind-turbine-kcd-template/`
- [ ] Document `GITHUB_TOKEN` requirement for full (non-dry-run) scaffold
- [ ] Add workshop doc: dry-run → `mvnw quarkus:dev` demo path

---

## Affected Areas

- `scaffolder-templates/quinoa-wind-turbine/skeleton/src/main/webui/**` — KCD theme port
- `scaffolder-templates/quinoa-wind-turbine/skeleton/src/main/webui/public/**` — new assets
- `scaffolder-templates/quinoa-wind-turbine/skeleton/scripts/generate-kcd-assets.py` — new
- `scaffolder-templates/quinoa-wind-turbine/template.yaml` — RHDH/KCD parameter and action changes
- `scaffolder-templates/quinoa-wind-turbine/template-dry-run.yaml` — new
- `scaffolder-templates/quinoa-wind-turbine/manifests/argocd/**` — namespace fix
- `scaffolder-templates/quinoa-wind-turbine/catalog-info.yaml` — metadata update
- `kcd-lima-2026/app-config.yaml` — catalog registration
- `kcd-lima-2026/examples/` (optional) — local template copy

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `argocd:create-resources` step fails in kcd-lima | **Certain** | Template run aborts at final step | Remove step; provide gitops repo only |
| Tekton/Vault manifests unusable on Kind | **High** | Post-scaffold deploy fails | Ship app-only manifests; defer build pipeline |
| Asset binary size in git | Medium | Large PR | Use `generate-kcd-assets.py`; commit PNGs |
| `offset-path` misalignment after port | Medium | Visual glitch on dashboard | Port exact paths from KCD app (already calibrated) |
| 400-line review budget exceeded | Medium | Review fatigue | Chain PRs: skeleton theme PR #1, template/RHDH PR #2 |
| GitLab variant name collision | Low | Catalog confusion if both loaded | Rename KCD template metadata |
| `GITHUB_TOKEN` not configured | Medium | publish/register fails | Promote dry-run as primary demo path |

---

## Ready for Proposal

**Yes** — scope is well-defined from archived `kcd-lima-chasquis-theme` specs plus clear RHDH integration gaps. Propose as `kcd-lima-wind-turbine-template` with phased delivery (Phase A: skeleton + dry-run + catalog; Phase B: full template/manifests).

**Orchestrator should tell user**: The template skeleton needs the KCD theme ported (~20 files); the template pipeline needs Janus-specific steps removed/replaced; kcd-lima-2026 needs catalog registration. Dry-run template enables booth demo without GitHub token.
