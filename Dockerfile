# Multi-stage Dockerfile for Stefan Bakurdzhiev DevOps Portfolio
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Hardened Non-Root Production Nginx Server
# Uses unprivileged alpine base (runs under UID 101, non-root)
FROM nginxinc/nginx-unprivileged:alpine-slim
LABEL maintainer="Stefan Bakurdzhiev <stefan.bakurdzhiev@gmail.com>"
LABEL description="Hardened Production Container for Stefan Bakurdzhiev DevOps Portfolio"

# Configure hardened unprivileged Nginx server on port 8080
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 8080 default_server;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Suppress Nginx version information
    server_tokens off;

    # Gzip compression for high platform performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Enterprise-grade HTTP Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none';" always;

    # Only allow safe HTTP methods
    if (\$request_method !~ ^(GET|HEAD|OPTIONS)$ ) {
        return 405;
    }

    # SPA Routing fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Immutable static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Block access to hidden or dotfiles (e.g. .git, .env)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose unprivileged port 8080
EXPOSE 8080

# Health check probe
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
