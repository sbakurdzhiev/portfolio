---
title: "From Ticket Hell to Platform Engineering: Leading 8 DevOps Engineers"
slug: "leading-8-engineers-platform-engineering"
date: "2026-03-10"
category: "Platform Leadership"
readTime: "5 min read"
status: "published"
tags: ["Leadership", "DXC Bulgaria", "Team Lead", "Platform Engineering", "Culture"]
summary: "A transparent leadership reflection from DXC Bulgaria on transforming a reactive operations team into a high-impact platform engineering unit with self-service golden paths."
highlights:
  - "Eliminating 70% of Jira ticket requests through Terraform & Crossplane self-service"
  - "Establishing \"Golden Paths\" for microservice bootstrapping in minutes"
  - "Psychological safety, blameless post-mortems, and engineering on-call rotation"
  - "Measuring platform velocity: DORA metrics (Deployment Frequency & Lead Time)"
---

### The Initial State: The Operations Bottleneck
When I stepped into the Team Lead role managing 8 DevOps and platform engineers at DXC Bulgaria, our squad was buried under a deluge of 80+ weekly manual requests: *"Create this namespace"*, *"Add this DNS record"*, *"Fix this CI/CD YAML"*. Our talented engineers were functioning as human API routers rather than platform builders.

> [!NOTE]
> If engineers spend more than 50% of their working hours answering reactive ticket queues, you do not have an engineering team — you have a manual operations barrier.

### Strategy 1: The "Everything as Code" Mandate
We established an ironclad rule: If a task has to be performed twice, it must be codified into a reusable Terraform module, Helm chart, or automated Ansible playbook.

### Strategy 2: Self-Service Developer Golden Paths
We created an automated repository template containing:
1. Standardized multi-stage Dockerfile with non-root security contexts
2. Pre-baked Helm chart with liveness/readiness probes and horizontal pod autoscaling
3. Pre-configured GitHub Actions & GitLab CI pipeline with Trivy security gates
4. Automatic registration in ArgoCD via label tagging

```bash
# Developer bootstraps a new production service in 1 command
platform-cli init --name payment-gateway --team payments --tier production
```

### Transformation Metrics

| Metric | Before Platform Transformation | After Golden Path Rollout |
| :--- | :--- | :--- |
| **New Microservice Lead Time** | 3 Weeks (4 Hand-offs) | **12 Minutes (Self-service)** |
| **Weekly Manual Jira Tickets** | 80+ Tickets / Week | **< 10 Strategic Requests** |
| **Deployment Frequency** | Bi-weekly (Maintenance Window) | **Multiple Times Daily** |
| **Change Failure Rate** | 18% Rollback Rate | **< 1.5% With Automated Canaries** |

> [!TIP]
> Golden Paths should never be mandatory prisons. If a specialized team needs custom architecture, give them an extension hook rather than forcing them into an ill-fitting mold.

### Strategy 3: Cultivating Blameless Culture & Psychological Safety
High reliability comes from transparent incident post-mortems. When a cluster configuration mistake happened, we focused entirely on systemic safeguards:
- *"Why did the admission controller allow this invalid manifest to pass?"*
- *"How can we add a pre-commit lint check so this is caught on developer workstations?"*

> [!IMPORTANT]
> Leading engineers is not about micromanaging pull requests — it is about removing friction, building consensus, and empowering every engineer to own platform excellence.
