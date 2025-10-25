# アフィリエイトネットワーク API 統合ガイド

## 概要

iHerbには公式APIが存在しないため、**アフィリエイトネットワーク経由のProduct Feed API**を利用します。

この方法は：

- ✅ **完全に合法** - iHerbの利用規約に準拠
- ✅ **無料** - アフィリエイト登録のみで利用可能
- ✅ **収益化** - アフィリエイト報酬も獲得できる
- ✅ **構造化データ** - JSON/XMLで商品データを取得

---

## 対応アフィリエイトネットワーク

### 1. CJ Affiliate (Commission Junction) ⭐️ 推奨

**特徴:**

- 世界最大級のアフィリエイトネットワーク
- iHerb、Amazon US、多数のブランドと提携
- 高品質なProduct Feed API

**API機能:**

- Product Search API - 商品検索・フィルタリング
- Deep Link API - アフィリエイトリンク生成
- Commission API - 成果確認

**登録方法:**

1. https://www.cj.com/ でアカウント作成
2. Publisher（パブリッシャー）として登録
3. iHerbプログラムを検索して申請
4. 承認後、API KeyとWebsite IDを取得

**料金:** 無料

---

### 2. Rakuten Advertising (旧LinkShare)

**特徴:**

- 楽天グループのアフィリエイトネットワーク
- iHerb、多数のグローバルブランドと提携
- 日本企業のため日本語サポートあり

**API機能:**

- Product Search API
- Deep Link Generator
- Transaction API

**登録方法:**

1. https://rakutenadvertising.com/ でアカウント作成
2. Publisher Networkに参加
3. iHerbプログラムに申請
4. API Tokenを取得

**料金:** 無料

---

### 3. Impact (旧Impact Radius)

**特徴:**

- 最新のパフォーマンスマーケティングプラットフォーム
- APIファーストの設計
- リアルタイムトラッキング

**API機能:**

- Catalog API - 商品カタログ
- Universal Tracking Tag (UTT)
- Conversion API

**登録方法:**

1. https://impact.com/ でアカウント作成
2. Media Partnerとして登録
3. iHerbキャンペーンに参加
4. Account SIDとAuth Tokenを取得

**料金:** 無料

---

## セットアップ手順

### ステップ1: アフィリエイトネットワークに登録

まずはCJ Affiliateから始めることを推奨します：

1. **CJ Affiliateアカウント作成**

   ```
   https://www.cj.com/
   → Sign Up → Publisher
   ```

2. **サイト情報を登録**
   - サイト名: サプティア
   - URL: https://suptia.com
   - カテゴリ: Health & Wellness
   - 月間PV: 実績を入力

3. **iHerbプログラムに申請**

   ```
   CJ Dashboard → Advertisers → Search "iHerb"
   → Apply to Program
   ```

4. **承認待ち（通常1-3営業日）**

5. **API認証情報を取得**
   ```
   Account Settings → API Credentials
   → Generate New API Key
   ```

### ステップ2: 環境変数を設定

`.env.local` に以下を追加：

```bash
# CJ Affiliate
CJ_API_KEY=your_api_key_here
CJ_WEBSITE_ID=your_website_id_here
CJ_IHERB_ADVERTISER_ID=iherb_advertiser_id

# Rakuten Advertising (オプション)
RAKUTEN_ADVERTISING_TOKEN=your_token_here
RAKUTEN_SID=your_site_id
RAKUTEN_IHERB_MID=iherb_merchant_id

# Impact (オプション)
IMPACT_ACCOUNT_SID=your_account_sid
IMPACT_AUTH_TOKEN=your_auth_token
IMPACT_IHERB_CAMPAIGN_ID=iherb_campaign_id
```

### ステップ3: APIを使用する

```typescript
import { searchAffiliateProducts } from "@/lib/integrations/affiliate-manager";

// iHerbでビタミンDを検索
const products = await searchAffiliateProducts({
  network: "cj",
  merchant: "iherb",
  keyword: "vitamin D",
  limit: 50,
});

console.log(products);
// [
//   {
//     id: "12345",
//     name: "Now Foods Vitamin D3 5000 IU",
//     brand: "Now Foods",
//     price: 1980,
//     currency: "JPY",
//     imageUrl: "https://...",
//     affiliateUrl: "https://...",
//     network: "cj",
//     inStock: true
//   },
//   ...
// ]
```

---

## 使用例

### 例1: 商品検索

```typescript
import { searchAffiliateProducts } from "@/lib/integrations/affiliate-manager";

async function searchVitaminD() {
  const products = await searchAffiliateProducts({
    network: "cj",
    merchant: "iherb",
    keyword: "vitamin D 5000 IU",
    limit: 20,
  });

  return products;
}
```

### 例2: アフィリエイトリンク生成

```typescript
import { generateAffiliateLink } from "@/lib/integrations/affiliate-manager";

async function createLink() {
  const url = "https://jp.iherb.com/pr/12345";

  const affiliateUrl = await generateAffiliateLink("cj", url);

  console.log(affiliateUrl);
  // https://www.anrdoezrs.net/click-xxxxx-yyyyy?url=...
}
```

### 例3: 最安値検索（複数ネットワーク）

