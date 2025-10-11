#!/bin/bash

# Suptia デプロイ通知スクリプト
# GitHub ActionsとVercelデプロイの状態を監視し、通知を送信

PROJECT_DIR="/Users/ryota/VScode/suptia-project"
LOG_FILE="$PROJECT_DIR/scripts/.deploy-monitor.log"
STATE_FILE="$PROJECT_DIR/scripts/.last-deploy-state"

# ログ関数
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 通知を送信する関数
send_notification() {
  local title="$1"
  local message="$2"
  local sound="${3:-default}"

  log "通知送信: $title - $message"

  # terminal-notifierを使用
  if command -v terminal-notifier &> /dev/null; then
    terminal-notifier \
      -title "🚀 Suptia Deployment" \
      -subtitle "$title" \
      -message "$message" \
      -sound "$sound" \
      -group "suptia-deploy"
  fi

  # osascriptでもバックアップ通知
  osascript -e "display notification \"$message\" with title \"Suptia Deployment\" subtitle \"$title\" sound name \"$sound\""
}

# GitHub Actionsの状態を取得
get_github_status() {
  cd "$PROJECT_DIR" || exit 1

  # --jqを使ってクリーンなJSON出力を取得
  local result
  result=$(gh run list --limit 1 --json status,conclusion,displayTitle --jq '.' 2>/dev/null)

  if [ $? -ne 0 ] || [ -z "$result" ]; then
    log "エラー: GitHub API呼び出し失敗"
    return 1
  fi

  echo "$result"
}

# 前回の状態を読み込み
load_last_state() {
  if [ -f "$STATE_FILE" ]; then
    cat "$STATE_FILE"
  else
    echo ""
  fi
}

# 状態を保存
save_state() {
  echo "$1" > "$STATE_FILE"
}

# メイン処理
main() {
  log "=== デプロイ監視開始 ==="

  # GitHub Actionsの状態を取得
  local current_status
  current_status=$(get_github_status)

  if [ -z "$current_status" ] || [ "$current_status" = "[]" ]; then
    log "GitHub Actionsのランが見つかりません"
    send_notification "監視エラー" "GitHub Actionsのデータを取得できませんでした" "Basso"
    return 1
  fi

  log "現在の状態: $current_status"

  # JSONをパース
  local status conclusion title
  status=$(echo "$current_status" | jq -r '.[0].status')
  conclusion=$(echo "$current_status" | jq -r '.[0].conclusion')
  title=$(echo "$current_status" | jq -r '.[0].displayTitle')

  # 前回の状態と比較
  local last_state
  last_state=$(load_last_state)
  local current_state="${status}:${conclusion}"

  log "前回: $last_state / 今回: $current_state"

  # 状態が変化した場合のみ通知
  if [ "$last_state" != "$current_state" ]; then
    case "$status" in
      "queued")
        send_notification "デプロイ待機中" "$title" "Submarine"
        ;;
      "in_progress")
        send_notification "デプロイ実行中" "$title" "Ping"
        ;;
      "completed")
        case "$conclusion" in
          "success")
            send_notification "✅ デプロイ成功！" "$title" "Glass"
            ;;
          "failure")
            send_notification "❌ デプロイ失敗" "$title" "Basso"
            ;;
          "cancelled")
            send_notification "⚠️ デプロイキャンセル" "$title" "Funk"
            ;;
          *)
            send_notification "デプロイ完了" "$title ($conclusion)" "default"
            ;;
        esac
        ;;
    esac

    # 状態を保存
    save_state "$current_state"
  else
    log "状態変化なし（通知スキップ）"
  fi

  log "=== 監視終了 ==="
}

# スクリプト実行
main "$@"
