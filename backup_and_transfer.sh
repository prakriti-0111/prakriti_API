#!/bin/bash

# Define paths
CODE_PUBLIC_PATH="./code/public"
PUBLIC_BACKUP_PATH="./public_backup"
PUBLIC_PATH="./public"

# Step 1: Create the public_backup folder if it doesn't exist
if [ ! -d "$PUBLIC_BACKUP_PATH" ]; then
  mkdir -p "$PUBLIC_BACKUP_PATH"
  echo "Created backup folder: $PUBLIC_BACKUP_PATH"
fi

# Step 2: Copy all files from code/public to public_backup
cp -r "$CODE_PUBLIC_PATH/"* "$PUBLIC_BACKUP_PATH/"
echo "Copied files from $CODE_PUBLIC_PATH to $PUBLIC_BACKUP_PATH"

# Step 3: Copy new files into the existing public folder without removing it
if [ ! -d "$PUBLIC_PATH" ]; then
  mkdir -p "$PUBLIC_PATH"
  echo "Created public folder: $PUBLIC_PATH"
fi

cp -r "$CODE_PUBLIC_PATH/"* "$PUBLIC_PATH/"
echo "Copied new files to $PUBLIC_PATH"
