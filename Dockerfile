# Use Node.js image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose development port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]