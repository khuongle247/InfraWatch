#!/usr/bin/env bash
# ==============================================================================
# InfraWatch Restore Utility
# Description: Restores configuration files from an archive created by backup.sh.
# Usage: ./scripts/restore.sh <backup_file.tar.gz>
# ==============================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
    echo "❌ Usage: $0 <path_to_backup_archive.tar.gz>"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "=========================================================="
echo "⚠️  WARNING: Restoring will overwrite existing configuration files!"
echo "Target archive: $BACKUP_FILE"
echo "=========================================================="

read -p "Are you sure you want to proceed with restore? (y/N): " -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Aborted by user."
    exit 0
fi

tar -xzf "$BACKUP_FILE"
echo "✅ Configuration files restored successfully from $BACKUP_FILE"

