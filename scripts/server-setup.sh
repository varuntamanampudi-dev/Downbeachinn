#!/bin/bash
# Runs automatically on FIRST BOOT via Lightsail user_data.
# Terraform injects CLONE_URL and DOMAIN_NAME before uploading.
set -e
exec > /var/log/downbeach-setup.log 2>&1

echo "=== DownBeach Inn — server setup starting ==="

# ── Injected by Terraform ─────────────────────────────────────
CLONE_URL="${clone_url}"
DOMAIN_NAME="${domain_name}"

# ── 1. System packages ────────────────────────────────────────
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y git build-essential python3 curl nginx

echo "✓ System packages installed"

# ── 2. Node.js 20 via NodeSource ──────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo "✓ Node $(node -v) / npm $(npm -v)"

# ── 3. PM2 ────────────────────────────────────────────────────
npm install -g pm2
echo "✓ PM2 installed"

# ── 4. Clone repo ─────────────────────────────────────────────
cd /home/ubuntu
git clone "$CLONE_URL" DownBeach
chown -R ubuntu:ubuntu /home/ubuntu/DownBeach
echo "✓ Repo cloned"

# ── 5. Production environment file ───────────────────────────
cat > /home/ubuntu/DownBeach/web/.env.production << 'ENVFILE'
NODE_ENV=production
ENVFILE
chown ubuntu:ubuntu /home/ubuntu/DownBeach/web/.env.production
echo "✓ .env.production written"

# ── 6. Install deps, seed DB, build ──────────────────────────
sudo -u ubuntu bash -c "
  set -e
  cd /home/ubuntu/DownBeach/web
  npm ci --omit=dev
  npx tsx src/lib/db/seed.ts
  npm run build
  echo '✓ Build complete'
"

# ── 7. Start Next.js with PM2 ────────────────────────────────
sudo -u ubuntu bash -c "
  cd /home/ubuntu/DownBeach/web
  pm2 start npm --name downbeach -- start
  pm2 save
"

# Wire PM2 into systemd so it restarts on reboot
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
systemctl enable pm2-ubuntu
echo "✓ PM2 running and configured for auto-restart"

# ── 8. Nginx — reverse proxy 80 → 3000 ───────────────────────
# Determine server_name: domain if provided, otherwise use IP (will be
# replaced automatically once you point your domain at the static IP).
if [ -n "$DOMAIN_NAME" ]; then
  SERVER_NAME="$DOMAIN_NAME www.$DOMAIN_NAME"
else
  SERVER_NAME="_"   # catch-all — works with raw IP
fi

cat > /etc/nginx/sites-available/downbeach << NGINX
server {
    listen 80;
    server_name $SERVER_NAME;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Proxy to Next.js
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    # Next.js static assets — serve directly for performance
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Public folder
    location /images/ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public";
    }
}
NGINX

# Enable site, disable default
ln -sf /etc/nginx/sites-available/downbeach /etc/nginx/sites-enabled/downbeach
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx
systemctl enable nginx
echo "✓ Nginx running on port 80 → proxying to :3000"

# ── 9. (Optional) SSL with Let's Encrypt ─────────────────────
# Uncomment and run manually after your domain DNS is pointed here:
#
#   apt-get install -y certbot python3-certbot-nginx
#   certbot --nginx -d your-domain.com -d www.your-domain.com --non-interactive \
#     --agree-tos --email your@email.com --redirect
#   systemctl reload nginx

echo ""
echo "=== Setup complete ==="
echo "    Next.js  → http://127.0.0.1:3000  (internal)"
echo "    Public   → http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "    Logs     → pm2 logs downbeach"
echo "    DB       → /home/ubuntu/DownBeach/web/local.db"
