# Exploration: Kind Cluster Requirements for KCD Wind Turbine Template

**Change**: `kcd-kind-template-runtime`  
**Date**: 2026-07-14  
**Mode**: hybrid (OpenSpec + Engram)  
**Variant**: GitLab `scaffolder-templates/gitlab/quinoa-wind-turbine/` (KCD skeleton Phase 1 complete)

## Executive Summary

An empty Kind cluster bootstrapped via `kcd-lima-2026` (`make kind-bootstrap` + `make tilt-up`) provides Backstage/RHDH, Postgres, Traefik Gateway API, and an optional platform stack (ArgoCD in `argocd`, Grafana/Prometheus/Loki). It does **not** provide GitLab, the GitLab scaffolder module, Janus `argocd:create-resources`, Strimzi/Kafka, Infinispan, Tekton, Vault/External Secrets, or an image registry matching template defaults.

The GitLab wind-turbine template **cannot run end-to-end** on today's Kind stack without Phase 2 env work. **Recommendation**: start with **Approach 1 (minimal demo)** — dry-run `fetch:template` + local `mvnw quarkus:dev` — then adopt **Approach 2 (medium)** for GitLab publish + simplified ArgoCD app deploy.

---

## Current State

### What `kcd-lima-2026` Kind deploy provides today

| Component | Status | Details |
|-----------|--------|---------|
| Kind cluster | ✅ | Single-node, `backstage` name, port 8080 → host via `kind-config.yaml` |
| Gateway API + Traefik | ✅ | `make kind-bootstrap`; route `http://backstage.localhost:8080` |
| Backstage/RHDH | ✅ | Postgres + `backstage:kind` image; guest auth |
| Platform stack (default on) | ✅ | ArgoCD (`argocd` ns), kube-prometheus-stack, Loki via Tilt `PLATFORM_STACK_ENABLED=true` |
| ArgoCD UI integration | ✅ | `kind-local` → `argocd-server.argocd.svc.cluster.local`, password `kcd-demo-argocd` |
| Kubernetes plugin | ✅ | Service account `backstage-k8s-reader`, cluster `kind-local` |
| Scaffolder `fetch:template` | ✅ | Built-in |
| Scaffolder `publish:github` | ✅ | `scaffolder-backend-module-github`; `GITHUB_TOKEN` placeholder in `secret.yaml` |
| Scaffolder `publish:gitlab` | ❌ | No `scaffolder-backend-module-gitlab`; no `integrations.gitlab` |
| Scaffolder `argocd:create-resources` | ❌ | Janus-only action; not in backend `index.ts` |
| Wind turbine template in catalog | ❌ | No registration in `app-config.yaml` / `app-config.production.yaml` |
| GitLab | ❌ | Not deployed |
| Kafka / Strimzi | ❌ | Not deployed |
| Infinispan | ❌ | Not deployed |
| Tekton | ❌ | Not deployed |
| Vault / External Secrets | ❌ | Not deployed |
| Image registry (Quay/OCP ICR) | ❌ | No internal registry; demo uses pre-built images in platform workload |

### What the GitLab template assumes (workshop / OpenShift sandbox)

**`template.yaml` pipeline (6 steps):**

1. `fetch:template` → skeleton
2. `publish:gitlab` → app repo on GitLab host
3. `catalog:register` → from published repo
4. `fetch:template` → manifests → `./tenant-gitops`
5. `publish:gitlab` → `{component_id}-gitops` repo
6. `argocd:create-resources` → `argoInstance: main`, `namespace: janus-argocd`, path `argocd/`

**Hardcoded parameter defaults (workshop):**

| Parameter | Default |
|-----------|---------|
| `cluster_id` | `.apps.cluster-zbkfk.sandbox1339.opentlc.com` |
| `repo.host` | `gitlab-gitlab.apps.cluster-zbkfk.sandbox1339.opentlc.com` |
| `repo.owner` | `development` |
| `image_host` (Openshift) | `image-registry.openshift-image-registry.svc:5000` |
| `image_host` (Quay) | `quay-zbkfk.apps.cluster-zbkfk.sandbox1339.opentlc.com` |

**`manifests/helm/app/` runtime assumptions:**

- `Deployment` with `QUARKUS_PROFILE=openshift-cluster`
- Kafka bootstrap: `my-cluster-kafka-bootstrap:9092` (Strimzi CR, 3 Kafka + 3 ZK replicas)
- Infinispan secret `infinispan-generated-secret` (cluster deployed separately — not in helm/app)
- OpenShift `Route` CR (`route.openshift.io/v1`)
- ExternalSecret → Vault `secrets/janusidp/registry/*` for pull credentials

**`manifests/helm/build/` supply chain (not Kind-viable as-is):**

- Tekton Pipelines + EventListeners + TriggerBindings
- Vault ExternalSecrets for GitLab token, Quay, StackRox, SonarQube, ACS, webhooks
- ClusterTasks: `git-clone`, `buildah`, ACS/StackRox/SonarQube tasks
- References `janus-argocd` ArgoCD server hostname in promote tasks

