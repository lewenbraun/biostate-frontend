# Stage 1: Build the Quasar application
FROM node:20-alpine AS builder
# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire source code
COPY . .

# Install Quasar CLI
RUN npm i -g @quasar/cli

# Build the application in production mode
RUN quasar build

FROM nginx:stable-alpine

COPY .docker/nginx/prod/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY .docker/nginx/prod/entrypoint.sh /opt/entrypoint.sh

COPY --from=builder /app/dist/spa /usr/share/nginx/html

RUN apk add --no-cache certbot openssl bash busybox-openrc gettext && \
    chmod +x /opt/entrypoint.sh && \
    mkdir -p /var/www/acme && \
    chown -R nginx:nginx /var/www/acme && \
    chmod -R 755 /var/www/acme

CMD ["/opt/entrypoint.sh"]