---
title: "Hardening Cloud Native Supply Chains: Trivy, Cosign & Kyverno in CI/CD"
slug: "supply-chain-security-trivy-kyverno-cosign"
date: "2026-08-04"
category: "Security"
readTime: "6 min read"
status: "published"
tags: ["Security", "Trivy", "Cosign", "Kyverno", "Zero Trust", "DevSecOps"]
summary: "Building a zero-trust container delivery pipeline: automated CVE gating, cryptographic image attestation with Sigstore Cosign, and strict Kyverno admission controllers."
highlights:
  - "Automated vulnerability scanning with Trivy in GitHub Actions & GitLab CI"
  - "Cryptographic keyless signing using Sigstore Cosign & OIDC"
  - "Enforcing image signature admission validation via Kyverno ClusterPolicy"
  - "Blocking Critical/High CVEs before reaching the internal registry"
---

### The Challenge
Container registries are vulnerable to image tampering and outdated base image dependencies. Simply scanning images at build time is insufficient if unsigned images can still be deployed to the Kubernetes cluster without cryptographic verification.

> [!NOTE]
> Modern software supply chain attacks target the CI/CD pipeline itself. Securing the artifact delivery chain requires end-to-end cryptographic provenance from commit to runtime admission.

### 1. Build & Scan with Trivy
We configure Trivy to fail pipelines on CRITICAL CVEs with existing vendor fixes:

```yaml
- name: Scan Image with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'sbakurdzhiev/portfolio:${{ github.sha }}'
    format: 'table'
    exit-code: '1'
    ignore-unfixed: true
    vuln-type: 'os,library'
    severity: 'CRITICAL,HIGH'
```

### 2. Sign with Sigstore Cosign
Immediately after successful scanning and container registry push, we cryptographically sign the container digest using keyless OIDC tokens:

```bash
# Keyless signing via GitHub Actions OIDC identity token
cosign sign --yes ${CONTAINER_IMAGE}@${IMAGE_DIGEST}

# Verify signature locally before deployment
cosign verify --certificate-identity-regexp 'https://github.com/sbakurdzhiev/.*' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  ${CONTAINER_IMAGE}@${IMAGE_DIGEST}
```

### 3. Kyverno In-Cluster Verification Policy
Kyverno validates the signature before admitting any pod into production namespaces:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-signatures
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds:
          - Pod
    verifyImages:
    - imageReferences:
      - "sbakurdzhiev/*"
      attestors:
      - entries:
        - keyless:
            issuer: "https://token.actions.githubusercontent.com"
            subject: "https://github.com/sbakurdzhiev/*"
```

> [!TIP]
> Run Kyverno in `Audit` mode for the first 7 days in staging to catch legacy images before switching `validationFailureAction` to `Enforce`.

### Supply Chain Security Matrix

| Layer | Tooling | Enforcement Point | Failure Outcome |
| :--- | :--- | :--- | :--- |
| **Static Code** | SonarQube | CI Pull Request | PR Merge Blocked |
| **Container Image** | Trivy | Post-Build CI Step | Pipeline Halt & Alert |
| **Attestation** | Sigstore Cosign | Post-Scan Registry Push | Unsigned Image |
| **Runtime Gate** | Kyverno Admission | Kube-APIServer Webhook | Deployment Rejected |

> [!IMPORTANT]
> Never sign images before vulnerability scanning completes. Signing must be strictly conditional on zero Critical CVE findings.
