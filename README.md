# Stefan Bakurdzhiev // Tactical DevOps Portfolio

> **Senior DevOps & Platform Engineer • OpenShift & Kubernetes Specialist • Team Lead**  
> *"Automate everything. Monitor ruthlessly. Fail fast, recover faster."* ⚡

A terminal-inspired, tactical command center personal portfolio engineered for high impact. Designed without generic tropes—featuring real telemetry monitors, an interactive terminal CLI with command autocompletion, and an in-browser live GitOps CI/CD pipeline simulator.

---

## ⚡ Core Features

- **Cyber / Tactical Ops Aesthetic**: Deep slate palette (`#05080f`), cyber emerald (`#00ff9d`) and tactical cyan (`#00d4ff`) HUD accents, subtle CRT scanlines toggle, and glowing phosphor telemetry.
- **Dual Navigation Architecture**:
  - Clickable visual tabs and numbered keyboard shortcuts (`1` to `6`).
  - Interactive embedded CLI shell accessible via the launch button or pressing the backtick/tilde `` ` `` key anytime.
- **Live GitOps CI/CD Simulator**:
  - Interactive progressive delivery pipeline: SonarQube Lint → Trivy CVE & RBAC Audit → Multi-stage Podman Build → Kube-bench Validation → ArgoCD GitOps rollout to OpenShift production.
  - Real-time animated terminal logs and dynamic pod rollout status table.
- **Telemetry & Htop Stack Gauges**:
  - Resource allocation bars showcasing deep proficiency across Container Orchestration (OpenShift, K8s, PGO), CI/CD (ArgoCD, GitHub Actions, Jenkins), Observability (Prometheus, Grafana, Loki), and Cloud Infrastructure.
- **Kubernetes CRD Architecture Showcase**:
  - Milestones presented as Custom Resource Definitions with an interactive YAML manifest inspector.
  - Direct links to Stefan's repositories (`openshift`, `postgres-operator-examples`, `nagios`, etc.).
- **Journalctl Career Logs**:
  - Structured chronological execution logs covering Stefan's 10+ years in IT, leading 8 engineers at DXC Bulgaria, and academic cybersecurity credentials.
- **Synthesized Web Audio API FX**:
  - Crisp retro key clicks and execution chimes generated entirely in real-time through Web Audio (no external audio assets). Muted by default with a quick toggle.

---

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/sbakurdzhiev/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Production Build
```bash
npm run build
# Compiled static bundle is ready in ./dist
```

### Containerization (Docker / Podman)
```bash
# Build multi-stage container image
docker build -t sbakurdzhiev/portfolio:latest .

# Run container locally
docker run -d -p 8080:80 sbakurdzhiev/portfolio:latest
# Access via http://localhost:8080
```

### Deploy to OpenShift / Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
```

---

## ⌨️ Tactical CLI Commands

Within the interactive shell, you can execute:
- `help` — List all available commands
- `bio` — View operational background and leadership summary
- `skills` — Inspect platform proficiency levels
- `projects` — Display custom resource milestones & repos
- `pipeline run` — Trigger the live GitOps CI/CD deployment simulator
- `kubectl get nodes` — Display simulated cluster nodes & statuses
- `kubectl get pods` — View active production microservice pods
- `contact` — Transmit channels (Email, LinkedIn, Portfolio)
- `clear` — Wipe the terminal screen
- `sudo rm -rf /` — Trigger defense mechanism easter egg

---

## 📬 Direct Transmission

- **Email**: [stefan.bakurdzhiev@gmail.com](mailto:stefan.bakurdzhiev@gmail.com)
- **LinkedIn**: [Stefan Bakurdzhiev](https://www.linkedin.com/in/stefan-bakurdzhiev-055a3a113/)
- **GitHub**: [github.com/sbakurdzhiev](https://github.com/sbakurdzhiev)
- **Portfolio Domain**: [sbakurdzhiev.eu](https://sbakurdzhiev.eu)
