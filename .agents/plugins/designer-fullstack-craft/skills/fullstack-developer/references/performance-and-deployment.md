# Performance & Production Deployment

## Core Web Vitals
- **LCP (Largest Contentful Paint)**: Minimize critical asset bundle sizes; preload hero fonts (`preconnect` + `font-display: swap`).
- **CLS (Cumulative Layout Shift)**: Ensure all image/icon wrappers have explicit dimensions or aspect ratios.
- **FID / INP**: Avoid heavy blocking JavaScript in the initial render loop; use asynchronous timers or worker threads.

## Production Containerization Checklist
- [x] Multi-stage Docker build to keep runtime images `< 30MB`.
- [x] Unprivileged non-root execution.
- [x] Gzip compression and long-term asset caching headers (`Cache-Control: public, max-age=31536000, immutable`).
- [x] Health checks (`livenessProbe` and `readinessProbe`) defined for Kubernetes/OpenShift orchestration.
