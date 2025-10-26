#!/bin/bash

# Claude Code応答完了監視スクリプト
# Claude Codeのプロセスを監視して、応答完了時に通知を送る

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOTIFIER="$SCRIPT_DIR/notify.sh"

# 設定
CHECK_INTERVAL=2        # チェック間隔（秒）
CPU_THRESHOLD=3.0       # CPU使用率の閾値（%）- 低いほど慎重に判定
STABLE_DURATION=8       # 安定状態の継続時間（秒）- 長いほど誤検知を防ぐ

# 色とアイコン
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Claude Code 応答完了監視を開始します${NC}"
echo -e "${YELLOW}CPU使用率が${CPU_THRESHOLD}%以下になったら通知します${NC}"
echo ""

# 状態管理
WAS_BUSY=false
LOW_CPU_START=0

# Claude Codeプロセスを取得
get_claude_process() {
  # VSCode拡張機能版のClaude Codeプロセスを検出
  ps aux | grep "anthropic.claude-code" | grep -v grep | head -1
}

# CPU使用率を取得
get_cpu_usage() {
  local process_line="$1"
  if [ -z "$process_line" ]; then
    echo "0"
    return
  fi

  # psの出力から3列目（CPU使用率）を取得
  echo "$process_line" | awk '{print $3}'
}

# メイン監視ループ
while true; do
  # Claude Codeプロセスを取得
  PROCESS=$(get_claude_process)

  if [ -z "$PROCESS" ]; then
    # プロセスが見つからない
    if [ "$WAS_BUSY" = true ]; then
      echo -e "${RED}⚠️  Claude Codeプロセスが見つかりません${NC}"
    fi
    WAS_BUSY=false
    sleep $CHECK_INTERVAL
    continue
  fi

  # CPU使用率を取得
  CPU=$(get_cpu_usage "$PROCESS")

  # 現在時刻
  CURRENT_TIME=$(date +%s)

  # CPU使用率をチェック
  if (( $(echo "$CPU > $CPU_THRESHOLD" | bc -l) )); then
    # 高CPU = 処理中
    if [ "$WAS_BUSY" = false ]; then
      echo -e "${YELLOW}⚡ Claude Code が処理中です... (CPU: ${CPU}%)${NC}"
      WAS_BUSY=true
    fi
    LOW_CPU_START=0
  else
    # 低CPU = アイドル状態
    if [ "$WAS_BUSY" = true ]; then
      # 初めて低CPUになった
      if [ $LOW_CPU_START -eq 0 ]; then
        LOW_CPU_START=$CURRENT_TIME
        echo -e "${BLUE}📉 CPU使用率が低下しました (CPU: ${CPU}%)${NC}"
      fi

      # 低CPU状態が一定時間継続したか確認
      DURATION=$((CURRENT_TIME - LOW_CPU_START))
      if [ $DURATION -ge $STABLE_DURATION ]; then
        # 応答完了と判定
        echo -e "${GREEN}✅ Claude Code の応答が完了しました！${NC}"

        # 通知を送信
        if [ -x "$NOTIFIER" ]; then
          "$NOTIFIER" done "応答完了" "Claude Codeが指示待ち状態になりました"
        else
          # 通知スクリプトがない場合は直接osascriptで通知
          osascript -e 'display notification "Claude Codeが指示待ち状態になりました" with title "🤖 Claude Code" subtitle "✅ 応答完了" sound name "Glass"'
        fi

        # 状態リセット
        WAS_BUSY=false
        LOW_CPU_START=0

        echo -e "${BLUE}監視を継続します...${NC}"
        echo ""
      fi
    fi
  fi

  sleep $CHECK_INTERVAL
done
