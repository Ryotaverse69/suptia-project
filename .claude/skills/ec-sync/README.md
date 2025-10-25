# EC商品同期スキル

楽天・Yahoo・AmazonなどのECサイトから商品データを取得し、Sanityに同期するClaude Code Skillです。

## 概要

このスキルは、複数のECサイトAPIから商品情報を取得し、Suptiaのデータベース（Sanity CMS）に同期します。開発環境での対話的な実行と、本番環境でのバッチ処理の両方に対応しています。

## アーキテクチャ

```
.claude/skills/ec-sync/
├── skill.json          # スキルメタデータ
├── index.mjs          # 対話的インターフェース（Claude Code用）
└── README.md          # このファイル

scripts/
├── sync-rakuten-products.mjs  # 楽天同期スクリプト
├── sync-yahoo-products.mjs    # Yahoo同期スクリプト（未実装）
└── sync-amazon-products.mjs   # Amazon同期スクリプト（未実装）

apps/web/src/lib/ec-adapters/
├── base.ts            # 共通インターフェース
├── rakuten.ts         # 楽天アダプター
├── yahoo.ts           # Yahooアダプター（未実装）
└── amazon.ts          # Amazonアダプター（未実装）
```

## ハイブリッド方式

本スキルは「ハイブリッド方式」を採用しています：

### 本番環境（GitHub Actions / Cron）

```yaml
# .github/workflows/sync-products.yml
- name: 楽天商品同期
  run: node scripts/sync-rakuten-products.mjs "サプリメント" --limit 100
```

### 開発環境（Claude Code / 対話的）

```bash
# Claude Codeから実行
node .claude/skills/ec-sync/index.mjs rakuten "ビタミンC" --limit 10 --dry-run
```

同じスクリプト（`scripts/sync-rakuten-products.mjs`）を両方の環境で使用することで、コードの重複を避け、メンテナンス性を向上させています。

## セットアップ

### 1. 環境変数の設定

`apps/web/.env.local`に以下を追加：

```bash
# Sanity（必須）
SANITY_API_TOKEN=your_sanity_token

# 楽天API（必須）
RAKUTEN_APPLICATION_ID=your_rakuten_app_id
RAKUTEN_AFFILIATE_ID=your_rakuten_affiliate_id  # オプション

# Yahoo API（将来）
YAHOO_SHOPPING_CLIENT_ID=your_yahoo_client_id
YAHOO_AFFILIATE_ID=your_yahoo_affiliate_id

# Amazon PA-API（将来）
AMAZON_ACCESS_KEY_ID=your_amazon_access_key
AMAZON_SECRET_ACCESS_KEY=your_amazon_secret_key
AMAZON_ASSOCIATE_TAG=your_amazon_associate_tag
```

### 2. 依存関係のインストール

```bash
npm install
```

## 使い方

### 基本的な使い方

```bash
# 楽天から「ビタミンC」で検索して同期
node .claude/skills/ec-sync/index.mjs rakuten "ビタミンC"

# 取得件数を指定
node .claude/skills/ec-sync/index.mjs rakuten "プロテイン" --limit 50

# DRYRUNモード（実際には保存しない）
node .claude/skills/ec-sync/index.mjs rakuten "サプリメント" --dry-run

# 既存商品の価格のみ更新
node .claude/skills/ec-sync/index.mjs rakuten --update-prices
```

### 直接スクリプトを実行

```bash
# スキルラッパーを経由せずに実行
node scripts/sync-rakuten-products.mjs "ビタミンC" --limit 10 --dry-run
```

## データフロー

```
┌─────────────────────────────────────────────────────────┐
│                   ECサイトAPI                              │
│              （楽天・Yahoo・Amazon）                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓ API呼び出し
┌─────────────────────────────────────────────────────────┐
│              ECAdapter (lib/ec-adapters)                │
│         商品データを共通形式(ECProduct)に正規化              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓ 正規化されたデータ
┌─────────────────────────────────────────────────────────┐
│         同期スクリプト (scripts/sync-*.mjs)                │
│     - 既存商品チェック（楽天商品コードで照合）                  │
│     - ブランド取得/作成                                     │
│     - Sanityスキーマにマッピング                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓ Sanity Mutation API
┌─────────────────────────────────────────────────────────┐
│               Sanity CMS (Product DB)                   │
│     - createIfNotExists (新規商品)                        │
│     - patch (既存商品の価格更新)                            │
└─────────────────────────────────────────────────────────┘
```

