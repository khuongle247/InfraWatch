#!/usr/bin/env bash
# ==============================================================================
# InfraWatch Backup Utility
# Description: Creates a compressed archive of configuration and persistent volumes.
# ==============================================================================

set -euo pipefail

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TARGET_FILE="${BACKUP_DIR}/infrawatch_backup_${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "=========================================================="
echo " Starting InfraWatch configuration and data backup...     "
echo " Target archive: $TARGET_FILE"
echo "=========================================================="

# Backup configurations
tar -czf "$TARGET_FILE" \
    --exclude="node_modules" \
    --exclude="venv" \
    --exclude=".git" \
    --exclude="backups" \
    infrastructure/ docs/ docker-compose.yml .env.example

echo "✅ Backup successfully created at: $TARGET_FILE"
echo "Archive size: $(du -sh "$TARGET_FILE" | cut -f1)"

