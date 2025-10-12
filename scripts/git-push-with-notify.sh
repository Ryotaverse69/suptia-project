#!/bin/bash

# git pushを実行し、デプロイ監視と通知を行うラッパースクリプト

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_MONITOR="$PROJECT_DIR/scripts/notify-deploy.sh"
WORK_NOTIFIER="$PROJECT_DIR/scripts/notify.sh"

echo "📡 Git pushを実行します..."

# git pushを実行
git push "$@"
PUSH_EXIT_CODE=$?

# push失敗時
if [ $PUSH_EXIT_CODE -ne 0 ]; then
  "$WORK_NOTIFIER" error "Git push失敗" "エラーを確認してください" 2>/dev/null
  exit $PUSH_EXIT_CODE
fi

echo "✅ Git pushが完了しました"

# push成功時の通知
"$WORK_NOTIFIER" info "Git pushが完了しました" "デプロイを監視中..." 2>/dev/null &

# 5秒後に状態確認（GitHub Actionsが起動するのを待つ）
(
  sleep 5
  "$DEPLOY_MONITOR"
) &

# 30秒後に再度確認（ビルド中の可能性）
(
  sleep 30
  "$DEPLOY_MONITOR"
) &

# 90秒後に最終確認（デプロイ完了を確認）
(
  sleep 90
  "$DEPLOY_MONITOR"

  # デプロイ完了を通知
  if grep -q "success" "$PROJECT_DIR/scripts/.deploy-monitor.log" 2>/dev/null; then
    "$WORK_NOTIFIER" done "デプロイ完了" "本番環境に反映されました" 2>/dev/null
  elif grep -q "failure" "$PROJECT_DIR/scripts/.deploy-monitor.log" 2>/dev/null; then
    "$WORK_NOTIFIER" error "デプロイ失敗" "ログを確認してください" 2>/dev/null
  fi
) &

echo "🔔 バックグラウンドでデプロイを監視しています"