## データマッピング

### 楽天API → Sanity Product

| 楽天フィールド    | Sanity Product フィールド     | 備考                       |
| ----------------- | ----------------------------- | -------------------------- |
| `itemCode`        | `identifiers.rakutenItemCode` | 商品識別子                 |
| `itemName`        | `name`                        | 商品名                     |
| `itemPrice`       | `priceJPY`                    | 価格                       |
| `shopName`        | `brand` (reference)           | ブランド（自動作成）       |
| `itemUrl`         | `urls.rakuten`                | 商品URL                    |
| `affiliateUrl`    | `priceData[].url`             | アフィリエイトリンク       |
| `mediumImageUrls` | （未使用）                    | 画像は手動アップロード推奨 |
| `reviewAverage`   | `reviewStats.averageRating`   | レビュー平均               |
| `reviewCount`     | `reviewStats.reviewCount`     | レビュー数                 |
| `availability`    | `availability`                | 在庫状況                   |

### 手動入力が必要なフィールド

以下のフィールドは楽天APIでは取得できないため、Sanityスタジオで手動入力が必要です：

- `ingredients[]` - 成分構成（最重要）
- `servingsPerDay` - 1日あたりの摂取回数
- `servingsPerContainer` - 1容器あたりの回数
- `form` - 剤形（カプセル、タブレットなど）
- `warnings[]` - 注意事項
- `scores` - 評価スコア

## 制限事項

### 楽天API制限

- **無料プラン**: 月間10,000リクエスト
- **レート制限**: 1リクエスト/秒
- **最大取得件数**: 1リクエストあたり30件

### データ品質

- 楽天APIは成分情報を提供しないため、ingredients配列は空で作成されます
- 商品名から成分を推測することは薬機法リスクがあるため、手動入力を推奨します

### 商品同定

- 楽天商品コード（`itemCode`）で既存商品を照合
- JANコード対応は将来実装予定

## トラブルシューティング

### 「RAKUTEN_APPLICATION_ID が見つかりません」

`.env.local`に楽天APIの認証情報を追加してください。

取得方法:

1. https://webservice.rakuten.co.jp/ にアクセス
2. アプリケーションを登録
3. アプリケーションIDをコピー

### 「楽天API エラー: 429」

レート制限に達しました。1秒あたり1リクエストの制限があります。

対処法:

- `--limit`を小さくする
- 実行間隔を空ける
- 有料プランへのアップグレードを検討

### 「ブランド作成失敗」

ブランド名に特殊文字が含まれている可能性があります。

対処法:

- Sanityスタジオで手動でブランドを作成
- スクリプトのslug生成ロジックを確認

## 今後の拡張

### フェーズ2.5（現在）

- ✅ 楽天API統合
- ⏳ 価格履歴トラッキング
- ⏳ 在庫状況監視

### フェーズ3

- ⏳ Yahoo!ショッピングAPI統合
- ⏳ 複数ECサイトの価格比較
- ⏳ 最安値アラート機能

### フェーズ4

- ⏳ Amazon PA-API統合（売上達成後）
- ⏳ JANコードによる商品同定
- ⏳ iHerb対応（スクレイピングAPI経由）

## ライセンス

このスキルはSuptiaプロジェクトの一部であり、プロジェクトと同じライセンスが適用されます。

## サポート

問題が発生した場合は、以下を確認してください：

1. **環境変数**: `.env.local`に必要な認証情報が設定されているか
2. **API制限**: 楽天APIのレート制限に達していないか
3. **ログ**: エラーメッセージの詳細を確認
4. **ドキュメント**: [CLAUDE.md](../../../CLAUDE.md) のECサイト連携セクション

---

**最終更新**: 2025-10-25
**バージョン**: 1.0.0
**ステータス**: 楽天API対応完了、Yahoo/Amazon対応予定
