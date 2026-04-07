# syntax=docker/dockerfile:1

# --- Build: dependências e bundle único (sem node_modules na imagem final) ---
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime: apenas Node + bundle (distroless, sem shell nem gerenciador de pacotes) ---
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=12343

# Usuário não-root (65532 = nonroot no distroless)
USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /app/dist/server.cjs ./server.cjs

EXPOSE 12343

CMD ["server.cjs"]
