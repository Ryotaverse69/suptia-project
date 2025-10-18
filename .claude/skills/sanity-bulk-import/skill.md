# Sanity一括インポートツール（Skill）

## 概要

Suptiaプロジェクト用のSanity CMS一括インポートSkillです。成分記事JSONファイルを安全にSanityへインポートします。

## 目的

- 複数の成分記事を効率的にSanityへ登録
- データの整合性を保ちながら安全にインポート
- バリデーション済みの記事のみを受け入れ
- インポート前の自動バックアップ
- 差分検出による無駄な更新の回避

## 使用タイミング

### このSkillを使うべき時

1. **新規記事の一括追加**
   - 10件以上の新しい成分記事を追加する時
   - 初期データセットアップ時

2. **既存記事の一括更新**
   - 複数記事の内容を更新する時
   - 薬機法コンプライアンス修正後の一括反映

3. **品質改善後の反映**
   - article-validatorで全記事を修正した後
   - エビデンスレベルの一括更新

### このSkillを使わない方が良い時

1. **単一記事の編集**
   - Sanity Studioで直接編集する方が速い

2. **緊急の修正**
   - バックアップ・バリデーションをスキップしたい場合

3. **テスト環境がない状態**
   - 必ずDry Runで確認すること

## 前提条件

### 必須

- ✅ Node.js 18以上
- ✅ Sanity APIトークン（Editor権限）
- ✅ 全記事がarticle-validatorを通過していること

### 推奨

- ✅ Git管理下（変更履歴の追跡）
- ✅ バックアップストレージ（S3など）
- ✅ Dry Run実行の習慣

## 基本的な使い方

### ステップ1: 準備

```bash
# Skillディレクトリに移動
cd .claude/skills/sanity-bulk-import

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envを編集してSANITY_API_TOKENなどを設定
```

### ステップ2: Dry Run

```bash
# 必ずDry Runで確認
npm run import:dry
```

**確認ポイント**:

- ✅ 検出されたファイル数が正しいか
- ✅ バリデーションが全て合格しているか
- ✅ 作成/更新されるドキュメントの内容が正しいか

### ステップ3: 本番実行

```bash
# 問題なければ本番実行
DRY_RUN=false npm run import
```

### ステップ4: 結果確認

```bash
# ログを確認
cat logs/import-log-*.json

# Sanity Studioで確認
# https://your-project.sanity.studio/
```

## 安全機能

### 1. デフォルトDry Run

実際の書き込みを行う前に、何が起こるかを確認できます。

```bash
# デフォルトでDry Run
npm run import

# 明示的に指定
DRY_RUN=true npm run import
```

### 2. バリデーション必須

全ファイルがバリデーションを通過しないとインポートが開始されません。

```
❌ バリデーション失敗: 3/34件
  vitamin-c-article.json: Grade D, Critical 5件
  vitamin-d-article.json: Grade C, Critical 2件
  zinc-article.json: Grade D, Critical 8件

エラー: バリデーションに失敗したファイルがあります
```

### 3. 自動バックアップ

インポート前に自動でデータセットをバックアップします。

```
✅ バックアップ作成完了: 1.2MB (logs/backup-production-2025-01-18.ndjson)
```

### 4. 差分検出

既存データと比較し、変更がある場合のみ更新します。

```
📋 詳細結果
────────────────────────────────────────
✓ vitamin-c-article.json     更新 (変更3件)
○ vitamin-d-article.json     スキップ (変更なし)
✓ zinc-article.json          作成
```

### 5. ジョブロック

並行実行を防止します。

```
❌ エラー: インポートジョブが既に実行中です
```

### 6. リトライ機能

一時的なエラーに対して自動でリトライします。

```
⚠️  zinc-article.json: リトライ 1/3
⚠️  zinc-article.json: リトライ 2/3
✅ zinc-article.json: 作成成功（3回目）
```

## エラーハンドリング

### バリデーション失敗

