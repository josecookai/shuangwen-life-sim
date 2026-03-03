#!/bin/bash
# 将events同步到public/events/供Vite serve
mkdir -p public/events
cp -r events/*.json public/events/ 2>/dev/null || echo "No events to copy yet"
echo "Events synced to public/events/"
