#!/bin/bash

# Claude Code Hook通知スクリプト
# 使い方: ./hook-notify.sh <type> <message>

TYPE="${1:-info}"
MESSAGE="${2:-通知}"
LOG_FILE="/tmp/claude-hooks.log"

# ログに記録
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Hook: $TYPE - $MESSAGE" >> "$LOG_FILE"

# 通知設定
case "$TYPE" in
  "start")
    TITLE="🤖 Claude Code"
    SOUND="Submarine"
    ;;
  "approval")
    TITLE="🔐 Claude Code"
    SOUND="Basso"
    # ビープ音も鳴らす
    osascript -e 'beep 2' &
    ;;
  "done")
    TITLE="✅ Claude Code"
    SOUND="Glass"
    ;;
  *)
    TITLE="Claude Code"
    SOUND="default"
    ;;
esac

# 音を鳴らす（確実に）
afplay "/System/Library/Sounds/${SOUND}.aiff" 2>/dev/null &

# terminal-notifierで通知
if command -v terminal-notifier &> /dev/null; then
  terminal-notifier \
    -title "$TITLE" \
    -message "$MESSAGE" \
    -sound "$SOUND" \
    -group "claude-code-hooks" 2>/dev/null &
fi

# osascriptでも通知（バックアップ）
osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" sound name \"$SOUND\"" 2>/dev/null &

echo "通知送信: $TITLE - $MESSAGE" >> "$LOG_FILE"
