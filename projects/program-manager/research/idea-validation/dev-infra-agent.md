# Idea validation — Agentic Developer Infrastructure Dashboard

## Executive summary + recommendation

**Concept recap:** A GitHub-integrated agent runs on each commit/PR. A multi-agent pipeline audits the repo(s) and infra-as-code to: (1) construct/update an infrastructure/architecture map (e.g., C4-style + deployment/service dependency views), (2) validate architecture docs/ADRs against reality, and (3) surface findings in a dashboard. Output docs are **agent-consumable** so coding agents can reference accurate, current system context.

**Recommendation: PROMOTE TO ACTIVE (with a narrow MVP).**

Rationale:
- **Problem is real and persistent:** teams repeatedly report architecture diagrams/docs become outdated quickly; onboarding suffers; docs lose trust.
- **Market is active but fragmented:** many tools help *draw* diagrams or *store* docs, fewer close the loop by continuously reconciling code+IaC+runtime signals and enforcing “docs-as-contract”.
- **AI agents + repo triggers are a timely wedge:** PR-based automation (summaries, reviewers) is already accepted; extending that to “living architecture context” is a credible next step.

Primary risk: **crowded adjacent space** (IDPs, diagram-as-code, AI code understanding). Winning likely requires crisp differentiation: **validation + drift detection + agent-readable outputs** rather than “yet another diagram tool”.

---

## Problem relevance (evidence + frequency score)

### What devs complain about (themes)
1. **Architecture diagrams/documents go stale fast** (especially whiteboard/Lucidchart/manual artifacts).
2. **Onboarding pain**: new engineers can’t build correct mental models; docs aren’t trusted.
3. **Documentation debt**: teams stop updating docs because it’s not part of the change workflow.
4. **Need for automation / diagrams-as-code**: keeping diagrams in version control and tying updates to code changes is a common suggestion.

### Direct evidence (quotes)
- r/softwarearchitecture: “In most teams I’ve worked with, architecture diagrams either start as a whiteboard sketch or a Lucidchart, **but within a few sprints, they’re already outdated**.”
  - https://www.reddit.com/r/softwarearchitecture/comments/ta77pw/what_diagraming_tool_do_you_use_for_software/

- r/devops (cloud diagrams): “Like any other form of documentation, **it’s easy for them to become outdated if keeping them updated isn’t part of your normal change/development process**.”
  - https://www.reddit.com/r/devops/comments/1h1ekir/cloud_architecture_diagrams/

- r/devops (cloud diagram best practices): “**They often become outdated**.”
  - https://www.reddit.com/r/devops/comments/1664mem/are_there_best_practices_and_names-for-cloud/

- r/softwarearchitecture (doc levels): “Very rarely using level 4 - **it gets outdated very fast**.”
  - https://www.reddit.com/r/softwarearchitecture/comments/1fq60ny/how_you_describe_sw_architecture_in_documentation/

- r/softwarearchitecture (automated diagrams): user explicitly cites the pain: “I dealt with **outdated architecture documentation** alot and made it hard for me to maintain or onboard to a new code base.”
  - https://www.reddit.com/r/softwarearchitecture/comments/1fz21jm/automated_c4_diagrams_with_structurizr_dsl/

### Quantifying frequency (lightweight)
Because Reddit pages are blocked to direct fetching in this environment (403), I couldn’t programmatically count instances across the specified subreddits. However, even limited search results repeatedly return “outdated diagrams/docs” statements across multiple communities (devops, softwarearchitecture, dotnet, etc.), suggesting the complaint is **common** and **cross-discipline**.

**Frequency score: HIGH.**
**Trend direction: INCREASING.**
Drivers:
- More microservices + more infra (Kubernetes, serverless) → more moving parts.
- More AI coding agents/assistants → higher need for trustworthy, machine-readable system context.

---

## Market saturation & competitors (landscape + saturation score)

This idea sits at the intersection of:
- **Diagrams-as-code / architecture modeling**
- **Codebase understanding / AI documentation**
- **Internal developer portals (IDPs)**
- **PR automation / policy enforcement**

### Competitor landscape (selected)

1. **Structurizr (C4 + docs/ADRs publishing)**
   - Strength: strong “model once, view many” with C4; integrates diagrams + documentation.
   - Gap vs concept: doesn’t inherently provide multi-agent commit-triggered *validation* that docs match code/infra; more “authoritative model in DSL” than “auto-reconciled living map”.
   - https://structurizr.com/

2. **CodeSee (codebase maps, auto-generated/auto-updated messaging)**
   - Marketing claims include: “**Auto generate and auto update your map as your code changes. No additional work required.**” and “free your team from needing to check outdated documentation.”
   - This is close to the “living map” portion of the concept.
   - Gaps vs concept: architecture *doc validation*, agent-consumable structured outputs, and infra-as-code/deployment topology validation may not be first-class.
   - https://www.codesee.io/

3. **Swimm (AI documentation / understanding, repo-integrated)**
   - Pricing model: “**Pricing is based on the number of lines of code you want to understand.**”
   - Focus (from pricing page) includes auto-generated documentation, flow visualization, enterprise deployments.
   - Gap vs concept: more “documentation/understanding platform” than “architecture drift auditor that gates merges and maintains an infra map”.
   - https://swimm.io/pricing

4. **Backstage (open-source IDP) + Spotify Portal**
   - Backstage is a platform to centralize services, ownership, docs, templates.
   - Spotify Portal positions as “Backstage in a box” and emphasizes cataloging and discoverability.
   - Gap vs concept: Backstage catalogs components and surfaces docs, but it won’t automatically reconcile and validate architecture docs on every commit without custom plugins/pipelines.
   - https://backstage.io/
   - https://backstage.spotify.com/products/portal

