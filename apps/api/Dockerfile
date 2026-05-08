# syntax=docker/dockerfile:1.7
FROM oven/bun:1.2.21-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/tsconfig/package.json packages/tsconfig/
RUN bun install --frozen-lockfile

FROM base AS runner
WORKDIR /app
COPY --from=deps /repo/node_modules ./node_modules
COPY apps/api ./apps/api
COPY packages/db ./packages/db
COPY packages/shared ./packages/shared
COPY package.json bun.lock ./
ENV NODE_ENV=production API_PORT=3001
EXPOSE 3001
CMD ["bun", "run", "apps/api/src/index.ts"]