```typescript
import { findBestPrice } from "@/lib/integrations/affiliate-manager";

async function findCheapest() {
  // CJ、Rakuten、Impactの3ネットワークから最安値を検索
  const bestProduct = await findBestPrice({
    keyword: "vitamin D3 now foods",
    networks: ["cj", "rakuten", "impact"],
    merchant: "iherb",
  });

  if (bestProduct) {
    console.log(`最安値: ¥${bestProduct.price} (${bestProduct.network})`);
  }
}
```

### 例4: Sanityへの同期

```typescript
import { searchAffiliateProducts } from "@/lib/integrations/affiliate-manager";
import { client } from "@/sanity/lib/client";

async function syncToSanity() {
  // iHerbから人気商品を取得
  const products = await searchAffiliateProducts({
    network: "cj",
    merchant: "iherb",
    keyword: "vitamin",
    limit: 100,
  });

  // Sanityに商品を作成/更新
  for (const product of products) {
    await client.createOrReplace({
      _type: "product",
      _id: `product-iherb-${product.id}`,
      title: product.name,
      brand: product.brand,
      prices: [
        {
          amount: product.price,
          currency: product.currency,
          source: "iherb",
          affiliateUrl: product.affiliateUrl,
          inStock: product.inStock,
          fetchedAt: new Date().toISOString(),
        },
      ],
      imageUrl: product.imageUrl,
    });
  }

  console.log(`${products.length}件の商品を同期しました`);
}
```

---

## Cronジョブで自動同期

毎日深夜に商品データを自動更新：

```typescript
// scripts/sync-iherb-daily.mjs
import { searchAffiliateProducts } from "../apps/web/src/lib/integrations/affiliate-manager.js";

async function dailySync() {
  const keywords = [
    "vitamin D",
    "omega 3",
    "vitamin C",
    "probiotics",
    "magnesium",
  ];

  for (const keyword of keywords) {
    const products = await searchAffiliateProducts({
      network: "cj",
      merchant: "iherb",
      keyword,
      limit: 50,
    });

    // Sanityに同期
    // ...
  }
}

dailySync().catch(console.error);
```

Vercel Cronで実行：

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync-iherb",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## よくある質問

### Q1. APIの利用制限はありますか？

**A:** ネットワークによって異なります：

- **CJ**: 基本アカウントで1日8,640リクエスト（10秒に1リクエスト）
- **Rakuten**: 明示的な制限なし（常識的な範囲で）
- **Impact**: アカウントによって異なる

推奨: 1時間に1回程度の同期頻度に抑える。

### Q2. アフィリエイト報酬はどのくらいですか？

**A:** iHerbの場合：

- **新規顧客**: 注文金額の5-10%
- **リピート顧客**: 注文金額の3-5%
- **最低支払額**: $50-$100（ネットワークによる）

### Q3. 複数のネットワークを同時に使えますか？

**A:** はい、可能です。ただし：

- 同じページで複数のアフィリエイトリンクを併記するのは推奨しません
- 価格比較の場合、最安値のネットワークを優先表示
- 各ネットワークの利用規約を確認

### Q4. 在庫情報はリアルタイムですか？

**A:** いいえ。Product Feedは通常：

- **CJ**: 24時間ごとに更新
- **Rakuten**: 1-2日ごと
- **Impact**: ネットワーク設定による

リアルタイム在庫が必要な場合はBright Data等のスクレイピングサービスが必要です。

### Q5. 日本円での価格取得は可能ですか？

**A:** ネットワークによります：

- **CJ**: USD表記が多い（為替換算が必要）
- **Rakuten**: 加盟店設定による
- **Impact**: キャンペーン設定による

推奨: 為替レートAPIで日本円に自動変換する実装を追加。

---

## トラブルシューティング

### エラー: "API Key is invalid"

**解決策:**

1. `.env.local` のAPI Keyが正しいか確認
2. CJダッシュボードでAPI Keyを再生成
3. 環境変数を再読み込み（開発サーバー再起動）

### エラー: "Advertiser ID not found"

**解決策:**

1. iHerbプログラムが承認されているか確認
2. CJダッシュボードで正しいAdvertiser IDをコピー
3. プログラムのステータスが"Active"であることを確認

### 商品が0件しか取得できない

**原因:**

- キーワードが英語でない
- Advertiser IDが間違っている
- プログラムが承認されていない

**解決策:**

```typescript
// 英語キーワードを使用
await searchAffiliateProducts({
  network: "cj",
  merchant: "iherb",
  keyword: "vitamin D", // ✅ 英語
  // keyword: 'ビタミンD', // ❌ 日本語（動作しない）
});
```

---

## 次のステップ

1. **CJ Affiliateに登録** → [https://www.cj.com/](https://www.cj.com/)
2. **iHerbプログラムに申請**
3. **API Keyを取得**
4. **`.env.local`に設定**
5. **テスト検索を実行**

```bash
# テストスクリプトを実行
npm run test:affiliate-api
```

---

## 参考リンク

- [CJ Affiliate Developer Portal](https://developers.cj.com/)
- [Rakuten Advertising API Docs](https://rakutenadvertising.com/en-uk/publishers/tools/)
- [Impact API Documentation](https://developer.impact.com/)
- [iHerb Affiliate Program](https://jp.iherb.com/info/affiliates)

---

**最終更新**: 2025-10-25