```bash
# article-validatorで問題を修正
npx tsx ../article-validator/index.ts --batch "*-article.json"

# 自動修正ツールを実行
npx tsx ../article-auto-correction/index.ts --batch "*-article.json"

# 再度インポート
npm run import:dry
```

### 部分的な失敗

成功率が閾値（デフォルト95%）を下回った場合：

```
⚠️  成功率が閾値を下回っています: 85.3% < 95.0%
⚠️  ログを確認して手動で対応してください

📄 ログ保存: logs/import-log-1234567890.json
```

失敗したファイルのみを修正して再実行してください。

### ロールバックが必要な場合

```bash
# バックアップから手動で復元
npx sanity dataset import logs/backup-production-2025-01-18.ndjson production --replace
```

⚠️ **注意**: `--replace`は全データを置き換えます。慎重に実行してください。

## ベストプラクティス

### 1. 必ずDry Runから始める

```bash
# ❌ いきなり本番実行しない
DRY_RUN=false npm run import

# ✅ まずDry Runで確認
npm run import:dry
# 結果を確認してから...
DRY_RUN=false npm run import
```

### 2. バリデーションを徹底する

```bash
# インポート前に必ずバリデーション
npx tsx ../article-validator/index.ts --batch "*-article.json"

# 問題があれば自動修正
npx tsx ../article-auto-correction/index.ts --batch "*-article.json"

# 再度バリデーション
npx tsx ../article-validator/index.ts --batch "*-article.json"

# 全て合格したらインポート
npm run import:dry
```

### 3. ログを保存する

```bash
# ログは必ず確認
cat logs/import-log-*.json | jq .

# 重要なログは別途保存
cp logs/import-log-*.json ~/backups/
```

### 4. バックアップを確認する

```bash
# バックアップファイルが作成されたか確認
ls -lh logs/backup-*.ndjson

# SHA-256ハッシュを記録
shasum -a 256 logs/backup-*.ndjson >> backup-checksums.txt
```

### 5. 段階的にインポート

大量のファイルがある場合は、段階的に実行：

```bash
# 最初の10件のみテスト
ARTICLE_DIR=./test-articles npm run import:dry

# 問題なければ全件実行
ARTICLE_DIR=../../.. npm run import:dry
```

## パフォーマンス最適化

### バッチサイズの調整

```bash
# 並行処理数を調整（デフォルト: 10）
BATCH_SIZE=5 npm run import   # 遅いが安全
BATCH_SIZE=20 npm run import  # 速いがAPI制限に注意
```

### リトライ回数の調整

```bash
# リトライ回数を変更（デフォルト: 3）
RETRY_COUNT=5 npm run import  # ネットワークが不安定な場合
```

## CI/CD連携（将来実装）

```yaml
# .github/workflows/import-articles.yml
name: Import Articles to Sanity

on:
  push:
    paths:
      - "*-article.json"
    branches:
      - main

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd .claude/skills/sanity-bulk-import
          npm install

      - name: Dry Run
        env:
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
          DRY_RUN: true
        run: |
          cd .claude/skills/sanity-bulk-import
          npm run import

      - name: Import (if approved)
        if: github.event_name == 'workflow_dispatch'
        env:
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
          DRY_RUN: false
        run: |
          cd .claude/skills/sanity-bulk-import
          npm run import
```

## まとめ

### このSkillが提供する価値

✅ **安全性**: Dry Run、バリデーション、バックアップで安全にインポート
✅ **効率性**: 一括処理で時間を節約
✅ **品質保証**: バリデーション必須で低品質データを拒否
✅ **可視性**: 詳細ログで実行履歴を追跡
✅ **信頼性**: リトライ機能で一時的なエラーに対応

### 次のステップ

1. [README.md](./README.md)で詳細な使い方を確認
2. サンプルファイルでテスト実行
3. Dry Runで本番データを確認
4. 実際のインポートを実行

---

**質問・問題があれば**: [Suptia CLAUDE.md](../../../CLAUDE.md)を参照するか、GitHubでIssueを作成してください。
