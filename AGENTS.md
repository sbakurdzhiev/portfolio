# Portfolio Project Memory & Guidelines

This document governs the **Stefan Bakurdzhiev DevOps Terminal Portfolio**.

## 📌 Project Overview
* **Name**: `portfolio`
* **Path**: `/home/ubuntu/agy/portfolio`
* **Live URLs**:
  - `http://79.76.35.169:3000`
  - `http://79.76.35.169` (Port 80 redirect)
* **Theme**: Tactical Ops Terminal (Option C)

## 📁 Key File References
* Memory: `file:///home/ubuntu/agy/portfolio/.agents/memory/portfolio_memory.md`
* Main App: `file:///home/ubuntu/agy/portfolio/src/App.jsx`
* Profile Data: `file:///home/ubuntu/agy/portfolio/src/data/portfolioData.js`
* Pipeline Simulator: `file:///home/ubuntu/agy/portfolio/src/components/PipelineSimulator.jsx`
* Interactive CLI: `file:///home/ubuntu/agy/portfolio/src/components/TerminalCLI.jsx`
* Audio Synthesizer: `file:///home/ubuntu/agy/portfolio/src/utils/audio.js`
* Dockerfile: `file:///home/ubuntu/agy/portfolio/Dockerfile`
* K8s Manifest: `file:///home/ubuntu/agy/portfolio/k8s/deployment.yaml`

## ⚙️ Development & Build
* Dev Server: `npm run dev -- --host 0.0.0.0 --port 3000`
* Production Build: `npm run build` (Outputs to `dist/`)
* Container Build: `docker build -t sbakurdzhiev/portfolio:latest .`
