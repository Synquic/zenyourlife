#!/bin/bash

set -e

# ============================================
# Configuration
# ============================================
VPS_IP="72.60.214.160"
VPS_USER="root"
VPS_PASSWORD="Zenyourlife@123"
DOMAIN="zenyourlife.be"
APP_DIR="/app/zenyourlife"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# Helper Functions
# ============================================
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

ssh_exec() {
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "$1"
}

scp_upload() {
    # Use rsync with progress if available, otherwise scp
    if command -v rsync &> /dev/null; then
        sshpass -p "$VPS_PASSWORD" rsync -avz --progress -e "ssh -o StrictHostKeyChecking=no" "$1" "$VPS_USER@$VPS_IP:$2"
    else
        sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no "$1" "$VPS_USER@$VPS_IP:$2"
    fi
}

# ============================================
# Pre-deployment Checks
# ============================================
log "Starting deployment to Hostinger VPS..."

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    error "sshpass is not installed. Install it using: brew install sshpass (macOS) or apt-get install sshpass (Linux)"
fi

# Check if Docker is installed locally
if ! command -v docker &> /dev/null; then
    error "Docker is not installed locally"
fi

# Test SSH connection
log "Testing SSH connection to VPS..."
if ! ssh_exec "echo 'SSH connection successful'" &> /dev/null; then
    error "Cannot connect to VPS. Check IP, username, and password."
fi

log "✅ SSH connection successful"

# ============================================
# Build Docker Image Locally
# ============================================
log "Building Docker image for AMD64 architecture..."

# Build multi-arch image
docker build --platform linux/amd64 -t zenyourlife:latest . || error "Docker build failed"

log "✅ Docker image built successfully"

# Save Docker image
log "Saving Docker image to tarball..."
docker save zenyourlife:latest | gzip > zenyourlife-image.tar.gz || error "Failed to save Docker image"

IMAGE_SIZE=$(du -h zenyourlife-image.tar.gz | cut -f1)
log "✅ Image saved (Size: $IMAGE_SIZE)"

# ============================================
# Upload to VPS
# ============================================
log "Creating application directory on VPS..."
ssh_exec "mkdir -p $APP_DIR/logs $APP_DIR/backend/uploads" || error "Failed to create directories"

log "Uploading Docker image to VPS (this may take several minutes)..."
scp_upload "zenyourlife-image.tar.gz" "$APP_DIR/" || error "Failed to upload Docker image"

log "Uploading configuration files..."
scp_upload "docker-compose.yml" "$APP_DIR/" || error "Failed to upload docker-compose.yml"
scp_upload "backend/.env" "$APP_DIR/.env" || error "Failed to upload .env file"

log "✅ All files uploaded successfully"

# Clean up local tarball
rm zenyourlife-image.tar.gz
log "Cleaned up local tarball"

# ============================================
# Deploy on VPS
# ============================================
log "Loading Docker image on VPS..."
ssh_exec "cd $APP_DIR && docker load < zenyourlife-image.tar.gz" || error "Failed to load Docker image"

log "Stopping existing containers..."
ssh_exec "cd $APP_DIR && docker-compose down 2>/dev/null || true"

log "Starting containers with docker-compose..."
ssh_exec "cd $APP_DIR && docker-compose up -d" || error "Failed to start containers"

# Wait for containers to start
log "Waiting for containers to start..."
sleep 10

# Check container status
log "Checking container status..."
CONTAINER_STATUS=$(ssh_exec "cd $APP_DIR && docker-compose ps --format json" 2>/dev/null || echo "")

if echo "$CONTAINER_STATUS" | grep -q "zenyourlife-app"; then
    log "✅ Container is running"
else
    warn "Container status unclear, checking logs..."
    ssh_exec "cd $APP_DIR && docker-compose logs --tail 50"
fi

# ============================================
# Verify Deployment
# ============================================
log "Verifying deployment..."

# Check if backend is responding
HEALTH_CHECK=$(ssh_exec "curl -s http://localhost:5001/api/health || echo 'failed'")

