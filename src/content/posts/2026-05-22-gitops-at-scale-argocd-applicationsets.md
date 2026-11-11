---
title: "Multi-Cluster GitOps at Scale with ArgoCD ApplicationSets"
slug: "gitops-at-scale-argocd-applicationsets"
date: "2026-05-22"
category: "GitOps & CI/CD"
readTime: "8 min read"
status: "published"
tags: ["ArgoCD", "GitOps", "ApplicationSet", "Helm", "Multi-Cluster"]
summary: "Architecting high-scale GitOps repositories, dynamic cluster generators, sync waves, and self-healing configurations across multi-region hybrid OpenShift and vanilla Kubernetes."
highlights:
  - "Repository layout: App of Apps vs ApplicationSet Matrix Generator"
  - "Sync Waves and hooks for graceful database migrations & secret provisioning"
  - "Automated cluster onboarding via label selectors and Vault integration"
  - "Eliminating GitOps configuration drift with self-healing reconciliation"
---

### Why ApplicationSets Replaced App-of-Apps
When managing dozens of Kubernetes clusters across staging, DR, and production environments, defining individual `Application` manifests creates repetitive boilerplate. ArgoCD ApplicationSets introduce generators that dynamically instantiate applications based on Git repository directories or cluster labels.

> [!NOTE]
> ApplicationSets allow a single manifest to orchestrate deployments across 50+ clusters simultaneously while preserving environment-specific Helm `values.yaml` overrides.

### Matrix Generator Configuration
Combine cluster discovery with Git directory scanning:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: infrastructure-services
  namespace: argocd
spec:
  generators:
  - matrix:
      generators:
      - clusters:
          selector:
            matchLabels:
              environment: production
      - git:
          repoURL: https://github.com/sbakurdzhiev/gitops-manifests.git
          revision: main
          directories:
          - path: "infrastructure/*"
  template:
    metadata:
      name: "{{path.basename}}-{{name}}"
    spec:
      project: default
      source:
        repoURL: https://github.com/sbakurdzhiev/gitops-manifests.git
        targetRevision: main
        path: "{{path}}"
      destination:
        server: "{{server}}"
        namespace: "{{path.basename}}"
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

### Sync Wave Sequencing
Avoid race conditions by ordering deployments with annotations:

| Sync Wave | Target Resource | Failure Mode Mitigated |
| :--- | :--- | :--- |
| **Wave -1** | CRDs & Namespaces | Missing resource definitions |
| **Wave 0** | Secrets & ConfigMaps | CrashLoopBackOff on missing env |
| **Wave 1** | DB Migrations (PreSync Job) | Schema mismatches |
| **Wave 2** | Workload Deployments | Unhealthy app instances |
| **Wave 3** | Ingress Routes & Monitors | Premature traffic routing |

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "1"
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
```

> [!TIP]
> Always enable `selfHeal: true` and `prune: true` in production. If an engineer applies a temporary `kubectl edit` in emergency, ArgoCD will immediately detect the drift and reconcile to Git source of truth.
