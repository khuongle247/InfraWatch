#!/usr/bin/env bash
# ==============================================================================
# Chaos Test: Disk Space Pressure Simulation
# Description: Creates a temporary large file to evaluate DiskSpaceLow alert.
# ==============================================================================

set -uo pipefail

SIZE_MB=${1:-1024} # Dung lượng file mẫu mặc định: 1024 MB (1GB)
TEMP_FILE="/tmp/infrawatch_chaos_disk_fill.tmp"

echo "=================================================================="
echo "⚠️  CẢNH BÁO AN TOÀN (CHAOS SIMULATION: DISK PRESSURE)"
echo "Kịch bản này sẽ tạo một tệp tạm dung lượng $SIZE_MB MB tại $TEMP_FILE"
echo "Mục đích: Đẩy tỷ lệ sử dụng đĩa cứng để kích hoạt cảnh báo Prometheus."
echo "Tệp sẽ tự động được xóa khi kết thúc hoặc khi bấm Ctrl+C."
echo "=================================================================="

read -p "Xác nhận tiếp tục? (y/N): " -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Đã hủy kịch bản bởi người dùng."
    exit 0
fi

cleanup() {
    echo ""
    echo "🛑 Đang dọn dẹp file tạm $TEMP_FILE..."
    if [ -f "$TEMP_FILE" ]; then
        rm -f "$TEMP_FILE"
    fi
    echo "✅ Dung lượng ổ cứng đã được giải phóng."
}

trap cleanup EXIT INT TERM

echo "🚀 Đang tạo tệp $SIZE_MB MB..."
if command -v fallocate &> /dev/null; then
    fallocate -l "${SIZE_MB}M" "$TEMP_FILE"
else
    dd if=/dev/zero of="$TEMP_FILE" bs=1M count="$SIZE_MB" status=progress
fi

echo "✅ Tệp đã tạo thành công. Kiểm tra dung lượng hiện tại:"
df -h /tmp

echo "Giữ trạng thái đầy ổ trong 90 giây để Prometheus cào metrics..."
sleep 90

echo "⏳ Đã hết thời gian mô phỏng."
