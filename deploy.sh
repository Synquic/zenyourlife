#!/bin/bash

#######################################################################
# ZenYourLife Production Deployment Script
# Server: 72.60.214.160 (SSH Port: 2212)
# Domain: zenyourlife.be
#######################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="72.60.214.160"
SSH_PORT="2212"
SSH_USER="root"
SSH_PASS="JbNM7TNPMgv9387grrGS#Sj"
DEPLOY_PATH="/app/zenyourlife"
IMAGE_NAME="zenyourlife:latest"
ARCHIVE_NAME="zenyourlife-image.tar.gz"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}ZenYourLife Deployment Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Step 1: Install dependencies (if needed)
echo -e "${YELLOW}[1/7] Checking dependencies...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies OK${NC}"
echo ""

# Step 2: Backup server uploads (pull from server to local backup)
echo -e "${YELLOW}[2/7] Backing up server uploads to local...${NC}"
mkdir -p backend/uploads-backup
sshpass -p "${SSH_PASS}" rsync -avz -e "ssh -p ${SSH_PORT} -o StrictHostKeyChecking=no" \
    ${SSH_USER}@${SERVER_IP}:${DEPLOY_PATH}/backend/uploads/ backend/uploads-backup/ 2>/dev/null || echo "No server uploads to backup"
echo -e "${GREEN}✓ Server uploads backed up locally${NC}"
echo ""

# Step 3: Build Docker image
echo -e "${YELLOW}[3/7] Building Docker image for linux/amd64...${NC}"
docker build --platform linux/amd64 -t ${IMAGE_NAME} .
echo -e "${GREEN}✓ Image built successfully${NC}"
echo ""

# Step 4: Save and compress image
echo -e "${YELLOW}[4/7] Saving and compressing Docker image...${NC}"
docker save ${IMAGE_NAME} | gzip > ${ARCHIVE_NAME}
IMAGE_SIZE=$(du -h ${ARCHIVE_NAME} | cut -f1)
echo -e "${GREEN}✓ Image compressed (${IMAGE_SIZE})${NC}"
echo ""

# Step 5: Upload to server
echo -e "${YELLOW}[5/7] Uploading image to server...${NC}"
sshpass -p "${SSH_PASS}" rsync -avz --progress -e "ssh -p ${SSH_PORT} -o StrictHostKeyChecking=no" \
    ${ARCHIVE_NAME} ${SSH_USER}@${SERVER_IP}:${DEPLOY_PATH}/
echo -e "${GREEN}✓ Upload complete${NC}"
echo ""

# Step 6: Deploy on server
echo -e "${YELLOW}[6/7] Deploying on server...${NC}"
sshpass -p "${SSH_PASS}" ssh -p ${SSH_PORT} -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} << 'EOF'
cd /app/zenyourlife
echo "Loading Docker image..."
docker load < zenyourlife-image.tar.gz
echo "Stopping containers..."
docker-compose down
echo "Starting containers..."
docker-compose up -d
echo "Waiting for application to start..."
sleep 15
echo "Application logs:"
docker logs zenyourlife-app --tail 10
EOF
echo -e "${GREEN}✓ Deployment complete${NC}"
echo ""

# Step 7: Verify deployment
echo -e "${YELLOW}[7/7] Verifying deployment...${NC}"
sleep 5
if curl -s -o /dev/null -w "%{http_code}" https://zenyourlife.be/api/health | grep -q "200"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}⚠ Health check failed - check logs${NC}"
fi
echo ""

# Cleanup
echo -e "${YELLOW}Cleaning up local archive...${NC}"
rm -f ${ARCHIVE_NAME}
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Summary${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Frontend:    ${GREEN}https://zenyourlife.be${NC}"
echo -e "Admin Panel: ${GREEN}https://zenyourlife.be/admin${NC}"
echo -e "API:         ${GREEN}https://zenyourlife.be/api${NC}"
echo -e "Health:      ${GREEN}https://zenyourlife.be/api/health${NC}"
echo ""
echo -e "Admin Credentials:"
echo -e "  Email:    ${YELLOW}admin@zenyourlife.be${NC}"
echo -e "  Password: ${YELLOW}ZenYourLife@Admin2026!${NC}"
echo ""
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
