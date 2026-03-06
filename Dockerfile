# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy the core package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install the server and client dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copy the rest of the application code
COPY . .

# Build the React frontend
RUN cd client && npm run build

# Stage 2: Production environment
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Copy only the built client and server files from the build stage
COPY --from=build /app/server ./server
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/package*.json ./

# Install only production dependencies (optional, but faster/smaller if we move node_modules)
# For simplicity, we just reuse the server node_modules from the build stage
# but since it's alpine, it's better to recreate it.
RUN cd server && npm install --omit=dev

# Set the environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Expose the server port
EXPOSE 5001

# Command to run the application
CMD ["node", "server/index.js"]
