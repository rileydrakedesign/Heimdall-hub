# dev-infra-agent — Agentic Developer Infrastructure Dashboard (Build Plan)

## 0) Executive summary

**dev-infra-agent** is a GitHub-native (and eventually multi-VCS) system that keeps a *living, always-current* view of a company’s software + infrastructure architecture by:

1) **Deriving architecture from code and IaC on every commit/PR** (service catalog, dependencies, runtime & infra resources).
2) **Validating drift** (what code/IaC claims vs what’s deployed/observed).
3) **Writing back agent-readable context** (structured docs/diagrams + a graph API) that both humans *and* AI agents can trust.

The wedge: current IDPs (Backstage/Port/Cortex/OpsLevel) are excellent at cataloging and workflows, but they still rely heavily on manual metadata and integrations. dev-infra-agent makes the *repository itself* the primary source of truth and uses PRs as the control loop to keep architecture accurate.

---

## 1) Problem framing

### 1.1 The problem
Modern engineering orgs accumulate hundreds of repos, services, queues, topics, scheduled jobs, data pipelines, and cloud resources. The cost isn’t the existence of complexity—it’s **lack of shared, current context**:

- **Architecture drift**: diagrams and docs diverge from reality within days/weeks.
- **Ownership gaps**: nobody knows who owns “that service” or the S3 bucket feeding it.
- **Hidden coupling**: dependencies are implicit in code/IaC/observability and not surfaced.
- **Change risk**: PRs change infra + service interactions but reviewers lack system context.
- **Agentic future**: AI agents can write code, but they fail without trusted org context.

### 1.2 Why now
- Repos + IaC increasingly represent the real system (GitOps, IaC-first workflows).
- GitHub PRs are the default governance and review mechanism.
- Diagram-as-code + “docs-like-code” are accepted patterns (e.g., Backstage TechDocs).
- Organizations are actively investing in IDPs and scorecards, but adoption is limited by manual upkeep.

### 1.3 Ideal customer profile (ICP)

**Primary ICP**
- 50–500 engineers, microservices + cloud infrastructure.
- GitHub (Cloud or Enterprise) + Terraform/OpenTofu and/or Pulumi.
- A platform engineering or DevEx team with mandate to reduce cognitive load.

**Secondary ICP**
- Security/Compliance teams needing continuous evidence of architecture/ownership.
- SRE/infra teams needing dependency maps + drift alerts.

**Buyer / champions**
- VP Eng / Head of Platform / DevEx lead.

**Users**
- Platform engineers (configure ingestion and policies)
- Service owners (review PR comments, own entities)
- Oncall/SRE (drift alerts, blast radius)
- New engineers (system map, “how things work”)

### 1.4 “Jobs to be done”
- “When I open a PR, I want to know what system interactions changed.”
- “When we onboard a new service, I want it in the catalog automatically.”
- “When someone says ‘who owns X’ I want an authoritative answer.”
- “When infra drifts from IaC, I want a ticket/alert with exact diffs.”
- “When an AI agent proposes changes, it must read our architecture model first.”

---

## 2) Competitive landscape

### 2.1 Internal Developer Portals (IDPs)

**Backstage (Spotify OSS)**
- Strengths: mature plugin ecosystem; **Software Catalog** uses metadata YAML stored in source control and “harvested and visualized” in Backstage; TechDocs is docs-like-code (MkDocs) integrated into the catalog.
- Key point: Backstage’s source of truth is often `catalog-info.yaml` plus integrations; architecture is not automatically derived, and drift detection is not core.
- Sources:
  - Backstage Software Catalog docs (metadata YAML in source control): https://backstage.io/docs/features/software-catalog/
  - Backstage TechDocs docs (docs-like-code in Backstage): https://backstage.io/docs/features/techdocs/

**Port**
- Positions as IDP with a **“Context Lake”**, catalog, actions, scorecards, workflow orchestrator, and AI agents.
- Strong on customizable data model + workflows; still typically depends on integrations + declared entities.
- Source: Port docs overview (pillars): https://docs.port.io/

**Cortex**
- AI-powered IDP; emphasizes ownership/accountability + catalog + scorecards + workflows; includes “Cortex MCP” for natural language querying.
- Strong on maturity programs; architecture as derived-from-code is not the center.
- Source: Cortex docs landing: https://docs.cortex.io/

**OpsLevel**
- IDP focused on service catalog + maturity rubrics/checks + actions.
- Source: OpsLevel site + docs landing: https://www.opslevel.com/ and https://docs.opslevel.com/

