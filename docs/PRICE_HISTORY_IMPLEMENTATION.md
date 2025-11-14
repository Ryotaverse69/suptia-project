# 価格履歴システム実装ガイド

## 概要

価格履歴システムは、商品の価格変動を追跡し、ユーザーに「買い時」を提示する機能です。

## データフロー

```
ECサイトAPI
  ↓
sync-rakuten-products.mjs / sync-yahoo-products.mjs
  ↓
Sanity (現在の価格)
  ↓
save-price-history.mjs (新規スクリプト)
  ↓
Supabase price_history テーブル
  ↓
PriceHistoryChart.tsx (新規コンポーネント)
  ↓
ユーザー（価格推移グラフ）
```

## Supabaseスキーマ（既存）

``sql
CREATE TABLE price_history (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
product_id TEXT NOT NULL,
source TEXT NOT NULL,
price DECIMAL(10, 2) NOT NULL,
effective_price DECIMAL(10, 2),
shipping_fee DECIMAL(10, 2),
point_rate DECIMAL(5, 4),
recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_price_history_product_id ON price_history(product_id);
CREATE INDEX idx_price_history_recorded_at ON price_history(recorded_at);
``

## 実装ステップ

### ステップ1: 環境変数の追加

`.env.local` に以下を追加：

``bash

# Supabase

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
``

### ステップ2: 価格履歴保存スクリプト

`scripts/save-price-history.mjs` を作成（後述）

### ステップ3: GitHub Actions ワークフロー

`.github/workflows/save-price-history.yml` を作成（後述）

### ステップ4: 価格履歴取得API

`apps/web/src/app/api/price-history/[productId]/route.ts` を作成

### ステップ5: 価格履歴グラフコンポーネント

`apps/web/src/components/PriceHistoryChart.tsx` を作成

### ステップ6: 商品詳細ページに統合

`apps/web/src/app/products/[slug]/page.tsx` にグラフを追加

## 買い時判定ロジック

以下の条件を満たす場合、「今が買い時」と判定：

1. **過去30日間の最安値**
   - 現在の価格 ≤ 過去30日間の最小値

2. **下降トレンド**
   - 直近7日間の平均価格 < 直近30日間の平均価格

3. **大幅値下げ**
   - (通常価格 - 現在価格) / 通常価格 ≥ 15%

``typescript
function isBuyingOpportunity(history: PriceHistory[]): boolean {
if (history.length < 7) return false;

const currentPrice = history[history.length - 1].price;
const last30Days = history.slice(-30);
const last7Days = history.slice(-7);

// 条件1: 過去30日間の最安値
const min30Days = Math.min(...last30Days.map(h => h.price));
const isLowest = currentPrice <= min30Days;

// 条件2: 下降トレンド
const avg7Days = last7Days.reduce((sum, h) => sum + h.price, 0) / last7Days.length;
const avg30Days = last30Days.reduce((sum, h) => sum + h.price, 0) / last30Days.length;
const isDowntrend = avg7Days < avg30Days;

// 条件3: 大幅値下げ
const avgPrice = avg30Days;
const discountRate = (avgPrice - currentPrice) / avgPrice;
const isBigDiscount = discountRate >= 0.15;

return isLowest || isDowntrend || isBigDiscount;
}
``

## UI表示例

``tsx
<PriceHistoryChart productId="p-001" period={30} />

↓

[グラフ表示]

- 横軸: 日付
- 縦軸: 価格
- 線グラフ: 価格推移
- 緑色ライン: 実質価格
- 青色ライン: 商品価格

[買い時アラート]
🎉 今が買い時！過去30日間で最安値です
``

## デプロイ後の動作確認

1. GitHub Actionsが毎日深夜3時に実行される
2. Supabase `price_history` テーブルにデータが追加される
3. 商品詳細ページでグラフが表示される
4. 買い時の場合、緑色のアラートが表示される

## 今後の拡張

- 価格アラート通知（メール/プッシュ）
- 価格予測（機械学習）
- 複数ECサイトの価格比較グラフ
- 価格変動統計（過去1年間の平均価格、最安値、最高値）
