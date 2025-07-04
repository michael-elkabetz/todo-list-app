# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Environment variables for Vite build
ARG VITE_API_URL
ARG VITE_APP_VERSION
ARG VITE_STORAGE_PREFIX
ARG VITE_ENABLE_LOGGING

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_STORAGE_PREFIX=${VITE_STORAGE_PREFIX}
ENV VITE_ENABLE_LOGGING=${VITE_ENABLE_LOGGING}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Production stage
FROM nginx:stable-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /usr/share/nginx/html
RUN chown -R nextjs:nodejs /var/cache/nginx
RUN chown -R nextjs:nodejs /var/log/nginx
RUN chown -R nextjs:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nextjs:nodejs /var/run/nginx.pid

# Switch to non-root user
USER nextjs

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]