**Takeaway**: These platforms are *system-of-record portals*—they unify data and enable workflows. dev-infra-agent should integrate with them or compete by being the **automated architecture/drift layer** that feeds an IDP.

### 2.2 Diagram-as-code / architecture modeling

**Structurizr (C4, model-as-code)**
- “Models as code” for the C4 model; write Structurizr DSL and render multiple diagrams from one model; can export to other renderers including Mermaid.
- Source: Structurizr docs home: https://docs.structurizr.com

**Mermaid**
- Text-based diagrams; designed to reduce doc-rot by keeping diagrams close to dev workflows; widely supported (incl. GitHub Markdown rendering).
- Source: Mermaid README: https://github.com/mermaid-js/mermaid

**D2**
- Text-to-diagram language emphasizing fast diagram creation and a robust CLI.
- Source: D2 docs: https://d2lang.com

**Takeaway**: dev-infra-agent should store architecture as a **semantic model (graph)** and generate views/diagrams (C4) in multiple formats: Mermaid for ubiquity + Structurizr DSL for correctness/multi-view.

### 2.3 AI PR / code review tools
Category: tools that comment on PRs, propose fixes, and summarize changes (Copilot code review, CodeRabbit, Sweep AI, etc.). They provide “review-time intelligence” but typically lack deep org context and an authoritative architecture model.

**Takeaway**: dev-infra-agent’s PR comment becomes a differentiated “architecture diff” and a context provider for other agents.

### 2.4 Drift scanners / infra reality checks

**Terraform/OpenTofu**
- Both manage resources via a state file and can compute diffs via plan; drift detection is commonly implemented by periodic plans against remote state.
- OpenTofu intro describes plan/apply workflow and state as source of truth: https://opentofu.org/docs/intro/

**Takeaway**: dev-infra-agent should treat IaC plan/state as one signal and optionally corroborate with cloud inventory/CMDB/observability.

---

## 3) Differentiation wedge

### 3.1 Wedge statement
**“Every PR updates the architecture model; every deploy validates it.”**

### 3.2 Core differentiators
1) **Commit/PR-triggered living architecture**
   - On every PR: re-scan changed files, update dependency graph, update C4 views.
   - Post a PR comment showing *architecture impact* (new edges, removed edges, changed resources).

2) **Drift validation loop**
   - Compare:
     - Declared: repo code + IaC + config
     - Expected: architecture model snapshot (previous baseline)
     - Observed: cloud inventory (optional), runtime telemetry (optional), Kubernetes manifests (optional)
   - Raise “drift alerts” with actionable diffs and owners.

3) **Agent-readable documentation**
   - Write structured artifacts back to repo (optional): `/.dev-infra-agent/` with JSON graph snapshots, C4 views, and a compact “system context” for AI.
   - Provide an API for LLM tools/agents (GraphQL/REST) + MCP-like interface later.

4) **Model-first, portal-second**
   - The “dashboard” is a view layer over a canonical graph; integrate into Backstage/Port/Cortex as a plugin/export.

---

## 4) System architecture (proposed)

### 4.1 High-level components
- **GitHub App** (installation on org/repos)
  - Receives webhooks for PRs, pushes, workflow runs.
  - Authenticates as App/Installation.
- **Webhook/API service**
  - Validates signatures (GitHub + internal).
  - Persists events and enqueues jobs.
- **Queue**
  - SQS/Redis/Rabbit/Kafka; choose by stack.
- **Worker fleet**
  - Repo scanners, parsers, graph builders, renderers.
  - Runs deterministically and safely (sandboxed execution).
- **Graph + relational storage**
  - Postgres as source-of-truth for tenants/entities + edges.
  - Optional graph DB or Postgres + graph queries.
- **Artifact storage**
  - S3/GCS for rendered diagrams, snapshots, job logs.
- **Dashboard web app**
  - Multi-tenant UI, RBAC, search, visualizations.
- **Integrations layer (optional)**
  - Cloud inventory (AWS/GCP/Azure)
  - Kubernetes API
  - Observability (OpenTelemetry/Datadog/New Relic)
  - Existing IDP exports

### 4.2 Event flow (PR)
1. PR opened/synchronize → GitHub webhook.
2. Webhook service validates payload and enqueues `RepoScanJob(pr, commitSha)`.
3. Worker checks out repo at SHA (shallow fetch) and runs scanners:
   - language dependency extraction (package managers)
   - service boundary inference
   - IaC parse (Terraform/OpenTofu/Pulumi)
   - config discovery (Helm/Kustomize/Docker/K8s YAML)
