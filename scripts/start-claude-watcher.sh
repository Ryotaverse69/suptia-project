#!/bin/bash

# Claude Code応答完了監視を起動するスクリプト
# バックグラウンドで監視を開始します

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WATCHER="$SCRIPT_DIR/watch-claude-log.sh"
PID_FILE="$SCRIPT_DIR/.claude-watcher.pid"
LOG_FILE="$SCRIPT_DIR/.claude-watcher.log"

# 色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 使い方
show_usage() {
  cat << EOF
📱 Claude Code 応答完了監視ツール

使い方:
  ./scripts/start-claude-watcher.sh [コマンド]

コマンド:
  start   - 監視を開始（バックグラウンド）
  stop    - 監視を停止
  status  - 監視の状態を確認
  logs    - ログを表示

例:
  # 監視を開始
  ./scripts/start-claude-watcher.sh start

  # 監視を停止
  ./scripts/start-claude-watcher.sh stop

  # 状態確認
  ./scripts/start-claude-watcher.sh status
EOF
}

# 監視プロセスが実行中かチェック
is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid=$(cat "$PID_FILE")
    if ps -p "$pid" > /dev/null 2>&1; then
      return 0
    else
      # PIDファイルは存在するがプロセスは死んでいる
      rm -f "$PID_FILE"
      return 1
    fi
  fi
  return 1
}

# 監視を開始
start_watcher() {
  if is_running; then
    echo -e "${YELLOW}⚠️  監視はすでに実行中です${NC}"
    local pid=$(cat "$PID_FILE")
    echo -e "PID: $pid"
    return 1
  fi

  echo -e "${GREEN}🚀 Claude Code 応答完了監視を開始します${NC}"

  # バックグラウンドで監視スクリプトを実行
  nohup "$WATCHER" > "$LOG_FILE" 2>&1 &
  local pid=$!

  # PIDを保存
  echo "$pid" > "$PID_FILE"

  echo -e "${GREEN}✅ 監視を開始しました (PID: $pid)${NC}"
  echo -e "${YELLOW}ログファイル: $LOG_FILE${NC}"
  echo ""
  echo -e "停止するには: ${GREEN}./scripts/start-claude-watcher.sh stop${NC}"
}

# 監視を停止
stop_watcher() {
  if ! is_running; then
    echo -e "${YELLOW}⚠️  監視は実行されていません${NC}"
    return 1
  fi

  local pid=$(cat "$PID_FILE")
  echo -e "${YELLOW}⏹️  監視を停止します (PID: $pid)${NC}"

  # プロセスを終了
  kill "$pid" 2>/dev/null

  # PIDファイルを削除
  rm -f "$PID_FILE"

  echo -e "${GREEN}✅ 監視を停止しました${NC}"
}

# 状態確認
check_status() {
  if is_running; then
    local pid=$(cat "$PID_FILE")
    echo -e "${GREEN}✅ 監視は実行中です${NC}"
    echo -e "PID: $pid"
    echo -e "ログファイル: $LOG_FILE"

    # ログの最後の数行を表示
    echo ""
    echo -e "${YELLOW}最新のログ:${NC}"
    tail -n 5 "$LOG_FILE" 2>/dev/null || echo "ログファイルがありません"
  else
    echo -e "${RED}❌ 監視は実行されていません${NC}"
    echo ""
    echo -e "開始するには: ${GREEN}./scripts/start-claude-watcher.sh start${NC}"
  fi
}

# ログ表示
show_logs() {
  if [ -f "$LOG_FILE" ]; then
    echo -e "${BLUE}📋 Claude Code 監視ログ:${NC}"
    echo ""
    tail -f "$LOG_FILE"
  else
    echo -e "${YELLOW}⚠️  ログファイルが見つかりません${NC}"
  fi
}

# メイン処理
case "${1:-}" in
  "start")
    start_watcher
    ;;
  "stop")
    stop_watcher
    ;;
  "status")
    check_status
    ;;
  "logs")
    show_logs
    ;;
  "restart")
    stop_watcher
    sleep 1
    start_watcher
    ;;
  "--help"|"-h"|"")
    show_usage
    ;;
  *)
    echo -e "${RED}❌ 未知のコマンド: $1${NC}"
    echo ""
    show_usage
    exit 1
    ;;
esac
