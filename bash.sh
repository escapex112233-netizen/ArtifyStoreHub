#!/bin/bash
cd /storage/emulated/0/ArtifyStoreHub/backend || exit
MSG=${1:-"Update from Termux"}
git add .
git commit -m "$MSG"
git push origin main
