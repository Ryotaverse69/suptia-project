# API Integration Tester

Amazon PA-API・楽天API連携テスター

## 概要

**api-integration-tester** は、SuptiaプロジェクトのEC API連携（Amazon PA-API、楽天API）の品質を検証するツールです。

## 主な機能

- ✅ **認証テスト**: API認証情報の検証
- ✅ **データ取得テスト**: 商品データの取得とレスポンスタイム測定
- ✅ **品質スコア算出**: 取得データの品質を6つの観点で評価（0-100点）
- ✅ **レート制限チェック**: APIリクエスト制限のステータス確認
- ✅ **モックデータ生成**: テスト用のダミー商品データを生成
- ✅ **複数出力フォーマット**: コンソール、JSON、Markdownでレポート生成

## 使用方法

### 基本的な使い方

```bash
# Amazon PA-API の認証テスト
npx tsx .claude/skills/api-integration-tester/index.ts --provider amazon --test-type auth

# 楽天API の全テスト
npx tsx .claude/skills/api-integration-tester/index.ts --provider rakuten --test-type all

# 両方のAPIをテスト
npx tsx .claude/skills/api-integration-tester/index.ts --provider all
```

### オプション

| オプション        | 短縮形 | 説明                                                        | デフォルト |
| ----------------- | ------ | ----------------------------------------------------------- | ---------- |
| `--provider`      | `-p`   | APIプロバイダー（`amazon`/`rakuten`/`all`）                 | `amazon`   |
| `--test-type`     | `-t`   | テストタイプ（`auth`/`fetch`/`quality`/`rate-limit`/`all`） | `all`      |
| `--test-product`  | -      | テスト用の商品ID（ASIN、楽天商品コードなど）                | -          |
| `--generate-mock` | `-m`   | モックデータを生成                                          | `false`    |
| `--mock-count`    | -      | 生成するモックデータの数                                    | `10`       |
| `--format`        | `-f`   | 出力フォーマット（`console`/`json`/`markdown`）             | `console`  |
| `--save`          | `-o`   | レポートをファイルに保存                                    | -          |
| `--help`          | `-h`   | ヘルプを表示                                                | -          |

### 使用例

#### 1. 認証テストのみ実行

```bash
npx tsx .claude/skills/api-integration-tester/index.ts \
  --provider amazon \
  --test-type auth
```

#### 2. 商品データ取得テスト

```bash
npx tsx .claude/skills/api-integration-tester/index.ts \
  --provider amazon \
  --test-type fetch \
  --test-product B000123456
```

#### 3. モックデータ生成（20件）

```bash
npx tsx .claude/skills/api-integration-tester/index.ts \
  --provider amazon \
  --generate-mock \
  --mock-count 20
```

#### 4. 両方のAPIをテストしてMarkdownレポート生成

```bash
npx tsx .claude/skills/api-integration-tester/index.ts \
  --provider all \
  --format markdown \
  --save api-test-report.md
```

## 品質スコア評価基準

データ品質は以下の6つの観点で評価されます（合計100点）：

| 評価項目             | 配点 | 評価基準                               |
| -------------------- | ---- | -------------------------------------- |
| **価格正確性**       | 30点 | 価格情報の完全性（金額、通貨、妥当性） |
| **在庫可用性**       | 25点 | 在庫情報の有無と詳細度                 |
| **画像品質**         | 15点 | 商品画像の枚数と品質                   |
| **説明完全性**       | 15点 | 商品説明の文字数と詳細度               |
| **レビューデータ**   | 10点 | レビュー評価とレビュー数               |
| **レスポンスタイム** | 5点  | API応答速度（500ms以下で満点）         |

### スコア判定

- **90点以上**: 優秀 - そのまま利用可能
- **70〜89点**: 良好 - 軽微な改善推奨
- **50〜69点**: 合格 - 改善が必要
- **50点未満**: 不合格 - データ品質に問題あり

## 環境変数

以下の環境変数を `.env.local` に設定してください：