**`manifests/argocd/` GitOps assumptions:**

- All Applications in namespace `janus-argocd`, project `janus`
- Apps: `dev`, `dev-build` (Tekton helm), `preprod`, `prod`
- Repo secret in `janus-argocd`

**Skeleton `application.properties`:**

- Kafka topics `power`, `game-events` via SmallRye Messaging
- Infinispan Hot Rod client for game state (`GameResource.java`)
- Production profile `%prod` → `openshift-cluster` (Kafka + Infinispan + OpenShift deployment extensions)

### Phase 1 status (prior SDD)

`kcd-lima-wind-turbine-template` archived with skeleton-only KCD chasquis theme port complete. `template.yaml`, `manifests/`, and `kcd-lima-2026` env prep explicitly deferred to Phase 2.

---

## Affected Areas

| Path | Role |
|------|------|
| `kcd-lima-2026/Makefile`, `Tiltfile`, `deploy/kind/*` | Kind bootstrap, platform stack, secrets |
| `kcd-lima-2026/app-config.yaml`, `app-config.kind.yaml`, `app-config.production.yaml` | Integrations, catalog, ArgoCD instance |
| `kcd-lima-2026/packages/backend/package.json`, `src/index.ts` | Scaffolder + ArgoCD backend modules |
| `kcd-lima-2026/deploy/kind/secret.yaml` | Tokens (GITHUB, ARGOCD; missing GITLAB) |
| `software-templates-ai/.../gitlab/quinoa-wind-turbine/template.yaml` | Scaffolder pipeline + workshop defaults |
| `software-templates-ai/.../gitlab/quinoa-wind-turbine/manifests/**` | App, build, ArgoCD GitOps |
| `software-templates-ai/.../gitlab/quinoa-wind-turbine/skeleton/application.properties` | Kafka + Infinispan runtime config |

---

## Approaches

### 1. Minimal demo — dry-run / fetch only

**Description**: Register a `template-dry-run.yaml` (single `fetch:template` step). No GitLab publish, no cluster app deploy.

| Pros | Cons |
|------|------|
| Works on empty Kind with only Backstage | No GitLab or ArgoCD demo |
| No extra tokens beyond optional catalog URL | Game needs local Kafka/Infinispan or `quarkus:dev` with dev services |
| Fastest booth path after Phase 1 skeleton | Does not validate supply-chain story |

**Effort**: Low (2–4 h) — catalog registration + dry-run template only

**Cluster deps**: Backstage pod only (scaffolder temp workspace)

---

### 2. Medium — scaffold + GitLab + simplified ArgoCD app

**Description**: GitLab publish + gitops repo + manual/simplified ArgoCD Application for `helm/app` only. Pre-built image. Single-broker Kafka + Infinispan Helm. HTTPRoute instead of OpenShift Route.

| Pros | Cons |
|------|------|
| Demonstrates GitLab + ArgoCD + running game on Kind | Requires GitLab deploy or external instance |
| Avoids Tekton/Vault/Janus | Significant env setup (GitLab chart, Strimzi, Infinispan) |
| Aligns with user's GitLab Kind direction | Template/manifests need Kind-specific fork or parameter overrides |

**Effort**: Medium–High (16–24 h)

**Cluster deps**: Backstage + GitLab + ArgoCD (exists) + Strimzi operator + Kafka CR (simplified) + Infinispan + registry + HTTPRoute

---

### 3. Full template as-is

**Description**: Run all 6 template steps and all manifests unchanged.

| Pros | Cons |
|------|------|
| Workshop fidelity | **Impractical** on Kind |
| | Needs Janus ArgoCD (`janus-argocd`, project `janus`, `argocd:create-resources`) |
| | Needs Vault, Tekton, Quay, StackRox, SonarQube, ACS, TAS/Rekor |
| | 3-replica Strimzi on single-node Kind |
| | OpenShift Route CRD |

**Effort**: Very High / blocked

---

### Comparison table

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **1. Minimal demo** | Zero GitLab/cluster app deps; fast | No E2E pipeline; local runtime deps | Low |
| **2. Medium** | GitLab + ArgoCD + live game | GitLab + messaging/cache install; manifest surgery | Med–High |
| **3. Full as-is** | Complete supply chain | Not feasible on Kind without full Janus platform | Blocked |

---

## Recommendation

**Phased bootstrap for empty Kind cluster:**

### Phase A — Immediate (Approach 1)

1. `make kind-bootstrap && make tilt-up` in `kcd-lima-2026`
2. Register wind-turbine `template-dry-run.yaml` in catalog (`app-config.production.yaml` locations)
3. Run dry-run scaffold → `./mvnw quarkus:dev` on workstation (or add Quarkus Dev Services for Kafka if configured)

### Phase B — GitLab + deploy (Approach 2)

