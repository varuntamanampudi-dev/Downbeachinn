#!/bin/bash
# Push updates from your local machine to the live server.
#
# Usage:   ./scripts/deploy.sh <server-ip> <path-to-pem>
# Example: ./scripts/deploy.sh 54.123.45.67 ./downbeach.pem
#
# Get the IP with:   cd infra && terraform output instance_ip
# Get the PEM with:  cd infra && terraform output -raw private_key > ../downbeach.pem && chmod 400 ../downbeach.pem

set -e

SERVER_IP=$1
PEM_FILE=$2

if [ -z "$SERVER_IP" ] || [ -z "$PEM_FILE" ]; then
  echo "Usage: $0 <server-ip> <path-to-pem>"
  echo "  server-ip — from: cd infra && terraform output instance_ip"
  echo "  pem-file  — downbeach.pem (see above)"
  exit 1
fi

echo "Deploying to $SERVER_IP..."

ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no ubuntu@"$SERVER_IP" << 'ENDSSH'
set -e
cd /home/ubuntu/DownBeach

echo "--- pulling latest code ---"
git pull

cd web

echo "--- installing dependencies ---"
npm ci --omit=dev

echo "--- building ---"
npm run build

echo "--- restarting app ---"
pm2 restart downbeach

echo "--- reloading nginx ---"
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "Deploy complete!"
pm2 status downbeach
ENDSSH

echo ""
echo "Done. Site: http://$SERVER_IP"
