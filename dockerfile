# Use Node.js official image
FROM node:18

# Backup the code/public directory as public_backup before cleanup
RUN mkdir -p /public_backup && [ -d /code/public ] && cp -r /code/public/* /public_backup || true

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

# Print the working directory
RUN pwd

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backup_and_transfer.sh script into the container
COPY backup_and_transfer.sh /app/backup_and_transfer.sh

# Ensure the script has execution permissions
RUN chmod +x /app/backup_and_transfer.sh

# Run the script before copying the rest of the app
RUN /bin/bash /app/backup_and_transfer.sh

# Copy the rest of the app
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the server after running the backup_and_transfer.sh script
CMD ["npx nodemon server.js"]