4. Deploy GitLab CE in Kind (Helm) OR point to external GitLab; create `development` group + PAT
5. Add `scaffolder-backend-module-gitlab`, `integrations.gitlab`, `GITLAB_TOKEN` to Backstage
6. Adapt `template.yaml`: remove `argocd:create-resources`; Kind defaults for host/cluster/registry
7. Simplify manifests: `helm/app` only; `janus-argocd` → `argocd`; project `janus` → `default`; replace Route with HTTPRoute
8. Install Strimzi operator + 1-broker Kafka; deploy Infinispan + `infinispan-generated-secret`
9. Use local Kind registry or `ghcr.io` for pre-built image; skip Tekton build initially
10. Apply ArgoCD Application manually or via gitops repo sync

---

## Bootstrap Checklist (empty Kind → runnable demo)

| # | Step | Command / action |
|---|------|------------------|
| 1 | Create Kind cluster | `make kind-bootstrap` (kind + Gateway API + Traefik) |
| 2 | Start Backstage | `make tilt-up` → `http://backstage.localhost:8080` |
| 3 | Verify platform stack | `make platform-smoke` (ArgoCD + observability pods) |
| 4 | Register template | Add catalog location for wind-turbine template (file or URL) |
| 5 | (Medium) Deploy GitLab | Helm chart in Kind + ingress; or external GitLab SaaS |
| 6 | (Medium) Backstage GitLab integration | `integrations.gitlab` + `scaffolder-backend-module-gitlab` + `GITLAB_TOKEN` |
| 7 | Fix ArgoCD namespace mismatch | Template/manifests: `janus-argocd` → `argocd`; remove `argocd:create-resources` |
| 8 | App messaging/cache | Strimzi operator + Kafka CR; Infinispan Helm + secret |
| 9 | Registry | Kind local registry or ghcr.io; update `image_host` defaults |
| 10 | Simplified deploy | `helm/app` via ArgoCD Application; HTTPRoute for exposure |
| 11 | Update template defaults | `cluster_id`, `repo.host`, registry params for Kind |

---

## Gaps Table

| Component | Template expects | kcd-lima Kind has | Action needed |
|-----------|------------------|-------------------|---------------|
| GitLab host | `gitlab-gitlab.apps.*.opentlc.com` | None | Deploy GitLab in Kind or use external; update defaults |
| `publish:gitlab` | GitLab scaffolder action | Only `publish:github` | Add `scaffolder-backend-module-gitlab` |
| `integrations.gitlab` | PAT + host config | Not configured | Add to `app-config*.yaml` |
| `GITLAB_TOKEN` | Required for publish | Missing from `secret.yaml` | Add secret + env |
| `argocd:create-resources` | Janus scaffolder plugin | Not installed | Remove step; use gitops YAML + manual/ArgoCD sync |
| ArgoCD namespace | `janus-argocd` | `argocd` | Retarget all `manifests/argocd/*.yaml` |
| ArgoCD project | `janus` | `default` | Change project in Application specs |
| ArgoCD instance name | `main` (scaffolder input) | `kind-local` (app-config) | Align or drop scaffolder step |
| Kafka | Strimzi `my-cluster` (3+3) | None | Install Strimzi; deploy simplified Kafka CR |
| Infinispan | External cluster + secret | None | Helm install Infinispan; create `infinispan-generated-secret` |
| Image registry | OCP ICR or Quay workshop | None | Local registry / ghcr.io; plain `imagePullSecret` |
| OpenShift Route | `route.openshift.io/v1` | Gateway API HTTPRoute | Replace Route template with HTTPRoute |
| Vault / ExternalSecrets | `vault-secret-store` | None | Remove for Kind; use K8s Secrets |
| Tekton pipelines | Full CI/CD in `helm/build` | None | Defer; use pre-built image |
| StackRox/Sonar/ACS/TAS | Build pipeline tasks | None | Defer (out of Kind scope) |
| Template in catalog | Registered Template entity | Not registered | Add `catalog.locations` entry |
| `template-dry-run.yaml` | Pattern exists for agentic template | Missing for wind-turbine | Create for booth demo |
| Wind-turbine defaults | OpenShift sandbox URLs | `backstage.localhost:8080` | Parameter default overrides |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `publish:gitlab` fails (no module) | Certain | Template aborts at step 2 | Add GitLab module or use dry-run only |
| `argocd:create-resources` fails | Certain | Template aborts at step 6 | Remove step in Kind variant |
| GitLab in Kind resource-heavy | High | Cluster OOM / slow | External GitLab SaaS for demo |
| Strimzi 3-replica on single-node Kind | High | Pending pods | Single-broker Kafka CR |
| Infinispan missing | Certain | App crash loop | Deploy Infinispan before app sync |
| No image from Tekton | Certain (without build stack) | ImagePullBackOff | Pre-build and push image manually |
| Workshop secrets in ExternalSecrets | Certain | Sync failures | Kind-specific manifest subset |
| Review scope creep (full supply chain) | Medium | Delivery delay | Strict Approach 2 boundary |

---

## Ready for Proposal

**Yes** — propose `kcd-kind-template-runtime` as Phase 2 env work: Kind bootstrap checklist, GitLab integration, template/manifest Kind adaptation, and dry-run path for immediate demo.

**Suggested Phase 2 change name**: `kcd-kind-template-runtime` (this exploration).
