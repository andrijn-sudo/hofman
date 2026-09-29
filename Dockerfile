# 1. Install all dependencies (needed for compilation and build)
FROM node:24-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Install only production dependencies
FROM node:24-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 3. Build the application
FROM node:24-alpine AS build-env
WORKDIR /app
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Production runtime image
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production artifacts
COPY package.json package-lock.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

# Run as non-root user for security
USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