4. Worker updates **graph snapshot** and computes **diff vs base**.
5. Render updated diagrams (C4 context/container) to SVG/PNG + Mermaid.
6. Post PR comment with summary + links to dashboard.

### 4.3 Event flow (main branch merge + drift)
- On merge to main: record new “baseline snapshot”.
- On schedule or deployment events: re-run scans + compare with observed signals.
- Create drift issues/alerts + route to owners.

### 4.4 GitHub App permissions (least privilege directionally)
Use GitHub Apps because they can be installed per-org and granted to specific repos, have narrow permissions, and built-in webhooks.
- Source: GitHub Apps overview: https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps
- Webhooks reference: payloads, signatures, headers, payload cap: https://docs.github.com/en/webhooks/webhook-events-and-payloads

Recommended minimum (adjust by features):
- Repository permissions: **Contents: Read** (to read repo files), **Pull requests: Read/Write** (to comment), **Checks: Read/Write** (optional status checks), **Metadata: Read** (implicit), **Commit statuses: Read/Write** (optional).
- Organization permissions: **Members: Read** (optional for ownership mapping), **Administration: none**.

### 4.5 Multi-tenant auth + RBAC
- Tenant = GitHub org (or enterprise) installation.
- Auth: GitHub OAuth for user login to dashboard, mapping to org membership.
- RBAC roles:
  - Org Admin (manage install, policies)
  - Platform Engineer (configure scanners, baselines)
  - Service Owner (edit ownership metadata, acknowledge drift)
  - Read-only (most engineers)

---

## 5) Scanning & model generation pipeline

### 5.1 Repository scanning (signals)

**Code dependency extraction** (fast, deterministic)
- Node: parse `package.json`, lockfiles.
- Python: `pyproject.toml`, `requirements.txt`.
- Go: `go.mod`.
- Java/Kotlin: Maven/Gradle.
- .NET: csproj + NuGet.

**Service boundary inference**
- Heuristics:
  - repo = service (monorepo needs sub-project detection)
  - presence of `Dockerfile`, `helm/`, `k8s/`, `serverless.yml`
  - runtime ports, openapi specs, queues/topics names

**IaC parsing**
- Terraform/OpenTofu:
  - parse HCL, build resource graph from configuration + `terraform graph`/plan outputs when possible.
  - map modules → logical systems.
- Pulumi:
  - parse Pulumi program (hard) OR rely on `pulumi preview --json` outputs in CI.
  - prefer integration via CI artifacts.

**Kubernetes manifests**
- parse YAML for Deployments, Services, Ingress, ConfigMaps, etc.
- map labels/selectors to services.

**Docs & declared metadata**
- optional adoption path:
  - `dev-infra-agent.yaml` (or reuse Backstage `catalog-info.yaml`)
  - allow explicit overrides for ownership, tier, boundaries

### 5.2 Graph construction
Create a canonical **Architecture Graph** with:
- Nodes: services, libraries, APIs, infra resources, datastores, queues, deployments, teams.
- Edges: depends_on, calls, publishes_to, consumes_from, owns, deployed_as, provisions.

Maintain versioned snapshots:
- `snapshot_id`, `repo_sha`, `timestamp`, `derived_from` signals.

### 5.3 C4 model generation
- Derive C4 levels from graph:
  - System Context: systems + external dependencies.
  - Containers: services + datastores + queues.
  - Components: optional later (too expensive/noisy).

**Rendering choices**
- Primary: Mermaid (easy embedding, GitHub support)
- Secondary: Structurizr DSL to produce consistent multi-view diagrams and export to Mermaid/PlantUML.
  - Structurizr is explicitly “models as code” for C4 and supports multiple diagrams from one model: https://docs.structurizr.com

### 5.4 Diagram rendering pipeline
- Worker outputs:
  - `diagram.mmd` (Mermaid)
  - `diagram.svg/png`
  - `model.dsl` (Structurizr)
  - `graph.json` (agent-readable)
- Store artifacts in object storage with content-addressed paths.

---

## 6) Product scope & feature set

### 6.1 MVP (4–8 weeks)
Goal: prove wedge—PR-triggered architecture diff + dashboard map.

**Core**
- GitHub App install + webhook ingestion.
- Repo scanner for:
  - basic service detection
  - dependency extraction for 2–3 ecosystems (Node + Python + Terraform)
