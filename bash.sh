#!/bin/bash
cd
cd 'ArtifyStoreHub-backend (2)' || exit
MSG=${1:-"Update from Termux"}
git add .
git commit -m "$MSG"
git push origin main
