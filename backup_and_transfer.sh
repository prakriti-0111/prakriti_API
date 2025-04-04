#!/bin/bash

# Define paths
CODE_PUBLIC_PATH="./code/public"
PUBLIC_PATH="./public"

# Step 1: Ensure the public folder exists
if [ ! -d "$PUBLIC_PATH" ]; then
  mkdir -p "$PUBLIC_PATH"
  echo "Created public folder: $PUBLIC_PATH"
fi

# Step 2: Copy new files into the existing public folder without removing it
cp -r "$CODE_PUBLIC_PATH/"* "$PUBLIC_PATH/"
echo "Copied new files to $PUBLIC_PATH"
