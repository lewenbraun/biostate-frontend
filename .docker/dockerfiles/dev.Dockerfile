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

# Start dev mode
CMD ["quasar", "dev"]

# Expose port 9000 for the container
EXPOSE 9000
