# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY bun.lockb ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a non-root user
RUN adduser -D -u 1000 appuser && \
    chown -R appuser:appuser /usr/share/nginx/html

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]