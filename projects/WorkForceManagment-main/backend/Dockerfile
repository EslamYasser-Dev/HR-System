FROM node:22-alpine

# Create a new group and user named "backend"

# Switch to the "backend" user

# Set the working directory
WORKDIR /backend

# Copy package files and install dependencies
COPY package*.json ./
RUN yarn install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 3362

# Run the application
CMD ["yarn", "dev"]
