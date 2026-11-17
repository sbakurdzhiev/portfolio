# Multi-stage Dockerfile for Stefan Bakurdzhiev DevOps Portfolio
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Optional: SHA-256 hex of the Publishing Studio access key (not a secret by itself,
# but never pass the plaintext key). docker build --build-arg VITE_CMS_KEY_HASH=...
ARG VITE_CMS_KEY_HASH=""
ENV VITE_CMS_KEY_HASH=${VITE_CMS_KEY_HASH}
RUN npm run build

# Stage 2: Hardened Non-Root Production Nginx Server
# Uses unprivileged alpine base (runs under UID 101, non-root)
FROM nginxinc/nginx-unprivileged:alpine-slim
LABEL maintainer="Stefan Bakurdzhiev <stefan.bakurdzhiev@gmail.com>"
LABEL description="Hardened Production Container for Stefan Bakurdzhiev DevOps Portfolio"

# Shared security headers. nginx drops server-level add_header directives in any
# location that defines its own add_header, so every location includes this file.
COPY <<'EOF' /etc/nginx/snippets/security-headers.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none';" always;
EOF

# Configure hardened unprivileged Nginx server on port 8080
# Quoted heredoc delimiter: no variable/escape processing, so regexes like /\. survive intact
COPY <<'EOF' /etc/nginx/conf.d/default.conf
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

    # Only allow safe HTTP methods
    if ($request_method !~ ^(GET|HEAD|OPTIONS)$ ) {
        return 405;
    }

    # Block access to hidden or dotfiles (e.g. .git, .env)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Content-hashed build output: safe to cache forever
    location /assets/ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Un-hashed public files (favicon, og image, feed, sitemap): short cache
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|xml|txt)$ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=86400";
        try_files $uri =404;
    }

    # SPA entry point + routing fallback: always revalidate so new deploys are picked up
    location / {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
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
