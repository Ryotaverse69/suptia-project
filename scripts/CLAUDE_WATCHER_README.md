# 🤖 Claude Code 応答完了監視ツール

## 概要

Claude Codeの応答完了を自動検知して通知を送るツールです。

**仕組み:**

- Claude Codeのログファイル更新時刻を監視
- 応答生成中はログファイルが頻繁に更新される
- 応答完了後はログファイルの更新が止まる
- ログ更新が止まって5秒経過したら「応答完了」と判定して通知
- CPU使用率よりも正確で誤検知が少ない方式

---

## 使い方

### 監視を開始

```bash
./scripts/start-claude-watcher.sh start
```

**出力例:**

```
🚀 Claude Code 応答完了監視を開始します
✅ 監視を開始しました (PID: 12345)
ログファイル: ./scripts/.claude-watcher.log

停止するには: ./scripts/start-claude-watcher.sh stop
```

### 状態確認

```bash
./scripts/start-claude-watcher.sh status
```

**出力例:**

```
✅ 監視は実行中です
PID: 12345
ログファイル: ./scripts/.claude-watcher.log

最新のログ:
🤖 Claude Code 応答完了監視を開始します（ログファイル監視版）
⚡ Claude Code が処理中です... （ログ更新中）
📉 ログ更新が停止しました （3秒間更新なし）
✅ Claude Code の応答が完了しました！
```

### 監視を停止

```bash
./scripts/start-claude-watcher.sh stop
```

### ログをリアルタイム表示

```bash
./scripts/start-claude-watcher.sh logs
```

### 再起動

```bash
./scripts/start-claude-watcher.sh restart
```

---

## 通知の例

応答完了時、以下の通知が表示されます：

```
🤖 Claude Code
✅ 応答完了
Claude Codeが指示待ち状態になりました
```

**サウンド:** Glass（macOSシステムサウンド）

---

## 自動起動

### VSCodeのワークスペース設定で自動起動

`.vscode/settings.json` に以下を追加：

```json
{
  "terminal.integrated.automationProfile.osx": {
    "path": "/bin/bash",
    "args": [
      "-c",
      "cd ${workspaceFolder} && ./scripts/start-claude-watcher.sh start"
    ]
  }
}
```

### macOSのログイン時に自動起動

LaunchAgentを作成：

```bash
# plistファイルを作成
cat > ~/Library/LaunchAgents/com.suptia.claude-watcher.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.suptia.claude-watcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/ryota/VScode/suptia-project/scripts/start-claude-watcher.sh</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>StandardOutPath</key>
    <string>/tmp/claude-watcher.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/claude-watcher.error.log</string>
</dict>
</plist>
EOF

# LaunchAgentを有効化
launchctl load ~/Library/LaunchAgents/com.suptia.claude-watcher.plist
```

---

## カスタマイズ

`scripts/watch-claude-log.sh` の設定を編集：

```bash
# 設定
CHECK_INTERVAL=2        # チェック間隔（秒）デフォルト: 2秒
STABLE_DURATION=5       # ログ更新停止から通知までの時間（秒）デフォルト: 5秒
```

**カスタマイズ例:**

```bash
# より早く検知（3秒でlog更新停止と判定）
STABLE_DURATION=3

# より慎重に検知（8秒待ってから通知）
STABLE_DURATION=8
```

**推奨値:**

- 短い応答の場合: `STABLE_DURATION=3`
- 通常: `STABLE_DURATION=5`（デフォルト）
- 長い応答の場合: `STABLE_DURATION=8`

---

## トラブルシューティング

### 通知が来ない

**原因1: Claude Codeプロセスが検出できない**

```bash
# Claude Codeプロセスを手動確認
ps aux | grep "anthropic.claude-code" | grep -v grep
```

プロセスが見つからない場合は、Claude CodeのプロセスIDパターンが異なる可能性があります。

**原因2: ログファイルが見つからない**

ログファイルのパスを確認：

```bash
# Claude Codeのログファイルを検索
find ~/Library/Application\ Support/Code/logs -name "Claude VSCode.log" -type f
```

### 監視が停止している

```bash
# 状態確認
./scripts/start-claude-watcher.sh status

# ログ確認
./scripts/start-claude-watcher.sh logs

# 再起動
./scripts/start-claude-watcher.sh restart
```

### 誤検知が多い（作業完了前に通知が来る）

`STABLE_DURATION`を長くする：

```bash
# watch-claude-log.sh の設定を変更
STABLE_DURATION=8   # 5秒 → 8秒（より慎重に判定）
```

**ログファイル監視版の利点:**

- CPU使用率よりも正確
- システム負荷の影響を受けない
- 誤検知が大幅に減少

---

## 仕組みの詳細

### フロー図

```
1. Claude Codeプロセスを検出
   ↓
2. ログファイルを自動検索
   ↓
3. ログファイルの最終更新時刻を2秒ごとにチェック
   ↓
4. 最近更新された（3秒以内） → 処理中
   ↓
5. 更新が止まった → アイドル状態
   ↓
6. アイドル状態が5秒継続
   ↓
7. 応答完了と判定
   ↓
8. 通知を送信
```

### ログファイル更新の例

```
時刻     最終更新からの経過時間   状態
00:00    0秒                    処理中（応答生成中）
00:02    1秒                    処理中（ログ更新中）
00:04    1秒                    処理中（ログ更新中）
00:06    3秒                    アイドル開始（ログ更新停止）
00:08    5秒                    アイドル（2秒経過）
00:10    7秒                    アイドル（4秒経過）
00:11    8秒                    アイドル（5秒経過） ← 通知送信！
```

---

## ライセンス

MIT License

---

## 更新履歴

- **2025-10-25**: 初版作成

---

**作成日**: 2025-10-25