5. **Greptile (AI code review + codebase Q&A; mentions doc updates)**
   - Pricing page shows: “$30 / active dev / month” for cloud.
   - Core: PR review automation with repo context; API for building agents around codebases.
   - Gap vs concept: architecture mapping and infra topology modeling are adjacent but not the core; more “AI reviewer” than “living architecture dashboard”.
   - https://www.greptile.com/pricing
   - YC profile suggests doc updates and Q&A usage: https://www.ycombinator.com/companies/greptile

6. **Diagram-as-code tools (Mermaid, PlantUML, Graphviz, mingrammer/diagrams, AWS diagram-as-code)**
   - These are enabling primitives to keep diagrams in VCS.
   - Gap vs concept: they don’t automatically derive/validate architecture from commits; they’re authoring/rendering tools.
   - https://diagrams.mingrammer.com/
   - https://github.com/awslabs/diagram-as-code

### Saturation score
**Saturation: MODERATE (adjacent areas saturated; the exact “commit-triggered architecture validation + agent-consumable living docs” niche is less served).**

Observations:
- “Visualization + map” products exist.
- “AI code review” exists.
- “IDP dashboards” exist.
- The differentiator is **continuous reconciliation/validation** and **machine-targeted architecture context**.

---

## Differentiation opportunities (specific gaps)

1. **Docs-as-contract validation (drift detection) as the core**
   - Many tools generate diagrams; fewer **assert** that declared architecture matches reality.
   - Opportunity: treat architecture docs as testable artifacts (like CI).

2. **Agent-consumable architecture context (structured, queryable)**
   - Most docs are human prose or static images.
   - Output a canonical “system context bundle” (JSON/YAML + embeddings) that coding agents can load: components, owners, APIs, data stores, dependencies, trust boundaries, SLOs, deployment targets.

3. **Infra + code + runtime triangulation**
   - True “infra map” needs more than code parsing:
     - IaC (Terraform/Pulumi/CloudFormation)
     - K8s manifests/Helm
     - CI/CD configs
     - (Optional) observability traces/service graphs
   - Value: detect “ghost services”, unused resources, undocumented dependencies.

4. **PR-native workflow + governance**
   - Developers accept PR comments, checks, and required status checks.
   - Provide actionable diffs: “diagram changed because X”, “doc section missing for new queue/topic”.

5. **Multi-repo / org-wide graph**
   - Real orgs have many repos; keeping cross-repo dependency knowledge updated is hard.
   - A unified map + ownership model competes with tribal knowledge.

---

## Implementation suggestions

### Positioning
- Avoid positioning as “diagramming tool.”
- Position as **Architecture Drift Detection + Living System Context for Humans and Agents**.

### MVP scope (sharp wedge)
1. **GitHub App + PR check**
   - Trigger on PR (not every commit) to reduce cost/noise.
   - Produce: (a) architecture delta summary, (b) drift warnings, (c) artifacts.

2. **Single source of truth format (agent-consumable)**
   - Generate/maintain `/architecture/context.yaml` + `/architecture/diagrams/*.mmd` (Mermaid) or Structurizr DSL.
   - Keep it deterministic and diff-friendly.

3. **Detectors (start with 3 high-signal rules)**
   - New service/module introduced without:
     - ownership metadata
     - exposed API contract reference
     - data store / queue dependency declaration
   - IaC introduces a resource (queue/topic/db/bucket) not referenced in docs.
   - API calls to other services not represented in declared dependency graph.

4. **Dashboard (minimal)**
   - A web page showing:
     - current system map
     - drift findings over time
     - “docs coverage” score
     - last updated timestamp, PR links

### Phase 2 (expansion)
- Import runtime topology via OpenTelemetry/service graph/APM when available.
- Backstage plugin to display the map + drift score in existing IDPs.
- “Explain this subsystem” agent endpoint for copilots.

### Practical notes / risks
- **False positives** will kill adoption. Start conservative: report-only mode, then allow gating.
- **Security**: customers will demand least privilege + self-hosting option, especially for source access.
- **Cost control**: PR-only + incremental analysis (changed files) + caching.

---

## Sources (URLs)

Problem evidence (direct quotes / threads):
- https://www.reddit.com/r/softwarearchitecture/comments/ta77pw/what_diagraming_tool_do_you_use_for_software/
- https://www.reddit.com/r/devops/comments/1h1ekir/cloud_architecture_diagrams/
- https://www.reddit.com/r/devops/comments/1664mem/are_there_best_practices_and_names-for-cloud/
- https://www.reddit.com/r/softwarearchitecture/comments/1fq60ny/how_you_describe_sw_architecture_in_documentation/
- https://www.reddit.com/r/softwarearchitecture/comments/1fz21jm/automated_c4_diagrams_with_structurizr_dsl/

Competitors / adjacent tools:
- Structurizr: https://structurizr.com/
- CodeSee: https://www.codesee.io/
- Swimm pricing page: https://swimm.io/pricing
- Backstage: https://backstage.io/
- Spotify Portal for Backstage: https://backstage.spotify.com/products/portal
- Greptile pricing: https://www.greptile.com/pricing
- Greptile YC profile: https://www.ycombinator.com/companies/greptile
- Diagrams (mingrammer): https://diagrams.mingrammer.com/
- AWS diagram-as-code: https://github.com/awslabs/diagram-as-code
- Diagram-as-code tool landscape (overview article): https://icepanel.io/blog/2023-02-07-top-7-diagrams-as-code-tools-for-software-architecture
