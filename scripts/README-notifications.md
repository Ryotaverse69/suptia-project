# 📱 Claude Code 作業通知システム

## 概要

Claude Codeの作業状態をmacOS通知センターで受け取るシステムです。

## 3種類の通知

### 1. ✅ 作業完了通知

タスクやビルドが完了した時に送信されます。

```bash
./scripts/notify.sh done "トリバゴ風UIの実装完了"
./scripts/notify.sh done "ビルド完了" "所要時間: 45秒"
```

**サウンド**: Glass（爽やか）

---

### 2. 🔐 権限承認待ち通知

git pushやファイル削除など、ユーザーの承認が必要な操作で送信されます。

```bash
./scripts/notify.sh approval "git pushの実行権限が必要です"
./scripts/notify.sh approval "本番環境へのデプロイ承認待ち" "masterブランチに反映されます"
```

**サウンド**: Basso（警告音） + システムビープ2回
**特徴**: 緊急性が高いため、音が強調されます

---

### 3. ❓ Yes/No選択待ち通知

ユーザーの選択や入力を待っている時に送信されます。

```bash
./scripts/notify.sh ask "この変更をコミットしますか？"
./scripts/notify.sh ask "テストを実行しますか？" "28個のテストがあります"
```

**サウンド**: Ping（柔らかい）
**特徴**: 作業が一時停止していることを通知

---

## その他の通知

### ❌ エラー通知

```bash
./scripts/notify.sh error "ビルドに失敗しました"
./scripts/notify.sh error "テストが2件失敗" "詳細はログを確認してください"
```

**サウンド**: Sosumi（エラー音）

---

### ℹ️ 情報通知

```bash
./scripts/notify.sh info "デプロイを開始します"
./scripts/notify.sh info "Git pushが完了しました" "デプロイを監視中..."
```

**サウンド**: Submarine（控えめ）

---

## 自動通知

### Git push時の自動デプロイ監視

`.git/hooks/post-push`により、git push後に自動で以下の通知が送信されます：

1. **即座**: ℹ️ "Git pushが完了しました"
2. **5秒後**: GitHub Actionsの起動確認
3. **30秒後**: ビルド状態の確認
4. **90秒後**: デプロイ完了の確認
   - 成功時: ✅ "デプロイ完了"
   - 失敗時: ❌ "デプロイ失敗"

---

## コマンド一覧

```bash
# ヘルプを表示
./scripts/notify.sh --help

# 作業完了
./scripts/notify.sh done <メッセージ> [詳細]

# 権限承認待ち
./scripts/notify.sh approval <メッセージ> [詳細]

# Yes/No選択待ち
./scripts/notify.sh ask <メッセージ> [詳細]

# エラー
./scripts/notify.sh error <メッセージ> [詳細]

# 情報
./scripts/notify.sh info <メッセージ> [詳細]
```

---

## エイリアス（短縮形）

以下のエイリアスが使えます：

| 短縮形                          | 正式名      |
| ------------------------------- | ----------- |
| `done`, `complete`, `finished`  | `completed` |
| `approval`, `permit`, `auth`    | `approval`  |
| `ask`, `choice`, `select`, `yn` | `choice`    |
| `error`, `fail`, `failed`       | `error`     |
| `info`, `notify`                | `info`      |

---

## トラブルシューティング

### 通知が届かない

1. **macOSの通知権限を確認**:
   - システム設定 → 通知 → ターミナル → 「通知を許可」をON

2. **terminal-notifierのインストール確認**:

   ```bash
   which terminal-notifier
   # /opt/homebrew/bin/terminal-notifier
   ```

3. **手動テスト**:
   ```bash
   terminal-notifier -title "テスト" -message "通知テスト" -sound "Glass"
   ```

### 音が鳴らない

システム設定 → サウンド → 「通知音」の音量を確認してください。

---

## ログ

デプロイ監視のログは以下に保存されます：

```bash
cat scripts/.deploy-monitor.log
```

---

## 関連ファイル

- `scripts/notify.sh` - メインの通知コマンド
- `scripts/notify-work-status.sh` - 通知送信の実装
- `scripts/notify-deploy.sh` - デプロイ状態監視
- `.git/hooks/post-push` - Git push時の自動実行

---

**最終更新**: 2025-10-11
