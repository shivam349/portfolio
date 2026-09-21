FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps --only=production

COPY scripts/ ./scripts/
COPY public/ ./public/

ENV NODE_ENV=production
ENV SEO_ADMIN_PORT=8080
EXPOSE 8080

CMD ["node", "scripts/seo-server.mjs"]
