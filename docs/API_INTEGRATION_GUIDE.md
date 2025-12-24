# ECサイトAPI連携ガイド

## 概要

SuptiaのフェーズG2.5「ECサイトAPI連携」の実装ガイドです。**楽天市場API**をメインデータソースとし、売上発生後に**Amazon PA-API 5.0**を段階的に追加します。

## 📋 段階的導入戦略

### MVP期間（売上発生まで）

**データソース**: 楽天市場APIのみ

**理由**:

- ✅ 売上要件なし
- ✅ 月間10,000リクエスト無料
- ✅ 日本市場で十分なカバレッジ
- ✅ ポイント還元を考慮した実効価格

### 成長期（初回売上後）

**データソース**: 楽天 + Amazon PA-API

**移行条件**:

- ✅ 過去30日以内に3件以上の売上
- ✅ 継続的な売上見込み（月3件以上）

### 拡大期（将来）

**データソース**: 楽天 + Amazon + iHerb

---

## ⚠️ Amazon PA-API売上要件について

### 重要な制約

Amazon PA-APIには**売上要件**があります：

- 📅 **過去30日以内に3件以上の売上**が必要
- 🚫 売上がない場合、**APIアクセスが制限または停止**
- ⏰ 新規アカウントは**30-90日の猶予期間**がある場合もある

### MVP期間中の対応

**推奨**: `ENABLE_AMAZON_API=false` のまま運用

- 楽天APIのみで価格比較機能を提供
- Amazonは手動アフィリエイトリンクで対応（オプション）
- 売上発生後に自動化

### 有効化タイミング

```bash
# 初回売上達成後
ENABLE_AMAZON_API=true  # .env.localで変更
```

## 実装完了機能

### ✅ 1. APIアダプター層

**場所**: `apps/web/src/lib/adapters/`

#### 共通インターフェース

- **`types.ts`**: 共通型定義（PriceData, StockStatus, ReviewData, ProductIdentifierなど）
- **`base.ts`**: アダプター基底クラス（リトライ、タイムアウト、エラーハンドリング）

#### ECサイト別アダプター

- **`amazon.ts`**: Amazon PA-API 5.0アダプター
  - 価格取得（`fetchPrice`）
  - 在庫確認（`fetchStock`）
  - レビュー取得（`fetchReviews`）
  - AWS Signature Version 4対応（TODO）

- **`rakuten.ts`**: 楽天市場APIアダプター
  - 価格取得（ポイント還元を考慮した実効価格）
  - 在庫確認
  - レビュー取得
  - JAN/itemCode/キーワード検索対応

#### 使用例

```typescript
import { createAdapter } from "@/lib/adapters";

// Amazonアダプター
const amazonAdapter = createAdapter("amazon", {
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
  associateTag: process.env.AMAZON_ASSOCIATE_TAG!,
});

const priceResult = await amazonAdapter.fetchPrice({
  asin: "B00TEST123",
});

if (priceResult.success) {
  console.log(`価格: ¥${priceResult.data.amount}`);
}
```

### ✅ 2. 価格同期API

**場所**: `apps/web/src/app/api/sync/`

#### 単一商品同期エンドポイント

**`POST /api/sync/prices`**

```bash
curl -X POST http://localhost:3000/api/sync/prices \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": {
      "jan": "4573117580016",
      "asin": "B00TEST123"
    },
    "sources": ["amazon", "rakuten"]
  }'
```

レスポンス例:

```json
{
  "success": true,
  "results": [
    {
      "source": "amazon",
      "success": true,
      "price": 1980,
      "currency": "JPY",
      "url": "https://amazon.co.jp/dp/B00TEST123?tag=suptia6902-22"
    },
    {
      "source": "rakuten",
      "success": true,
      "price": 1880,
      "currency": "JPY",
      "url": "https://item.rakuten.co.jp/..."
    }
  ],
  "timestamp": "2025-10-20T12:00:00Z"
}
```

#### バッチ同期エンドポイント

**`POST /api/sync/batch`**

深夜の一括更新用（Vercel Cron Job対応）

```bash
curl -X POST http://localhost:3000/api/sync/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_batch_sync_token" \
  -d '{
    "products": [
      {
        "id": "product-001",
        "identifier": { "jan": "4573117580016", "asin": "B00TEST123" }
      },
      {
        "id": "product-002",
        "identifier": { "jan": "1234567890123" }
      }
    ],
    "maxConcurrency": 5
  }'
```

### ✅ 3. 商品同定ロジック

**場所**: `apps/web/src/lib/product-matching.ts`

CLAUDE.mdの仕様に基づく商品マッチングロジック：

1. **JAN一致** → 信頼度1.0（即同一と判定）
2. **ASIN一致** → 信頼度0.95
3. **EAN一致** → 信頼度0.95
4. **タイトル類似度** → cosine > 0.92で候補

#### 使用例

```typescript
import { matchProducts, findMatchingProducts } from "@/lib/product-matching";

const product1 = {
  jan: "4573117580016",
  title: "ビタミンC 1000mg",
};

const product2 = {
  jan: "4573117580016",
  title: "Vitamin C 1000mg",
};

const result = matchProducts(product1, product2);
// => { isMatch: true, confidence: 1.0, method: "jan_exact" }
```

## セットアップ手順

### 1. 環境変数の設定

`.env.local`に以下を追加：

```bash
# Amazon PA-API 5.0
AMAZON_ACCESS_KEY_ID=your_amazon_access_key_id
AMAZON_SECRET_ACCESS_KEY=your_amazon_secret_access_key
AMAZON_ASSOCIATE_TAG=your_amazon_associate_tag
AMAZON_REGION=us-west-2
AMAZON_MARKETPLACE=www.amazon.co.jp

# 楽天市場API
RAKUTEN_APPLICATION_ID=your_rakuten_application_id
RAKUTEN_AFFILIATE_ID=your_rakuten_affiliate_id

# バッチ同期用トークン（オプション）
BATCH_SYNC_TOKEN=your_secure_random_token
```

