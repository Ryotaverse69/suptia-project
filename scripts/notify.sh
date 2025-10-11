#!/bin/bash

# 簡単に使える通知ラッパー関数

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOTIFIER="$SCRIPT_DIR/notify-work-status.sh"

# 使い方表示
show_usage() {
  cat << 'EOF'
📱 Claude Code 作業通知ツール

使い方:
  ./scripts/notify.sh <通知タイプ> <メッセージ> [詳細]

通知タイプ:
  done        ✅ 作業完了
  approval    🔐 権限承認待ち
  ask         ❓ Yes/No選択待ち
  error       ❌ エラー発生
  info        ℹ️  お知らせ

例:
  # 作業完了を通知
  ./scripts/notify.sh done "トリバゴ風UIの実装完了"

  # 権限承認待ちを通知
  ./scripts/notify.sh approval "git pushの実行権限が必要です"

  # 選択待ちを通知
  ./scripts/notify.sh ask "この変更をコミットしますか？"

  # エラーを通知
  ./scripts/notify.sh error "ビルドに失敗しました"
EOF
}

# 引数チェック
if [ $# -lt 2 ] && [ "$1" != "--help" ] && [ "$1" != "-h" ]; then
  show_usage
  exit 1
fi

# ヘルプ表示
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  show_usage
  exit 0
fi

# 通知タイプの変換
case "$1" in
  "done"|"complete"|"finished")
    TYPE="completed"
    ;;
  "approval"|"permit"|"auth")
    TYPE="approval"
    ;;
  "ask"|"choice"|"select"|"yn")
    TYPE="choice"
    ;;
  "error"|"fail"|"failed")
    TYPE="error"
    ;;
  "info"|"notify")
    TYPE="info"
    ;;
  *)
    echo "❌ 未知の通知タイプ: $1"
    echo ""
    show_usage
    exit 1
    ;;
esac

# 通知実行
"$NOTIFIER" "$TYPE" "$2" "$3"
