# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build-args pour les vars d'env injectées au build
ARG VITE_API_URL
ARG VITE_MAPBOX_ACCESS_TOKEN
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MAPBOX_ACCESS_TOKEN=$VITE_MAPBOX_ACCESS_TOKEN

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine AS runner

# Config nginx custom pour SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie le build (dist pour Vite, build pour CRA)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]