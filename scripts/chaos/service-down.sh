#!/usr/bin/env bash
# ==============================================================================
# Chaos Test: Container Service Outage Simulation
# Description: Stops a targeted Docker container to trigger ServiceDown alert.
# ==============================================================================

set -uo pipefail

CONTAINER_NAME=${1:-infrawatch-backend}
DOWNTIME=${2:-45} # Thời gian dừng tạm thời: 45 giây

echo "=================================================================="
echo "⚠️  CẢNH BÁO AN TOÀN (CHAOS SIMULATION: SERVICE OUTAGE)"
echo "Kịch bản này sẽ dừng container [$CONTAINER_NAME] trong $DOWNTIME giây."
echo "Mục đích: Đánh giá khả năng phát hiện dịch vụ DOWN của Prometheus."
echo "Container sẽ tự động được khởi động lại sau thời gian chỉ định."
echo "=================================================================="

if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Error: Container '$CONTAINER_NAME' không tồn tại trên hệ thống."
    exit 1
fi

read -p "Xác nhận dừng container? (y/N): " -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Đã hủy kịch bản bởi người dùng."
    exit 0
fi

restore_service() {
    echo ""
    echo "🔄 Đang khởi động lại container [$CONTAINER_NAME]..."
    docker start "$CONTAINER_NAME" > /dev/null || true
    echo "✅ Container [$CONTAINER_NAME] đã hoạt động trở lại."
}

trap restore_service EXIT INT TERM

echo "🛑 Đang dừng container [$CONTAINER_NAME]..."
docker stop "$CONTAINER_NAME" > /dev/null

echo "⏳ Container đang dừng. Đợi $DOWNTIME giây (kiểm tra Telegram Alert)..."
sleep "$DOWNTIME"

echo "Hết thời gian thử nghiệm, chuẩn bị khôi phục dịch vụ..."

