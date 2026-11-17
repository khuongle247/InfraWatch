#!/usr/bin/env bash
# ==============================================================================
# InfraWatch Health Check Utility
# Description: Verifies connectivity and status of all core monitoring services.
# ==============================================================================

set -uo pipefail

echo "=========================================================="
echo "          InfraWatch Services Health Inspection           "
echo "=========================================================="

SERVICES=(
    "Prometheus:http://localhost:9090/-/healthy"
    "Alertmanager:http://localhost:9093/-/healthy"
    "Node-Exporter:http://localhost:9100"
    "cAdvisor:http://localhost:8080/healthz"
    "Grafana:http://localhost:3001/api/health"
    "Backend-API:http://localhost:8000/health"
    "Frontend-Web:http://localhost:3000"
)

TOTAL=0
SUCCESS=0

for item in "${SERVICES[@]}"; do
    NAME="${item%%:*}"
    URL="${item#*:}"
    TOTAL=$((TOTAL + 1))

    echo -n "Checking [$NAME] at $URL ... "
    
    if curl -s --max-time 3 -o /dev/null -w "%{http_code}" "$URL" | grep -qE "200|302|401"; then
        echo "✅ OK"
        SUCCESS=$((SUCCESS + 1))
    else
        echo "❌ FAILED (unreachable or non-healthy response)"
    fi
done

echo "----------------------------------------------------------"
echo "Result: $SUCCESS/$TOTAL services reachable."
if [ "$SUCCESS" -eq "$TOTAL" ]; then
    echo "🎉 All InfraWatch services are operational!"
    exit 0
else
    echo "⚠️  Some services are down or initializing. Inspect logs using: docker compose logs"
    exit 1
fi

