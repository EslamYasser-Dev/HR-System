FROM node:22-alpine

WORKDIR /backend

# Copy package files and install dependencies
COPY package*.json ./
RUN yarn install --frozen-lockfile --production

COPY . .

# Expose the port
EXPOSE 5570
# Command to run the application
CMD ["yarn", "start"]
