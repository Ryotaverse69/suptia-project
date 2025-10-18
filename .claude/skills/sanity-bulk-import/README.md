# Sanity一括インポートツール（MVP版）

Suptia用の成分記事JSONを安全にSanityへ一括インポートするツールです。

## 🎯 特徴

- ✅ **安全第一**: デフォルトでDry Runモード、バリデーション必須
- ✅ **自動バックアップ**: インポート前に自動でデータセットをバックアップ
- ✅ **差分検出**: 既存データとの差分を検出し、必要な変更のみ適用
- ✅ **リトライ機能**: 指数バックオフ付き自動リトライ（最大3回）
- ✅ **進捗表示**: リアルタイムで進捗を表示
- ✅ **詳細ログ**: 構造化JSONログで実行履歴を保存
- ✅ **ジョブロック**: 並行実行を防止

## 📦 インストール

```bash
cd .claude/skills/sanity-bulk-import
npm install
```

## ⚙️ 環境設定

### 1. 環境変数の設定

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要な値を設定：

```bash
# 必須
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# オプション
DRY_RUN=true
BATCH_SIZE=10
ARTICLE_DIR=../../..
```

### 2. Sanity APIトークンの取得

1. [Sanity管理画面](https://www.sanity.io/manage)にログイン
2. プロジェクトを選択
3. **API** → **Tokens** → **Add API token**
4. 権限は **Editor** を選択（最小権限）
5. トークンをコピーして `.env` に設定

⚠️ **セキュリティ注意**:

- トークンは絶対にGitにコミットしないこと
- 使用後は定期的にローテーションすること

## 🚀 使用方法

### 基本的な使い方

#### 1. Dry Run（推奨）

まずは**必ずDry Runで確認**してください：

```bash
npm run import:dry
```

または：

```bash
DRY_RUN=true npm run import
```

#### 2. バリデーション

Dry Runで以下を確認：

- ✅ 全ファイルのバリデーション合格
- ✅ 差分の内容が期待通り
- ✅ 作成/更新されるドキュメント数

#### 3. 本番実行

確認後、実際のインポートを実行：

```bash
DRY_RUN=false npm run import
```

### コマンドオプション

環境変数で動作をカスタマイズできます：

```bash
# 記事ディレクトリを指定
ARTICLE_DIR=/path/to/articles npm run import

# バッチサイズを変更（並行処理数）
BATCH_SIZE=5 npm run import

# 詳細ログを表示
VERBOSE=true npm run import

# 設定ファイルを指定
CONFIG_PATH=./my-config.json npm run import
```

## 📊 実行フロー

```
1. 設定読み込み
   ↓
2. ジョブロック取得（並行実行防止）
   ↓
3. 記事ファイル検出
   ↓
4. バリデーション（全ファイル）
   ↓ 失敗があれば中止
5. バックアップ作成（Dry Runでは省略）
   ↓
6. 差分検出
   ↓
7. インポート実行（バッチ処理）
   ↓
8. 結果サマリー表示
   ↓
9. ログ保存
   ↓
10. ジョブロック解放
```

## 📁 ディレクトリ構造

```
.claude/skills/sanity-bulk-import/
├── src/
│   ├── types.ts          # 型定義
│   ├── differ.ts         # 差分検出
│   ├── progress.ts       # 進捗表示
│   ├── backup.ts         # バックアップ
│   └── importer.ts       # メインロジック
├── tests/
│   └── differ.test.ts    # ユニットテスト
├── examples/
│   ├── sample-vitamin-c.json
│   └── sample-vitamin-d.json
├── logs/                 # 実行ログ（自動生成）
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .env.example
└── README.md
```

## 📝 ログ

実行ログは `logs/` ディレクトリに保存されます：

```json
{
  "jobId": "import-1234567890",
  "startTime": "2025-01-18T12:00:00.000Z",
  "endTime": "2025-01-18T12:05:30.000Z",
  "mode": "upsert",
  "dryRun": false,
  "totalFiles": 34,
  "results": [
    {
      "file": "/path/to/vitamin-c-article.json",
      "slug": "vitamin-c",
      "status": "success",
      "action": "updated",
      "documentId": "abc123",
      "retries": 0,
      "duration": 1234
    }
  ],
  "stats": {
    "success": 33,
    "failed": 0,
    "skipped": 1,
    "created": 5,
    "updated": 28
  },
  "successRate": 0.97,
  "duration": 330000,
  "backup": {
    "backupFilePath": "logs/backup-production-2025-01-18.ndjson",
    "sha256": "abc123...",
    "timestamp": "2025-01-18T12:00:00.000Z",
    "size": 1048576
  }
}
```

## 🧪 テスト

```bash
# ユニットテスト実行
npm test

# ウォッチモード
npm run test:watch

# サンプルファイルでテスト
ARTICLE_DIR=./examples DRY_RUN=true npm run import
```

## ⚠️ トラブルシューティング

### エラー: "インポートジョブが既に実行中です"

別のプロセスが実行中、またはロックファイルが残っています：

```bash
# ロックファイルを削除
rm logs/import.lock
```

### エラー: "バリデーション失敗"

記事ファイルの品質問題です。修正してください：

```bash
# article-validatorで詳細確認
npx tsx ../article-validator/index.ts --batch "*-article.json"
```

### エラー: "SANITY_API_TOKEN is not set"

環境変数が設定されていません：

```bash
# .envファイルを確認
cat .env

# トークンを設定
export SANITY_API_TOKEN=your-token
```

### バックアップ失敗

Sanity CLIがインストールされているか確認：

```bash
npx sanity --version
```

## 🔒 セキュリティ

### APIトークンの管理

- ✅ 環境変数のみで管理（`.env`ファイル）
- ✅ Gitには絶対にコミットしない（`.gitignore`に追加）
- ✅ 最小権限（Editor権限）を使用
- ✅ 定期的にローテーション

### バックアップの暗号化

MVP版では**ローカル保存のみ**です。S3アップロードは将来実装予定。

バックアップファイルを手動で暗号化する場合：

```bash
# GPGで暗号化
gpg --symmetric --cipher-algo AES256 logs/backup-*.ndjson

# 暗号化されたファイルのみ保持
rm logs/backup-*.ndjson
```

## 🔄 ロールバック

MVP版では**自動ロールバックは提供しません**。手動でリストアしてください：

```bash
# バックアップから復元（⚠️ 全データが置き換わります）
npx sanity dataset import logs/backup-production-2025-01-18.ndjson production --replace
```

## 📋 成功率閾値

デフォルトで95%の成功率が求められます（`config.example.json`で変更可能）。

閾値を下回った場合：

1. ログを確認して失敗原因を特定
2. 問題を修正
3. 再実行

## 🚧 MVP版の制限

以下の機能は将来実装予定：

- ❌ S3への自動バックアップアップロード
- ❌ 自動ロールバック機能
- ❌ `replace`モード（全置換）
- ❌ 失敗ファイルのみの再試行機能
- ❌ Slack/メール通知
- ❌ GitHub Actions連携

## 📚 参考情報

- [Sanity Client Documentation](https://www.sanity.io/docs/js-client)
- [Sanity CLI Documentation](https://www.sanity.io/docs/cli)
- [Suptia CLAUDE.md](../../../CLAUDE.md)

## 🆘 サポート

問題が発生した場合：

1. `logs/`ディレクトリのログファイルを確認
2. `VERBOSE=true`で再実行して詳細ログを取得
3. GitHubのIssueを作成

## 📄 ライセンス

MIT
