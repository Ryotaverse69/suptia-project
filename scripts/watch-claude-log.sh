#!/bin/bash
# Claude Code 応答完了監視スクリプト（ログファイル監視版）
# ログファイルの更新が止まったら通知

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOTIFIER="$SCRIPT_DIR/notify.sh"

# 設定
CHECK_INTERVAL=2        # チェック間隔（秒）
STABLE_DURATION=5       # ログ更新が止まってから通知までの時間（秒）

# 色とアイコン
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# ログファイルを検索
find_claude_log() {
    # 最新のClaude VSCode.logを検索
    find "$HOME/Library/Application Support/Code/logs" \
        -name "Claude VSCode.log" \
        -type f \
        2>/dev/null | \
        while read -r file; do
            # 各ファイルの最終更新時刻を出力
            echo "$(stat -f "%m" "$file" 2>/dev/null) $file"
        done | \
        sort -rn | \
        head -1 | \
        cut -d' ' -f2-
}

# Claude Codeプロセスを検索
find_claude_process() {
    ps aux | grep -i "anthropic.claude-code" | grep -v grep | awk '{print $2}' | head -1
}

echo -e "${GREEN}🤖 Claude Code 応答完了監視を開始します（ログファイル監視版）${NC}"

LAST_PROCESSING=""
LOW_ACTIVITY_START=""

while true; do
    # Claude Codeプロセスを確認
    CLAUDE_PID=$(find_claude_process)

    if [ -z "$CLAUDE_PID" ]; then
        echo -e "${RED}⚠️  Claude Codeプロセスが見つかりません${NC}"
        sleep $CHECK_INTERVAL
        continue
    fi

    # ログファイルを検索
    LOG_FILE=$(find_claude_log)

    if [ -z "$LOG_FILE" ] || [ ! -f "$LOG_FILE" ]; then
        echo -e "${RED}⚠️  Claude Codeログファイルが見つかりません${NC}"
        sleep $CHECK_INTERVAL
        continue
    fi

    # ログファイルの最終更新時刻を取得（Unix timestamp）
    LAST_MODIFIED=$(stat -f "%m" "$LOG_FILE" 2>/dev/null)
    CURRENT_TIME=$(date +%s)
    TIME_SINCE_UPDATE=$((CURRENT_TIME - LAST_MODIFIED))

    # ログが最近更新されたか確認
    if [ "$TIME_SINCE_UPDATE" -lt 3 ]; then
        # 処理中
        if [ "$LAST_PROCESSING" != "true" ]; then
            echo -e "${YELLOW}⚡ Claude Code が処理中です... （ログ更新中）${NC}"
            LAST_PROCESSING="true"
            LOW_ACTIVITY_START=""
        fi
    else
        # アイドル状態（ログ更新が止まった）
        if [ "$LAST_PROCESSING" == "true" ]; then
            echo -e "${BLUE}📉 ログ更新が停止しました （${TIME_SINCE_UPDATE}秒間更新なし）${NC}"
            LAST_PROCESSING=""
            LOW_ACTIVITY_START=$(date +%s)
        fi

        # アイドル状態の継続時間をチェック
        if [ -n "$LOW_ACTIVITY_START" ]; then
            CURRENT_TIME=$(date +%s)
            IDLE_DURATION=$((CURRENT_TIME - LOW_ACTIVITY_START))

            if [ "$IDLE_DURATION" -ge "$STABLE_DURATION" ]; then
                echo -e "${GREEN}✅ Claude Code の応答が完了しました！${NC}"

                # 通知を送信
                if command -v terminal-notifier &> /dev/null; then
                    terminal-notifier \
                        -title "🤖 Claude Code" \
                        -subtitle "応答完了" \
                        -message "応答が完了しました！ご確認ください。" \
                        -sound "Tink" \
                        -group "claude-work"
                fi

                LOW_ACTIVITY_START=""
            fi
        fi
    fi

    sleep $CHECK_INTERVAL
done
