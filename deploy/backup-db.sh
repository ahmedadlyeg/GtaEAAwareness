#!/usr/bin/env bash
# Nightly SQLite backup for the EA Awareness Hub.
# Uses sqlite3's online .backup so it is safe while the server is running.
# Schedule with cron (as the eahub user):
#   crontab -e
#   0 2 * * *  /home/eahub/app/deploy/backup-db.sh >> /home/eahub/backups/backup.log 2>&1
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/app}"
DB="$APP_DIR/server/data/ea-hub.db"
DEST="${DEST:-$HOME/backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$DEST"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$DEST/ea-hub-$STAMP.db"

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "sqlite3 CLI not found — install with: sudo apt install -y sqlite3" >&2
  exit 1
fi

sqlite3 "$DB" ".backup '$OUT'"
gzip -f "$OUT"
echo "$(date -Is) backed up -> $OUT.gz"

# Prune old backups
find "$DEST" -name 'ea-hub-*.db.gz' -mtime +"$KEEP_DAYS" -delete
