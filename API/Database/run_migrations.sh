#!/usr/bin/env bash
# run_migrations.sh
# Runs all migration files (V*.sql) then all seed files (S*.sql)
# against the target MySQL instance.
#
# Usage (standalone):
#   DB_HOST=localhost DB_PORT=3306 DB_USER=commerce DB_PASSWORD=changeme DB_NAME=rx \
#   ./run_migrations.sh
#
# Used automatically as a Docker entrypoint-initdb.d script when placed in
# /docker-entrypoint-initdb.d/ — MySQL will call it during first-run init.
# In that context the root user is used and environment vars come from
# MYSQL_ROOT_PASSWORD / MYSQL_DATABASE set in docker-compose.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="${SCRIPT_DIR}/migrations"
SEEDS_DIR="${SCRIPT_DIR}/seeds"

# --- Connection settings (override via environment) -----------------------
HOST="${DB_HOST:-127.0.0.1}"
PORT="${DB_PORT:-3306}"
USER="${DB_USER:-commerce}"
PASSWORD="${DB_PASSWORD:-changeme}"
DATABASE="${DB_NAME:-rx}"
# --------------------------------------------------------------------------

mysql_exec() {
    mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASSWORD" "$DATABASE" "$@"
}

echo "==> Running migrations..."
for f in "$MIGRATIONS_DIR"/V*.sql; do
    echo "    Applying: $(basename "$f")"
    mysql_exec < "$f"
done

echo "==> Running seeds..."
for f in "$SEEDS_DIR"/S*.sql; do
    echo "    Applying: $(basename "$f")"
    mysql_exec < "$f"
done

echo "==> Done."
