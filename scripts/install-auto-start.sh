#!/bin/bash

# Claude Code監視をmacOSログイン時に自動起動する設定スクリプト

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLIST_NAME="com.suptia.claude-watcher"
PLIST_FILE="$HOME/Library/LaunchAgents/${PLIST_NAME}.plist"

# 色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Claude Code 監視 - 自動起動設定${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 使い方
show_usage() {
  cat << EOF
使い方:
  ./scripts/install-auto-start.sh [コマンド]

コマンド:
  install   - 自動起動を有効化
  uninstall - 自動起動を無効化
  status    - 自動起動の状態を確認

例:
  # 自動起動を有効化
  ./scripts/install-auto-start.sh install

  # 自動起動を無効化
  ./scripts/install-auto-start.sh uninstall
EOF
}

# 自動起動をインストール
install_auto_start() {
  echo -e "${YELLOW}📝 LaunchAgent plistファイルを作成します...${NC}"

  # LaunchAgentsディレクトリを作成
  mkdir -p "$HOME/Library/LaunchAgents"

  # plistファイルを作成
  cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>

    <key>ProgramArguments</key>
    <array>
        <string>${SCRIPT_DIR}/start-claude-watcher.sh</string>
        <string>start</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <false/>

    <key>WorkingDirectory</key>
    <string>${PROJECT_DIR}</string>

    <key>StandardOutPath</key>
    <string>/tmp/claude-watcher.log</string>

    <key>StandardErrorPath</key>
    <string>/tmp/claude-watcher.error.log</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
EOF

  echo -e "${GREEN}✅ plistファイルを作成しました${NC}"
  echo -e "   場所: ${PLIST_FILE}"
  echo ""

  # 既存のLaunchAgentをアンロード（存在する場合）
  if launchctl list | grep -q "${PLIST_NAME}"; then
    echo -e "${YELLOW}⏹️  既存のLaunchAgentをアンロードします...${NC}"
    launchctl unload "$PLIST_FILE" 2>/dev/null
  fi

  # LaunchAgentをロード
  echo -e "${YELLOW}🚀 LaunchAgentをロードします...${NC}"
  launchctl load "$PLIST_FILE"

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 自動起動の設定が完了しました！${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}次回のmacOSログイン時から自動的に監視が開始されます${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "今すぐ監視を開始する場合:"
    echo -e "  ${GREEN}./scripts/start-claude-watcher.sh start${NC}"
    echo ""
    echo -e "状態確認:"
    echo -e "  ${GREEN}./scripts/start-claude-watcher.sh status${NC}"
    echo ""
    echo -e "自動起動を無効化する場合:"
    echo -e "  ${GREEN}./scripts/install-auto-start.sh uninstall${NC}"
  else
    echo -e "${RED}❌ LaunchAgentのロードに失敗しました${NC}"
    echo -e "詳細: /tmp/claude-watcher.error.log"
    exit 1
  fi
}

# 自動起動をアンインストール
uninstall_auto_start() {
  if [ ! -f "$PLIST_FILE" ]; then
    echo -e "${YELLOW}⚠️  自動起動は設定されていません${NC}"
    exit 0
  fi

  echo -e "${YELLOW}⏹️  自動起動を無効化します...${NC}"

  # LaunchAgentをアンロード
  launchctl unload "$PLIST_FILE" 2>/dev/null

  # plistファイルを削除
  rm -f "$PLIST_FILE"

  echo -e "${GREEN}✅ 自動起動を無効化しました${NC}"
  echo ""
  echo -e "現在実行中の監視を停止する場合:"
  echo -e "  ${GREEN}./scripts/start-claude-watcher.sh stop${NC}"
}

# 自動起動の状態確認
check_status() {
  echo -e "${BLUE}📊 自動起動の状態:${NC}"
  echo ""

  if [ -f "$PLIST_FILE" ]; then
    echo -e "${GREEN}✅ 自動起動が設定されています${NC}"
    echo -e "   plistファイル: ${PLIST_FILE}"
    echo ""

    # LaunchAgentが実行中か確認
    if launchctl list | grep -q "${PLIST_NAME}"; then
      echo -e "${GREEN}✅ LaunchAgentが読み込まれています${NC}"
      echo ""

      # プロセス状態を表示
      launchctl list | grep "${PLIST_NAME}"
    else
      echo -e "${YELLOW}⚠️  LaunchAgentが読み込まれていません${NC}"
      echo ""
      echo -e "再度読み込むには:"
      echo -e "  ${GREEN}launchctl load ${PLIST_FILE}${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  自動起動は設定されていません${NC}"
    echo ""
    echo -e "自動起動を有効化するには:"
    echo -e "  ${GREEN}./scripts/install-auto-start.sh install${NC}"
  fi

  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}現在の監視プロセスの状態:${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""

  "$SCRIPT_DIR/start-claude-watcher.sh" status
}

# メイン処理
case "${1:-}" in
  "install")
    install_auto_start
    ;;
  "uninstall")
    uninstall_auto_start
    ;;
  "status")
    check_status
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
