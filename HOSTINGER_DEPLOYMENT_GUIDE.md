# ZenYourLife - Hostinger VPS Deployment Guide

Complete guide for deploying ZenYourLife to Hostinger VPS with Docker, PM2, auto-restart, and monitoring.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Initial Setup (One-Time)](#initial-setup-one-time)
5. [Deployment Process](#deployment-process)
6. [Auto-Restart System](#auto-restart-system)
7. [Monitoring & Logs](#monitoring--logs)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Deploy/Update Application
```bash
# From your local machine
bash deploy-hostinger.sh
```

That's it! The deploy script handles everything automatically.

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Hostinger VPS (Ubuntu)                    │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Nginx (Port 80/443)                   │  │
│  │     - Reverse Proxy                                    │  │
│  │     - SSL Termination (Let's Encrypt)                 │  │
│  │     - Rate Limiting                                    │  │
│  └────────────┬─────────────────────────────────────────┘  │
│               │                                              │
│  ┌────────────▼─────────────────────────────────────────┐  │
│  │         ZenYourLife Container (Port 8000)            │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  PM2 Process Manager                         │    │  │
│  │  │  - Auto-restart on failure                   │    │  │
│  │  │  - Cluster mode                              │    │  │
│  │  │  - Memory monitoring                         │    │  │
│  │  └──────────────┬───────────────────────────────┘    │  │
│  │                 │                                      │  │
│  │  ┌──────────────▼───────────────────────────────┐    │  │
│  │  │  Express Backend (server.js)                 │    │  │
│  │  │  - API endpoints                             │    │  │
│  │  │  - Serves frontend build (/)                 │    │  │
│  │  │  - Serves admin build (/admin)               │    │  │
│  │  │  - Serves uploads (/uploads)                 │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  │                                                        │  │
│  │  Volumes:                                             │  │
│  │  - /app/backend/uploads (persistent storage)         │  │
│  │  - /app/logs (PM2 & monitor logs)                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Auto-Restart System                       │  │
│  │                                                        │  │
│  │  1. Docker Service (auto-start on boot)              │  │
│  │  2. Systemd Service (zenyourlife.service)            │  │
│  │  3. Container Restart Policy (always)                │  │
│  │  4. PM2 Auto-Restart (inside container)              │  │
│  │  5. Autoheal Container                               │  │
│  │  6. Health Monitor Timer (every 2 min)               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Request
    ↓
Nginx (443/SSL)
    ↓
Rate Limiting Check
    ↓
┌─────────────────────────────────────┐
│ Route to correct path:              │
│ - / → Frontend (React/Vite build)  │
│ - /admin → Admin Panel build       │
│ - /api → Backend API               │
│ - /uploads → Static files          │
└─────────────────────────────────────┘
    ↓
Docker Container (Port 8000)
    ↓
PM2 → Express Server
    ↓
Response
```

---

## Prerequisites

### Local Machine
- Docker installed
- `sshpass` installed:
  - macOS: `brew install sshpass`
  - Linux: `apt-get install sshpass` or `yum install sshpass`
- Bash shell

### Hostinger VPS (Already Configured)
- ✅ Ubuntu OS
- ✅ Docker installed
- ✅ Nginx installed
- ✅ SSL certificate configured (Let's Encrypt)
- ✅ Firewall configured (UFW - ports 22, 80, 443)

---

## Initial Setup (One-Time)

Since your VPS is already configured with Nginx, SSL, and Docker, you only need to verify the Nginx configuration.

### 1. Update Nginx Configuration (if needed)

SSH into your VPS:
```bash
ssh root@72.60.214.160
# Password: Zenyourlife@123
```

Upload and apply the Nginx configuration:
```bash
# On local machine
scp -o StrictHostKeyChecking=no nginx-zenyourlife.conf root@72.60.214.160:/etc/nginx/sites-available/zenyourlife

# On VPS
ssh root@72.60.214.160 << 'EOF'
# Create symlink
ln -sf /etc/nginx/sites-available/zenyourlife /etc/nginx/sites-enabled/

# Remove default config if exists
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
EOF
```

### 2. Verify SSL Certificate

```bash
ssh root@72.60.214.160 "certbot certificates"
```

If SSL is not configured or needs renewal:
```bash
ssh root@72.60.214.160 << 'EOF'
certbot --nginx \
  -d zen.yourlife \
  -d www.zen.yourlife \
  --email admin@zen.yourlife \
  --agree-tos \
  --no-eff-email
EOF
```

### 3. Create Environment File

Create a `.env` file in the `backend/` directory with your production settings:

```bash
# backend/.env
NODE_ENV=production
SERVER_ENV=production
PORT=8000

MONGODB_URI=mongodb://your-mongodb-connection-string
FRONTEND_URL=https://zen.yourlife
ADMIN_URL=https://zen.yourlife/admin

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Other settings...
```

---

## Deployment Process

### Automated Deployment

The `deploy-hostinger.sh` script automates the entire deployment:

```bash
bash deploy-hostinger.sh
```

### What the Script Does

1. **Pre-deployment Checks**
   - ✅ Validates SSH connection
   - ✅ Checks Docker installation
   - ✅ Verifies VPS connectivity

2. **Build Phase (Local)**
   - Builds frontend (Vite → static files)
   - Builds admin panel (Vite → static files)
   - Creates Docker image with all components
   - Saves image as compressed tarball

3. **Upload Phase**
   - Uploads Docker image to VPS
   - Uploads docker-compose.yml
   - Uploads .env file
   - Creates necessary directories

4. **Deployment Phase (VPS)**
   - Loads Docker image
   - Stops old containers
   - Starts new containers with docker-compose
   - Verifies deployment

5. **Auto-Restart Setup**
   - Configures systemd service
   - Sets up health monitoring
   - Configures autoheal container

### Manual Deployment Steps

If you prefer manual control:

```bash
# 1. Build image locally
docker build --platform linux/amd64 -t zenyourlife:latest .

# 2. Save and compress image
docker save zenyourlife:latest | gzip > zenyourlife-image.tar.gz

# 3. Upload to VPS
sshpass -p "Zenyourlife@123" scp zenyourlife-image.tar.gz root@72.60.214.160:/app/zenyourlife/
sshpass -p "Zenyourlife@123" scp docker-compose.yml root@72.60.214.160:/app/zenyourlife/
sshpass -p "Zenyourlife@123" scp backend/.env root@72.60.214.160:/app/zenyourlife/.env

# 4. Deploy on VPS
ssh root@72.60.214.160 << 'EOF'
cd /app/zenyourlife
docker load < zenyourlife-image.tar.gz
docker-compose down
docker-compose up -d
EOF
```

---

## Auto-Restart System

### Six Layers of Protection

#### 1. Docker Service Auto-Start
Docker automatically starts on boot.

```bash
# Check status
ssh root@72.60.214.160 "systemctl is-enabled docker"
```

#### 2. Systemd Application Service
The `zenyourlife.service` ensures containers start after Docker.

```bash
# Check status
ssh root@72.60.214.160 "systemctl status zenyourlife.service"

# Restart service
ssh root@72.60.214.160 "systemctl restart zenyourlife.service"
```

#### 3. Container Restart Policy
Docker automatically restarts containers on failure.

```yaml
# In docker-compose.yml
restart: always
```

#### 4. PM2 Process Manager (Inside Container)
PM2 monitors the Node.js process and restarts it if it crashes.

```bash
# View PM2 status
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 status"

# View PM2 logs
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 logs"
```

#### 5. Autoheal Container
Monitors container health and restarts unhealthy containers.

```bash
# Check autoheal logs
ssh root@72.60.214.160 "docker logs autoheal --tail 50"
```

#### 6. Custom Health Monitor
Runs every 2 minutes to verify the application is responding.

```bash
# Check monitor logs
ssh root@72.60.214.160 "tail -f /var/log/zenyourlife/monitor.log"

# Manually run monitor
ssh root@72.60.214.160 "/usr/local/bin/monitor-zenyourlife.sh"
```

### Testing Auto-Restart

```bash
# Test 1: Reboot VPS
ssh root@72.60.214.160 "reboot"
# Wait 2-3 minutes, then check:
ssh root@72.60.214.160 "docker ps"

# Test 2: Kill PM2 process
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 kill"
# Wait 10 seconds, should auto-restart:
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 status"

# Test 3: Stop container
ssh root@72.60.214.160 "docker stop zenyourlife-app"
# Wait 30 seconds, should auto-restart:
ssh root@72.60.214.160 "docker ps | grep zenyourlife-app"

# Test 4: Health check failure
ssh root@72.60.214.160 "docker exec zenyourlife-app pkill -f server.js"
# Wait 2 minutes, monitor should detect and restart:
ssh root@72.60.214.160 "tail -n 20 /var/log/zenyourlife/monitor.log"
```

---

## Monitoring & Logs

### Container Logs

```bash
# All containers
ssh root@72.60.214.160 "cd /app/zenyourlife && docker-compose logs -f"

# Specific container
ssh root@72.60.214.160 "docker logs -f zenyourlife-app"

# Last 100 lines
ssh root@72.60.214.160 "docker logs --tail 100 zenyourlife-app"

# Since last hour
ssh root@72.60.214.160 "docker logs --since 1h zenyourlife-app"
```

### PM2 Logs (Inside Container)

```bash
# View PM2 logs
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 logs --lines 50"

# PM2 status
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 status"

# PM2 monitoring dashboard
ssh root@72.60.214.160 "docker exec -it zenyourlife-app pm2 monit"
```

### Health Monitor Logs

```bash
# Real-time monitoring
ssh root@72.60.214.160 "tail -f /var/log/zenyourlife/monitor.log"

# Last 50 entries
ssh root@72.60.214.160 "tail -n 50 /var/log/zenyourlife/monitor.log"

# Check timer status
ssh root@72.60.214.160 "systemctl status zenyourlife-monitor.timer"
```

### Nginx Logs

```bash
# Access logs
ssh root@72.60.214.160 "tail -f /var/log/nginx/access.log"

# Error logs
ssh root@72.60.214.160 "tail -f /var/log/nginx/error.log"

# Filter by IP
ssh root@72.60.214.160 "grep '123.45.67.89' /var/log/nginx/access.log"
```

### Container Stats

```bash
# Resource usage
ssh root@72.60.214.160 "docker stats --no-stream"

# Continuous monitoring
ssh root@72.60.214.160 "docker stats"

# Disk usage
ssh root@72.60.214.160 "docker system df"
```

### Application Health

```bash
# Health check endpoint
curl https://zen.yourlife/api/health

# Or from VPS
ssh root@72.60.214.160 "curl http://localhost:8000/api/health"
```

---

## Troubleshooting

### Issue: Deployment Script Fails

**Check SSH connection**:
```bash
sshpass -p "Zenyourlife@123" ssh root@72.60.214.160 "echo 'Connected'"
```

**Check disk space**:
```bash
ssh root@72.60.214.160 "df -h"
```

**Clean up old Docker images**:
```bash
ssh root@72.60.214.160 "docker system prune -a -f"
```

### Issue: Container Keeps Restarting

**Check container logs**:
```bash
ssh root@72.60.214.160 "docker logs --tail 100 zenyourlife-app"
```

**Common causes**:
- Missing or incorrect environment variables
- MongoDB connection failure
- Port already in use
- PM2 configuration error

**Check PM2 status**:
```bash
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 status"
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 logs --err --lines 50"
```

### Issue: 502 Bad Gateway (Nginx)

**Causes**:
- Backend container not running
- Backend not listening on port 8000
- Nginx can't reach Docker container

**Fix**:
```bash
# Check if container is running
ssh root@72.60.214.160 "docker ps | grep zenyourlife-app"

# Check port binding
ssh root@72.60.214.160 "docker port zenyourlife-app"

# Test backend directly
ssh root@72.60.214.160 "curl http://localhost:8000/api/health"

# Restart Nginx
ssh root@72.60.214.160 "systemctl restart nginx"
```

### Issue: Frontend/Admin Not Loading

**Check if builds exist in container**:
```bash
ssh root@72.60.214.160 "docker exec zenyourlife-app ls -la /app/frontend/dist"
ssh root@72.60.214.160 "docker exec zenyourlife-app ls -la /app/admin/dist"
```

**Verify SERVER_ENV is set to production**:
```bash
ssh root@72.60.214.160 "docker exec zenyourlife-app env | grep SERVER_ENV"
```

**Check Express static file serving**:
```bash
ssh root@72.60.214.160 "docker exec zenyourlife-app cat /app/backend/server.js | grep -A 5 'SERVER_ENV'"
```

### Issue: SSL Certificate Expired

**Check expiration**:
```bash
ssh root@72.60.214.160 "certbot certificates"
```

**Renew certificate**:
```bash
ssh root@72.60.214.160 "certbot renew --force-renewal"
ssh root@72.60.214.160 "systemctl reload nginx"
```

### Issue: High Memory Usage

**Check container memory**:
```bash
ssh root@72.60.214.160 "docker stats --no-stream"
```

**Check PM2 memory**:
```bash
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 status"
```

**Restart container**:
```bash
ssh root@72.60.214.160 "docker restart zenyourlife-app"
```

**Update PM2 memory limit** (edit ecosystem.config.js):
```javascript
max_memory_restart: '2G'  // Increase if needed
```

### Issue: Uploads Not Persisting

**Check volume mount**:
```bash
ssh root@72.60.214.160 "docker inspect zenyourlife-app | grep -A 10 Mounts"
```

**Verify uploads directory**:
```bash
ssh root@72.60.214.160 "ls -la /app/zenyourlife/backend/uploads"
```

**Check permissions**:
```bash
ssh root@72.60.214.160 "docker exec zenyourlife-app ls -la /app/backend/uploads"
```

---

## Useful Commands Reference

### Quick Actions

```bash
# Deploy/Update
bash deploy-hostinger.sh

# View logs
ssh root@72.60.214.160 "docker logs -f zenyourlife-app"

# Restart container
ssh root@72.60.214.160 "docker restart zenyourlife-app"

# Stop all
ssh root@72.60.214.160 "cd /app/zenyourlife && docker-compose down"

# Start all
ssh root@72.60.214.160 "cd /app/zenyourlife && docker-compose up -d"

# Container shell
ssh root@72.60.214.160 "docker exec -it zenyourlife-app sh"

# PM2 status
ssh root@72.60.214.160 "docker exec zenyourlife-app pm2 status"

# System stats
ssh root@72.60.214.160 "docker stats --no-stream"
```

### Maintenance

```bash
# Clean up old images
ssh root@72.60.214.160 "docker system prune -a"

# Update SSL certificate
ssh root@72.60.214.160 "certbot renew && systemctl reload nginx"

# Restart all services
ssh root@72.60.214.160 "systemctl restart zenyourlife.service"

# Check service status
ssh root@72.60.214.160 "systemctl status zenyourlife.service"

# View monitor timer
ssh root@72.60.214.160 "systemctl list-timers zenyourlife-monitor.timer"
```

---

## Environment Variables

Make sure your [backend/.env](/Users/parvjain/vscode/zenyourlife/backend/.env) file includes all required variables:

```bash
# Core
NODE_ENV=production
SERVER_ENV=production
PORT=8000

# Database
MONGODB_URI=your-mongodb-connection-string

# URLs
FRONTEND_URL=https://zen.yourlife
ADMIN_URL=https://zen.yourlife/admin

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=your-phone

# Add any other environment variables your app needs
```

---

## Architecture Decisions

### Why Single Container?
- **Simpler deployment**: One container to manage
- **Shared resources**: Frontend/admin served by backend
- **Faster startup**: No inter-container communication needed
- **Lower cost**: Minimal resource overhead

### Why PM2 Inside Container?
- **Process management**: Auto-restart on crashes
- **Cluster mode**: Use multiple CPU cores
- **Memory monitoring**: Auto-restart on memory leaks
- **Log management**: Centralized logging
- **Zero-downtime**: Graceful reloads

### Why Build Locally?
- **Faster builds**: Use your powerful local machine
- **ARM64 → AMD64**: Build for VPS architecture
- **Consistent builds**: Same environment every time
- **No VPS overhead**: Save VPS CPU/memory

### Why Multiple Auto-Restart Layers?
- **Defense in depth**: Multiple failure points covered
- **Different scenarios**: Each layer handles specific failures
- **Maximum uptime**: Minimal downtime on failures

---

## Security Checklist

- ✅ SSL/TLS encryption (HTTPS)
- ✅ Rate limiting (Nginx)
- ✅ Security headers (Nginx)
- ✅ Environment variables for secrets
- ✅ Firewall configured (UFW)
- ✅ Regular SSL renewal (Certbot)
- ✅ Non-root user in container (Node.js user)
- ✅ Limited file upload size (100MB)
- ✅ Deny access to hidden files (Nginx)

---

## Performance Optimization

- ✅ Gzip compression (Nginx)
- ✅ Static file caching (1 year)
- ✅ PM2 cluster mode (multiple processes)
- ✅ HTTP/2 enabled (Nginx)
- ✅ Keepalive connections (Nginx)
- ✅ Log rotation (Docker + PM2)

---

## Support

For issues or questions:
1. Check logs: `ssh root@72.60.214.160 "docker logs zenyourlife-app --tail 100"`
2. Check monitoring: `ssh root@72.60.214.160 "tail -n 50 /var/log/zenyourlife/monitor.log"`
3. Verify health: `curl https://zen.yourlife/api/health`

---

## License

This deployment configuration is for ZenYourLife production deployment on Hostinger VPS.
