# Base Node.js image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# libc6-compat might be needed for some dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy lockfiles and install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN ls -la /app && \
  if [ -f yarn.lock ]; then \
    yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "No valid lockfile found! Please include yarn.lock, package-lock.json, or pnpm-lock.yaml." && exit 1; \
  fi

# Build the project
FROM base AS builder
WORKDIR /app

# Copy dependencies and source files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables and build arguments
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# All environment variables that are used for t3-oss/env-nextjs
ARG NEXT_PUBLIC_BASE_URL
ARG DATABASE_URL
ARG RESEND_API_KEY
ARG RESEND_DOMAIN
ARG CUID_FINGERPRINT
ARG AUTH_URL
ARG AUTH_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_GITHUB_ID
ARG AUTH_GITHUB_SECRET
ARG UPLOADTHING_TOKEN

# Build command based on lockfile
RUN ls -la /app && \
  if [ -f yarn.lock ]; then \
    yarn build; \
  elif [ -f package-lock.json ]; then \
    npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm run build; \
  else \
    echo "No valid lockfile found during build." && exit 1; \
  fi

# Production image
FROM base AS runner
WORKDIR /app

# Add environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Add app-specific user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts and public files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use app-specific user
USER nextjs

# Expose port 3000 and start server
EXPOSE 3000
CMD ["node", "server.js"]