- Graph store + snapshot diff.
- Web dashboard:
  - Service catalog (auto-discovered)
  - System map (basic dependency graph)
  - Change feed (PR-based)
- PR comment bot:
  - “Architecture impact” summary
  - link to dashboard diff view

**Nice-to-have**
- Basic ownership inference (CODEOWNERS / GitHub teams)
- Export Mermaid diagram into PR comment as collapsible block.

### 6.2 v1 (8–16 weeks)
Goal: operationalize drift detection + policy enforcement.

- More scanners:
  - Go, Java, K8s manifests, Helm
  - OpenAPI/AsyncAPI discovery
- Drift detection:
  - scheduled IaC plan-based drift checks
  - “expected vs observed” checks for K8s resources
- RBAC + audit log.
- “Docs sync status” view:
  - which services have missing/old docs
  - enforce minimal doc set
- Notifications:
  - Slack/Teams + GitHub issues
- Export integrations:
  - Backstage entity YAML output OR plugin feed

### 6.3 v2 (16–32 weeks)
Goal: become the context substrate for humans + agents.

- Observability-powered dependency inference:
  - OpenTelemetry service graph ingestion (optional) and reconciliation.
- Policy-as-code:
  - declare architecture invariants (e.g., PCI services can’t call non-compliant stores)
- Agent tool interface:
  - GraphQL + MCP-like server for AI agents to query “what depends on X?”
- Self-serve workflows:
  - generate scaffolds and create PRs that update architecture model.
- Multi-VCS support: GitLab, Bitbucket.

---

## 7) UX/UI spec (dashboard + PR experience)

### 7.1 Information architecture (IA)
Left nav:
- Overview
- System Map
- Service Catalog
- Changes
- Drift Alerts
- Docs
- Policies (v1)
- Settings (installations, RBAC, integrations)

### 7.2 Core views

**Overview**
- Top risks: drift alerts, undocumented services, high-centrality dependencies.
- Recent PRs with architecture impact.

**System Map**
- Zoomable dependency graph.
- Filters: domain/team/tier/runtime.
- Views: C4 context vs container.

**Service Catalog**
- Auto-discovered services with:
  - owner, tier, language, deploy target
  - upstream/downstream dependencies
  - linked docs, runbooks

**Changes (Architecture Change Feed)**
- Timeline of graph diffs by PR/commit.
- “blast radius” computed from dependency paths.

**Drift Alerts**
- list of drift findings with severity, owner, and remediation steps.
- show “expected vs observed” diff.

**Docs sync status**
- per-service doc completeness and freshness.

### 7.3 PR comment format (example)

**dev-infra-agent — Architecture Impact**
- Services affected: `payments-api`, `billing-worker`
- New dependencies:
  - `billing-worker` → `kafka.topic.invoices`
- Removed dependencies:
  - `payments-api` → `redis.cache.sessions`
- IaC changes:
  - `aws_sqs_queue.invoice_dlq` (new)
- Risk notes:
  - New outbound dependency crosses domain boundary: `billing` → `finance` (policy: WARN)

Links:
- View architecture diff: `<dashboard-url>/diff/<pr>`
- View updated system map: `<dashboard-url>/map?focus=billing-worker`

---

## 8) Tech stack recommendations

### 8.1 Web app
- **Next.js** (App Router) + TypeScript.
- Auth: NextAuth or custom OAuth with GitHub.
- UI: Tailwind + shadcn/ui or similar.

### 8.2 API & worker runtime
- API: Node.js (NestJS/Fastify) or Go.
- Workers:
  - containerized (Kubernetes) or serverless (AWS ECS/Fargate) depending on scale.
  - must support running parsers/CLIs (Terraform/OpenTofu, diagram renderers).

### 8.3 Storage
- Postgres for tenants, entities, snapshots, job state.
- Graph queries:
  - Start with Postgres adjacency + recursive CTEs.
  - Evaluate Neo4j or Memgraph only if query complexity/latency demands.
- Object storage: S3-compatible for diagrams & scan artifacts.

### 8.4 Diagram tooling
- Mermaid rendering via `@mermaid-js/mermaid-cli` for SVG/PNG.
- Structurizr DSL generation + export for C4 fidelity.
- D2 as an optional additional renderer for certain diagram styles.

### 8.5 Observability (optional)
- OpenTelemetry SDK + collector for internal service metrics.
- Later: ingest service dependency graphs derived from tracing.

---

## 9) Data model (entities + edges)

