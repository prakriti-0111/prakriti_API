# Use Node.js official image
FROM node:18

# Install dependencies required by Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the existing public folder from the host system if it exists
COPY --chown=node:node ./public /app/public

# Copy the rest of the app, excluding the public folder
COPY . ./
RUN rm -rf ./public && mv /app/public ./public

# Expose the app's port
EXPOSE 3000

# Start the server using nodemon
CMD ["npx", "nodemon", "server.js"]
