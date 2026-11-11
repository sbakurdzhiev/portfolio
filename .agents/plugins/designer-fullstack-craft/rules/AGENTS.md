# Web Design & Full-Stack Craft Rules

These rules apply whenever designing, building, or modifying frontend interfaces, web applications, or full-stack architectures.

## 🎨 Visual Design & Aesthetics (Anti-AI Slop Mandate)
1. **Never Default to Generic AI Templates**: Avoid cookie-cutter designs (e.g. standard purple-on-black hero with generic matrix rain, centered floating cards, and vague buzzwords).
2. **Intentional Typography Hierarchy**: Use characterful typefaces (e.g. JetBrains Mono, Fira Code, Geist, Inter). Keep clear font scales and line-heights (`1.4` to `1.6` for body, `1.1` to `1.2` for display).
3. **Restrained Color Palettes**: Stick to a deliberate 60-30-10 palette (dominant surface, secondary contrast, vivid accent). Never use more than 2 primary accent colors.
4. **Spatial Rhythm & Layout**: Use a consistent 4px/8px spacing system. Ensure generous whitespace and clear visual grouping.

## 💻 Frontend & UX Engineering
1. **Zero Layout Shifts & Horizontal Overflows**: Always verify `overflow-x: hidden` on viewport roots. Ensure all cards and tables wrap or scroll gracefully on mobile viewports.
2. **Meaningful Micro-Interactions**: Incorporate snappy hover states, focus rings, subtle CSS transitions (`150ms` to `250ms`), and tactile feedback (such as keyboard accessibility and optional Web Audio effects).
3. **Keyboard & Accessibility (a11y) First**: Every interactive button, tab, and modal must be navigable using `Tab`, `Enter`, and `Escape`. Preserve standard ARIA labels and focus outlines.

## ⚙️ Full-Stack & DevOps Reliability
1. **Clean Architecture**: Decouple business logic, state management, and UI rendering.
2. **Production-Ready Builds**: Always test `npm run build` to verify tree-shaking, bundle sizes, and zero TypeScript/lint regressions before concluding.
3. **Container & Cloud Readiness**: Provide clean multi-stage Dockerfiles, health checks (`/healthz` or liveness probes), and declarative manifests for deployment.
