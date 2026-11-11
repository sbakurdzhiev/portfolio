# Portfolio Project Memory

## 🏗️ Architecture & Component Map
* **Logo (`src/components/Logo.jsx`)**: Bespoke tactical vector SVG uniting Kubernetes helm/nodes with `SB` monogram and terminal prompt chevron.
* **Theme Switcher (`src/components/ThemeSwitcher.jsx`)**: 4 theme palettes (`cyber`, `amber`, `tokyonight`, `matrix`) switchable via UI and CLI.
* **Typewriter (`src/components/TypewriterText.jsx`)**: Animated typing cadence for roles and motto.
* **App Root (`src/App.jsx`)**: Manages navigation tabs, audio toggle state, CRT scanlines toggle, global keybindings (number keys `1-6` for tabs, backtick `` ` `` for CLI).
* **Telemetry Ribbon (`src/components/HeaderTelemetry.jsx`)**: Displays cluster heartbeat (`k8s-master-sofia-01 [READY]`), live ping (14ms jitter), UTC clock, and quick toggles.
* **Overview Section (`src/components/OverviewSection.jsx`)**: Hero ASCII banner with 4 centered methods (`SLANT`, `ANSI`, `BLOCK`, `MINI`), status chips, quick action buttons, metric dials, and dual human/YAML profile view.
* **Telemetry Section (`src/components/TelemetrySection.jsx`)**: Htop-style live resource bars for CPU/RAM/Net, skills breakdown with progress bars, and active Kubernetes operators map.
* **Live Pipeline Simulator (`src/components/PipelineSimulator.jsx`)**: Interactive CI/CD runner executing SonarQube, Trivy, Podman, Kube-bench, and ArgoCD rollout to OpenShift production with animated logs and pod rollout status table.
* **Architecture Showcase (`src/components/ProjectsSection.jsx`)**: Custom Resource Definitions with YAML manifest inspector and direct GitHub links.
* **System Journal (`src/components/CareerSection.jsx`)**: Formatted as `journalctl -u career.service` displaying DXC Bulgaria leadership, experience timeline, and academic credentials.
* **Tactical Shell (`src/components/TerminalCLI.jsx`)**: Embedded terminal shell with prompt `stefan@k8s-master:~#`, command autocompletion ([Tab]), history ([↑]/[↓]), and interactive command interpreter.
* **Transmission Footer (`src/components/FooterTelemetry.jsx`)**: Direct contact info, social links, and interactive secure dispatch form.
* **Audio Synthesizer (`src/utils/audio.js`)**: Pure Web Audio API synthesized mechanical keyboard clicks and deployment chimes.

## 🚀 Deployment Status
* **Dev Server**: Running on `0.0.0.0:3000` via Vite
* **Port 80 NAT Redirect**: Active via `iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000`
* **Public URLs**:
  - `http://79.76.35.169:3000`
  - `http://79.76.35.169`
* **Git Repository**: Pushed and tracking `git@github.com:sbakurdzhiev/portfolio.git` on branch `main`. Author: `dottysbb@gmail.com`.

## 📋 Next Potential Enhancements
* Adding animated terminal typing effect to the hero headline.
* Adding a downloadable PDF CV button in the header and terminal CLI.
* Adding theme switcher (Option C Cyber Slate / Option A Tokyo Night / Option B Amber CRT).
* Connecting custom domain `sbakurdzhiev.eu` with Cloudflare SSL.
