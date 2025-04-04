#!/bin/bash

# Define paths
CODE_PUBLIC_PATH="./code/public"
PUBLIC_PATH="./public"
BACKUP_PATH="/etc/dokploy/applications/dev-prakriti-api-f7uofd/public_backup"

# Step 0: Wait for the pulled files to be replaced (optional, if needed)
# You can add a delay or a check to ensure the pulled files are ready
echo "Waiting for pulled files to be replaced..."
sleep 5  # Adjust the delay as needed

# Step 1: Create a backup of the existing public folder
if [ -d "$PUBLIC_PATH" ]; then
  mkdir -p "$(dirname "$BACKUP_PATH")"
  cp -r "$PUBLIC_PATH" "$BACKUP_PATH"
  echo "Created backup of public folder at: $BACKUP_PATH"
fi

# Step 2: Ensure the public folder exists
if [ ! -d "$PUBLIC_PATH" ]; then
  mkdir -p "$PUBLIC_PATH"
  echo "Created public folder: $PUBLIC_PATH"
fi

# Step 3: Copy new files into the existing public folder without removing it
cp -r "$CODE_PUBLIC_PATH/"* "$PUBLIC_PATH/"
echo "Copied new files to $PUBLIC_PATH"
