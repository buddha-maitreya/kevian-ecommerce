FROM node:20-alpine AS base

# Build client
FROM base AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build server
FROM base AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npx tsc

# Production
FROM base AS production
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY --from=server-build /app/server/dist ./server/dist
COPY --from=client-build /app/client/dist ./client/dist
COPY server/drizzle.config.ts ./server/
COPY server/src/db/schema.ts ./server/src/db/

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server/dist/index.js"]