### 2. APIキーの取得

#### 楽天API（優先 - 今すぐ取得推奨）

1. [楽天アフィリエイト](https://affiliate.rakuten.co.jp/)に登録
2. [楽天Webサービス](https://webservice.rakuten.co.jp/)でアプリケーションIDを取得
3. 無料プラン: 月間10,000リクエスト
4. **売上要件なし** - すぐに使える！

#### Amazon PA-API（オプション - 売上発生後）

1. [Amazonアソシエイト](https://affiliate.amazon.co.jp/)に登録
2. アフィリエイトリンクを設置（手動運用開始）
3. **初回売上達成後**、[Product Advertising API](https://affiliate.amazon.co.jp/assoc_credentials/home)でアクセスキーを取得
4. ⚠️ 注意: 過去30日以内に3件以上の売上を維持する必要あり

### 3. 動作確認

```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# 型チェック
npm run typecheck

# lint
npm run lint
```

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                     │
│              (/api/sync/prices, /batch)                 │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Amazon │  │ Rakuten│  │ Future │
    │Adapter │  │Adapter │  │Adapters│
    └────┬───┘  └────┬───┘  └────────┘
         │           │
         ↓           ↓
    ┌────────────────────────┐
    │   BaseAdapter          │
    │   - retryWithBackoff   │
    │   - fetchWithTimeout   │
    │   - error handling     │
    └────────────────────────┘
```

## エラーハンドリング

### レート制限（429エラー）

Exponential backoffで自動リトライ：

- 1回目: 1秒待機
- 2回目: 2秒待機
- 3回目: 4秒待機

### ネットワークエラー

最大3回まで自動リトライ（BaseAdapterクラスで実装済み）

### タイムアウト

デフォルト10秒でタイムアウト（設定可能）

## 次のステップ

### MVP期間中（楽天のみ運用）

1. **楽天APIキーを取得**
   - 今すぐ取得可能（売上要件なし）
   - `.env.local`に設定

2. **Sanity商品データに楽天itemCodeを追加**
   - 商品登録時にitemCodeを紐付け
   - JANコードも併用推奨

3. **価格同期の定期実行**
   - Vercel Cron Jobで深夜3時に実行
   - 楽天APIのみで十分な価格データ取得

### 売上発生後（Amazon追加）

1. **AWS Signature Version 4の実装**
   - Amazon PA-APIは署名付きリクエストが必要
   - 現在はモックデータを返している
   - 実装場所: `apps/web/src/lib/adapters/amazon.ts` の `generateSignedHeaders`メソッド
   - **参考**: [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)

2. **環境変数の更新**

   ```bash
   ENABLE_AMAZON_API=true  # 有効化
   ```

3. **2ソース比較UIの強化**
   - 楽天 vs Amazon価格比較
   - 「最安値」バッジ表示

### TODO: キャッシュ層の実装

Vercel KV（Redis）を使った価格キャッシュ：

- 価格データ: 6時間キャッシュ
- 在庫状況: 1時間キャッシュ
- レビューデータ: 24時間キャッシュ

### TODO: Vercel Cron Jobの設定

深夜3時に全商品の価格を一括更新：

**`vercel.json`**:

```json
{
  "crons": [
    {
      "path": "/api/sync/batch",
      "schedule": "0 3 * * *"
    }
  ]
}
```

## テスト

### 商品マッチングロジックのテスト

**場所**: `apps/web/src/lib/__tests__/product-matching.test.ts`

- JAN完全一致テスト
- ASIN完全一致テスト
- EAN完全一致テスト
- タイトル類似度テスト
- 優先順位テスト

### 実行

```bash
npm run test
# 72 tests passed
```

## トラブルシューティング

### Q: 「No API credentials configured」エラーが出る

A: `.env.local`に楽天APIキーが設定されているか確認してください。

```bash
RAKUTEN_APPLICATION_ID=your_rakuten_application_id
RAKUTEN_AFFILIATE_ID=your_rakuten_affiliate_id
```

### Q: 楽天APIでレート制限エラーが発生する

A: 無料プランは月間10,000リクエストまでです。バッチ処理の頻度を調整してください。MVP期間中は1日1回の深夜同期で十分です。

### Q: Amazon PA-APIで401エラーが発生する

A: 以下を確認してください：

1. `ENABLE_AMAZON_API=true` になっているか
2. 過去30日以内に3件以上の売上があるか
3. AWS Signature Version 4が実装されているか（現在は未実装）

### Q: 商品マッチングの精度が低い

A: タイトル正規化ロジック（`normalizeTitle`関数）をカスタマイズしてください。ブランド名や容量パターンを追加できます。

### Q: MVP期間中にAmazon価格も表示したい

A: 以下の方法があります：

1. **手動アフィリエイトリンク**: SanityのProductスキーマに`amazonUrl`フィールドを追加
2. **ユーザー価格報告機能**: 「この価格は正確ですか？」フィードバック
3. **売上達成を急ぐ**: SEO強化・SNS集客で初回売上を早期達成

## 参考資料

- [Amazon PA-API 5.0 Documentation](https://webservices.amazon.com/paapi5/documentation/)
- [楽天市場API Documentation](https://webservice.rakuten.co.jp/documentation/ichiba-item-search)
- [CLAUDE.md - ECサイト連携戦略](../CLAUDE.md#-ecサイト連携api統合戦略)

---

**最終更新**: 2025-10-20
**バージョン**: 1.0.0
**ステータス**: フェーズ2.5完了（AWS署名実装を除く）
