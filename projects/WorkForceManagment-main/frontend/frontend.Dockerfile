# Stage 1: Build Node.js application
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code and build
COPY . .
RUN npm run build

# Stage 2: Run Node.js application
FROM node:22-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=build /app /app

# Expose the application port
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "run", "dev"]
