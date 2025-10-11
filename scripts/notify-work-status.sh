#!/bin/bash

# Claude Code 作業状態通知スクリプト
# 作業完了、権限承認待ち、Yes/No選択待ちを通知

# 通知タイプ
# 1. completed - 作業完了
# 2. approval - 権限承認待ち
# 3. choice - Yes/No選択待ち

NOTIFICATION_TYPE="${1:-completed}"
MESSAGE="${2:-作業が完了しました}"
DETAIL="${3:-}"

# 通知を送信
send_notification() {
  local title="$1"
  local message="$2"
  local sound="$3"
  local icon="$4"

  # 音を鳴らす
  afplay "/System/Library/Sounds/${sound}.aiff" 2>/dev/null &

  # terminal-notifierで通知（バックグラウンド）
  if command -v terminal-notifier &> /dev/null; then
    terminal-notifier \
      -title "🤖 Claude Code" \
      -subtitle "$title" \
      -message "$message" \
      -sound "$sound" \
      -group "claude-work" \
      -sender "com.apple.Terminal" \
      -activate "com.apple.Terminal" &
  fi

  # osascriptでバナー通知（フォアグラウンド）
  osascript -e "display notification \"$message\" with title \"🤖 Claude Code\" subtitle \"$title\" sound name \"$sound\"" &

  # 視覚的なアラート（1秒だけ表示）
  (
    osascript -e "display alert \"$title\" message \"$message\" as informational giving up after 1" &
  ) 2>/dev/null
}

# 通知タイプに応じた処理
case "$NOTIFICATION_TYPE" in
  "completed")
    # ✅ 作業完了通知
    send_notification \
      "✅ 作業完了" \
      "$MESSAGE${DETAIL:+ - $DETAIL}" \
      "Glass" \
      "✅"
    ;;

  "approval")
    # 🔐 権限承認待ち通知
    send_notification \
      "🔐 承認が必要です" \
      "$MESSAGE${DETAIL:+ - $DETAIL}" \
      "Basso" \
      "🔐"

    # 追加で音を鳴らして注意喚起
    osascript -e 'beep 2'
    ;;

  "choice")
    # ❓ Yes/No選択待ち通知
    send_notification \
      "❓ 選択を待っています" \
      "$MESSAGE${DETAIL:+ - $DETAIL}" \
      "Ping" \
      "❓"

    # 選択を促すダイアログを表示（オプション）
    if [ "$4" = "--dialog" ]; then
      osascript -e "display dialog \"$MESSAGE\" buttons {\"確認\"} default button 1 with icon note"
    fi
    ;;

  "error")
    # ❌ エラー通知
    send_notification \
      "❌ エラー発生" \
      "$MESSAGE${DETAIL:+ - $DETAIL}" \
      "Sosumi" \
      "❌"
    ;;

  "info")
    # ℹ️ 情報通知
    send_notification \
      "ℹ️ お知らせ" \
      "$MESSAGE${DETAIL:+ - $DETAIL}" \
      "Submarine" \
      "ℹ️"
    ;;

  *)
    echo "未知の通知タイプ: $NOTIFICATION_TYPE"
    echo "使い方: $0 <completed|approval|choice|error|info> <メッセージ> [詳細]"
    exit 1
    ;;
esac

echo "[$(date '+%H:%M:%S')] 通知送信: $NOTIFICATION_TYPE - $MESSAGE"
