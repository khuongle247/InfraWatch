#!/usr/bin/env bash
# ==============================================================================
# InfraWatch Environment Setup Script
# Description: Validates system requirements and prepares initial config files.
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " [InfraWatch] Starting Environment Initialization Check "
echo "=========================================================="

# 1. Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not available in PATH."
    echo "👉 Please install Docker Engine: https://docs.docker.com/engine/install/"
    exit 1
else
    echo "✅ Docker Engine found: $(docker --version)"
fi

# 2. Check Docker Compose
if docker compose version &> /dev/null; then
    echo "✅ Docker Compose plugin found: $(docker compose version)"
elif command -v docker-compose &> /dev/null; then
    echo "✅ Standalone docker-compose found: $(docker-compose --version)"
else
    echo "❌ Error: Docker Compose is not installed."
    echo "👉 Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# 3. Prepare .env file from .env.example
if [ ! -f .env ]; then
    echo "ℹ️  No .env file detected. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update secrets and tokens if required."
else
    echo "✅ .env file already exists."
fi

# 4. Prepare alertmanager.yml from alertmanager.yml.example
ALERTMANAGER_CFG="infrastructure/alertmanager/alertmanager.yml"
ALERTMANAGER_EX="infrastructure/alertmanager/alertmanager.yml.example"

if [ ! -f "$ALERTMANAGER_CFG" ] && [ -f "$ALERTMANAGER_EX" ]; then
    echo "ℹ️  Creating initial Alertmanager configuration from template..."
    cp "$ALERTMANAGER_EX" "$ALERTMANAGER_CFG"
    echo "✅ Created $ALERTMANAGER_CFG (Remember to update Telegram credentials)."
fi

echo ""
echo "=========================================================="
echo "🎉 InfraWatch setup verification completed successfully."
echo "You can now run: docker compose up -d"
echo "=========================================================="