if [ "$HEALTH_CHECK" != "failed" ]; then
    log "✅ Backend health check passed"
else
    warn "Backend health check failed. Checking logs..."
    ssh_exec "cd $APP_DIR && docker logs zenyourlife-app --tail 30"
fi

# ============================================
# Setup Auto-Restart System
# ============================================
log "Setting up auto-restart system..."

ssh_exec "cat > /etc/systemd/system/zenyourlife.service << 'EOF'
[Unit]
Description=ZenYourLife Docker Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF"

ssh_exec "systemctl daemon-reload"
ssh_exec "systemctl enable zenyourlife.service"
ssh_exec "systemctl start zenyourlife.service"

log "✅ Auto-restart service configured"

# ============================================
# Setup Health Monitoring
# ============================================
log "Setting up health monitoring..."

ssh_exec "mkdir -p /var/log/zenyourlife"

ssh_exec "cat > /usr/local/bin/monitor-zenyourlife.sh << 'EOF'
#!/bin/bash
LOG_FILE=\"/var/log/zenyourlife/monitor.log\"

log() {
    echo \"[\$(date +'%Y-%m-%d %H:%M:%S')] \$1\" >> \$LOG_FILE
}

# Check if container is running
if ! docker ps --format \"{{.Names}}\" | grep -q \"^zenyourlife-app\$\"; then
    log \"WARNING: zenyourlife-app not running. Restarting...\"
    cd $APP_DIR && docker compose up -d
else
    # Check if backend is healthy
    if ! curl -sf http://localhost:5001/api/health > /dev/null 2>&1; then
        log \"WARNING: Health check failed. Restarting container...\"
        docker restart zenyourlife-app
    else
        log \"INFO: All systems operational\"
    fi
fi
EOF"

ssh_exec "chmod +x /usr/local/bin/monitor-zenyourlife.sh"

# Create systemd timer for monitoring
ssh_exec "cat > /etc/systemd/system/zenyourlife-monitor.timer << 'EOF'
[Unit]
Description=ZenYourLife Health Monitor Timer

[Timer]
OnBootSec=2min
OnUnitActiveSec=2min

[Install]
WantedBy=timers.target
EOF"

ssh_exec "cat > /etc/systemd/system/zenyourlife-monitor.service << 'EOF'
[Unit]
Description=ZenYourLife Health Monitor

[Service]
Type=oneshot
ExecStart=/usr/local/bin/monitor-zenyourlife.sh
EOF"

ssh_exec "systemctl daemon-reload"
ssh_exec "systemctl enable zenyourlife-monitor.timer"
ssh_exec "systemctl start zenyourlife-monitor.timer"

log "✅ Health monitoring configured (runs every 2 minutes)"

# ============================================
# Display Summary
# ============================================
echo ""
echo "============================================"
log "🎉 Deployment Complete!"
echo "============================================"
echo ""
echo "Application URLs:"
echo "  Frontend:  https://$DOMAIN"
echo "  Admin:     https://$DOMAIN/admin"
echo "  API:       https://$DOMAIN/api"
echo ""
echo "Container Status:"
ssh_exec "cd $APP_DIR && docker compose ps"
echo ""
echo "Useful Commands:"
echo "  View logs:        ssh root@$VPS_IP 'cd $APP_DIR && docker compose logs -f'"
echo "  Restart:          ssh root@$VPS_IP 'cd $APP_DIR && docker compose restart'"
echo "  Monitor logs:     ssh root@$VPS_IP 'tail -f /var/log/zenyourlife/monitor.log'"
echo "  Container stats:  ssh root@$VPS_IP 'docker stats --no-stream'"
echo ""
log "Auto-restart layers configured:"
echo "  ✅ Docker service auto-start on boot"
echo "  ✅ Systemd service (zenyourlife.service)"
echo "  ✅ Container restart policy (always)"
echo "  ✅ Autoheal container watching"
echo "  ✅ Health monitor (every 2 minutes)"
echo ""
