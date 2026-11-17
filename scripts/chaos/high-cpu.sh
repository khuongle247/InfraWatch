#!/usr/bin/env bash
# ==============================================================================
# Chaos Test: High CPU Stress Simulation
# Description: Generates synthetic CPU load to trigger Prometheus CPU alert.
# ==============================================================================

set -uo pipefail

DURATION=${1:-60} # Thời gian chạy mặc định: 60 giây
CORES=${2:-2}     # Số luồng CPU gây tải mặc định: 2

echo "=================================================================="
echo "⚠️  CẢNH BÁO AN TOÀN (CHAOS SIMULATION: HIGH CPU LOAD)"
echo "Kịch bản này sẽ tạo tải CPU cao trên $CORES lõi trong $DURATION giây."
echo "Hệ thống có thể bị chậm phản hồi trong thời gian này."
echo "Bấm Ctrl+C bất cứ lúc nào để dừng ngay lập tức."
echo "=================================================================="

read -p "Xác nhận tiếp tục? (y/N): " -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Đã hủy kịch bản bởi người dùng."
    exit 0
fi

PIDS=()

cleanup() {
    echo ""
    echo "🛑 Đang dọn dẹp và dừng các tiến trình gây tải CPU..."
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill -9 "$pid" 2>/dev/null || true
        fi
    done
    echo "✅ Hệ thống đã trở lại trạng thái bình thường."
}

trap cleanup EXIT INT TERM

echo "🚀 Đang kích hoạt tải CPU trong $DURATION giây..."
for ((i=0; i<CORES; i++)); do
    # Vòng lặp tính toán vô hạn trên tiến trình con
    ( while : ; do : ; done ) &
    PIDS+=($!)
done

echo "Tiến trình chạy với PIDs: ${PIDS[*]}"
echo "Đang đợi $DURATION giây trước khi tự động giải phóng..."
sleep "$DURATION"

echo "⏳ Đã hết thời gian mô phỏng."
