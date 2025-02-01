# Stage 1: Build the Quasar application
FROM node:23-alpine AS builder
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

# Stage 2: Serve the built application using Nginx
FROM nginx:stable-alpine
# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration into the container
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