### 9.1 Core entities
- **Tenant**: org/account.
- **Repo**: GitHub repo metadata.
- **Service**: logical runtime unit (may map to repo path).
- **Component/Library**: shared package.
- **API**: OpenAPI/GraphQL endpoint.
- **InfraResource**: Terraform/Pulumi resource (S3 bucket, queue, DB, etc.).
- **Deployment**: K8s deployment, ECS service, Lambda.
- **Team/User**: owners.
- **DocArtifact**: runbook, ADR, README, TechDocs site.
- **Snapshot**: versioned graph + derived artifacts.
- **Finding**: drift alert / policy violation.

### 9.2 Edges (examples)
- `OWNS(Team -> Service)`
- `DEPENDS_ON(Service -> Service)`
- `CALLS(Service -> API)`
- `PUBLISHES_TO(Service -> QueueTopic)`
- `CONSUMES_FROM(Service -> QueueTopic)`
- `USES(Service -> InfraResource)`
- `DEPLOYED_AS(Service -> Deployment)`
- `PROVISIONED_BY(InfraResource -> Repo)`
- `DOCUMENTED_BY(Service -> DocArtifact)`

### 9.3 Snapshots and diffs
- Store snapshots as:
  - normalized tables for current graph
  - append-only change log for diffs
- Provide deterministic `diff(old_snapshot, new_snapshot)` output for PR comments and UI.

---

## 10) Security & compliance

### 10.1 GitHub security
- Validate webhook signatures; GitHub recommends HMAC SHA-256 header `X-Hub-Signature-256`.
  - Source: GitHub webhook headers: https://docs.github.com/en/webhooks/webhook-events-and-payloads
- Use GitHub App installation tokens; avoid long-lived PATs.
- Least-privilege permissions; allow repo-scoped installs.

### 10.2 Secret handling
- Never store customer repo contents beyond what’s required.
- Encrypt tokens at rest (KMS) and in transit.
- Separate per-tenant encryption keys when feasible.

### 10.3 Data retention
- Configurable retention for scan artifacts and PR diff outputs.
- Provide “delete tenant” workflow.

### 10.4 Safe scanning
- Do not execute arbitrary repo code.
- Prefer static parsing over running build steps.
- Sandbox any CLI tools; limit network egress.

---

## 11) Implementation roadmap (milestones + acceptance criteria)

### Milestone 1 — GitHub App + ingestion (Week 1–2)
**Deliverables**
- GitHub App registration, install flow.
- Webhook receiver with signature validation.
- Queue + job runner skeleton.

**Acceptance criteria**
- PR open/sync triggers a job; job metadata visible in admin UI.

### Milestone 2 — Repo scanning + basic catalog (Week 2–4)
**Deliverables**
- Repo checkout at SHA.
- Parse Node/Python deps + Terraform resources.
- Create initial service entities.

**Acceptance criteria**
- For a sample org: catalog lists services with at least language + repo link.

### Milestone 3 — Graph + system map (Week 4–6)
**Deliverables**
- Graph storage + snapshotting.
- Dependency map UI.

**Acceptance criteria**
- Clicking a service shows upstream/downstream dependencies.

### Milestone 4 — PR architecture diff comment (Week 6–8)
**Deliverables**
- Diff algorithm for graph changes.
- GitHub PR comment bot.

**Acceptance criteria**
- Every PR receives a deterministic architecture impact comment within N minutes.

### Milestone 5 — Drift checks (v1, Week 8–16)
**Deliverables**
- Scheduled drift jobs (IaC plan-based).
- Drift alerts UI + notifications.

**Acceptance criteria**
- Known drift scenarios produce findings routed to owners; false positives manageable.

---

## 12) Go-to-market / packaging notes (optional)
- Position as **“Living architecture + drift control loop”**.
- Offer as:
  1) Standalone dashboard
  2) Export into Backstage/Port/Cortex

---

## 13) Sources / further reading
- Backstage Software Catalog: https://backstage.io/docs/features/software-catalog/
- Backstage TechDocs: https://backstage.io/docs/features/techdocs/
- Port docs (overview pillars): https://docs.port.io/
- Cortex docs: https://docs.cortex.io/
- OpsLevel docs: https://docs.opslevel.com/
- Structurizr docs: https://docs.structurizr.com
- Mermaid: https://github.com/mermaid-js/mermaid
- D2: https://d2lang.com
- GitHub Apps overview: https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps
- GitHub webhooks events/payloads: https://docs.github.com/en/webhooks/webhook-events-and-payloads
- OpenTofu intro (state/plan/apply): https://opentofu.org/docs/intro/
