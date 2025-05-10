# Use official Node image
FROM node:18

# Create app directory in container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire server code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Run the main server file
CMD ["node", "src/server.js"]