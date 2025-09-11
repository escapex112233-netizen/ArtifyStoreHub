#!/bin/bash
# Termux autopush script for backend folder
# Usage: ./autopush.sh "Commit message"

# Change directory to backend
cd /storage/emulated/0/ArtifyStoreHub/backend || exit

# Commit message from argument or default
MSG=${1:-"Update from Termux"}

# Add all changes
git add .

# Commit changes
git commit -m "$MSG"

# Push to GitHub using PAT
git push -u origin main
