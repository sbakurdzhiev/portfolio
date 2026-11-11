---
name: fullstack-developer
description: Full-stack software engineering skill covering modern web frameworks (React, Vite, Next.js, Node.js), API design, state management, databases, containerization, and production deployment. Activate when building, architecting, or deploying full-stack web applications.
---

# Full-Stack Developer & Software Architecture Skill

Use this skill when designing architectures, implementing frontend/backend code, managing state, connecting databases, or configuring deployment pipelines.

## Architectural Guidelines

### 1. Frontend Architecture
- **Frameworks**: React 18/19, Vite, Next.js (App Router), Tailwind CSS, TypeScript.
- **Component Design**: Modular, reusable components with clear prop contracts.
- **State Management**: Local state with hooks, Context API for global themes/audio, Zustand/Redux for high-frequency stores.

### 2. Backend & API Design
- **Runtime & Servers**: Node.js (Fastify/Express), Go (Gin/Chi), or Python (FastAPI).
- **Protocols**: RESTful APIs with OpenAPI specs, WebSocket streaming for real-time logs.
- **Databases**: PostgreSQL (with connection pooling via PgBouncer or CrunchyData PGO), Redis caching.

### 3. Production Deployment & DevOps Integration
- Multi-stage Dockerfiles with rootless Alpine / distroless base images.
- Reverse proxy configuration with Nginx or Caddy (SSL, Gzip, security headers).
- Declarative Kubernetes & OpenShift manifests (Deployments, Services, Routes, Ingress).
- GitHub Actions CI/CD workflows for automated build, test, and release.

## References
- [Modern Stack Patterns](./references/modern-stack-patterns.md)
- [Performance & Production Deployment](./references/performance-and-deployment.md)