### Amazon PA-API

```bash
AMAZON_ACCESS_KEY_ID=your_access_key
AMAZON_SECRET_ACCESS_KEY=your_secret_key
AMAZON_ASSOCIATE_TAG=your_associate_tag
AMAZON_REGION=us-west-2  # オプション
```

### 楽天API

```bash
RAKUTEN_APPLICATION_ID=your_app_id
RAKUTEN_AFFILIATE_ID=your_affiliate_id  # オプション
```

## 出力例

### コンソール出力

```
┌─────────────────────────────────────────────────────────┐
│         API Integration Tester Report                   │
├─────────────────────────────────────────────────────────┤
│ Provider: AMAZON                                        │
│ Timestamp: 2025-10-21T12:00:00.000Z                    │
│ Status: PASS ✅                                         │
└─────────────────────────────────────────────────────────┘

🔐 Authentication Test
  Status: ✅ Success
  Message: ✅ Amazon PA-API の認証情報が正しく設定されています

📦 Data Fetch Test
  Product ID: B000MOCK123
  Status: ✅ Success
  Response Time: 12ms

  Product Data:
    Title: NOW Foods ビタミンC 1000mg 250粒
    Price: ¥1980
    Stock: Available
    Images: 2 images
    Description: NOW Foods社の高品質ビタミンCサプリメント...
    Reviews: ⭐ 4.5 (1234 reviews)

📊 Data Quality Score
  Total Score: 85/100

  Breakdown:
    Price Accuracy:       25/30
    Stock Availability:   25/25
    Image Quality:        15/15
    Description:          12/15
    Review Data:          10/10
    Response Time:        5/5

⏱️  Rate Limit Status
  Max Requests/Second: 1
  Max Requests/Day: 8,640
  Requests Today: 0
  Remaining Today: 8,640
  Next Reset: 2025/10/22 0:00:00

───────────────────────────────────────────────────────
Summary: ✅ すべてのテストに合格しました（AMAZON）
```

## CI/CD連携

### GitHub Actions

```yaml
name: API Integration Test

on:
  schedule:
    - cron: "0 0 * * *" # 毎日0時に実行
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install

      - name: Test Amazon PA-API
        env:
          AMAZON_ACCESS_KEY_ID: ${{ secrets.AMAZON_ACCESS_KEY_ID }}
          AMAZON_SECRET_ACCESS_KEY: ${{ secrets.AMAZON_SECRET_ACCESS_KEY }}
          AMAZON_ASSOCIATE_TAG: ${{ secrets.AMAZON_ASSOCIATE_TAG }}
        run: |
          npx tsx .claude/skills/api-integration-tester/index.ts \
            --provider amazon \
            --test-type all \
            --format json \
            --save amazon-test-report.json

      - name: Test Rakuten API
        env:
          RAKUTEN_APPLICATION_ID: ${{ secrets.RAKUTEN_APPLICATION_ID }}
          RAKUTEN_AFFILIATE_ID: ${{ secrets.RAKUTEN_AFFILIATE_ID }}
        run: |
          npx tsx .claude/skills/api-integration-tester/index.ts \
            --provider rakuten \
            --test-type all \
            --format json \
            --save rakuten-test-report.json

      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: api-test-reports
          path: |
            amazon-test-report.json
            rakuten-test-report.json
```

## トラブルシューティング

### Q: 認証テストに失敗する

A: 環境変数が正しく設定されているか確認してください。

```bash
# 環境変数の確認
echo $AMAZON_ACCESS_KEY_ID
echo $RAKUTEN_APPLICATION_ID
```

### Q: モックデータはいつまで使う？

A: フェーズ2.5（2025年11月〜）で実際のAPI呼び出しを実装予定です。それまではモックデータでテストします。

### Q: レート制限に達した場合は？

A: Amazon PA-APIは売上発生により制限が緩和されます。楽天APIは有料プランへのアップグレードを検討してください。

## ライセンス

MIT License

## 作成者

Ryota - Suptia Project
