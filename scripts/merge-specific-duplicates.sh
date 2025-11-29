#!/bin/bash

# 重複商品のマージスクリプト
#
# 使い方:
#   SANITY_API_TOKEN=your_token ./scripts/merge-specific-duplicates.sh
#
# このスクリプトは、以下の重複商品をマージします:
# - product-rakuten-fancl-shop-10009019 (楽天のカルシウム商品 - データが充実)
# - product-yahoo-fancl-y-5945 (Yahoo!のカルシウム商品 - JANコードあり)
#
# マージ方針:
# 1. 楽天商品をプライマリとして保持（成分データ、スコア、レビュー等が充実）
# 2. Yahoo!商品からJANコードと価格データを移行
# 3. Yahoo!商品を削除

set -e

if [ -z "$SANITY_API_TOKEN" ]; then
    echo "❌ SANITY_API_TOKEN が設定されていません"
    echo "使い方: SANITY_API_TOKEN=your_token ./scripts/merge-specific-duplicates.sh"
    exit 1
fi

SANITY_PROJECT_ID="fny3jdcg"
SANITY_DATASET="production"
SANITY_API_VERSION="2023-05-03"

echo "🔄 重複商品のマージを開始します..."
echo ""
echo "📦 対象商品:"
echo "  - プライマリ: product-rakuten-fancl-shop-10009019 (楽天カルシウム)"
echo "  - 削除対象: product-yahoo-fancl-y-5945 (Yahoo!カルシウム)"
echo ""

# まず、Yahoo!商品からJANコードと価格データを取得
echo "📥 Yahoo!商品のデータを取得中..."

YAHOO_DATA=$(curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=*%5B_id+%3D%3D+%22product-yahoo-fancl-y-5945%22%5D%5B0%5D%7BjanCode%2C+priceData%2C+identifiers%7D" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}")

echo "Yahoo!商品データ: $YAHOO_DATA"

# 楽天商品の現在の priceData を取得
RAKUTEN_PRICE_DATA=$(curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=*%5B_id+%3D%3D+%22product-rakuten-fancl-shop-10009019%22%5D%5B0%5D%7BpriceData%7D" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}")

echo "楽天商品価格データ: $RAKUTEN_PRICE_DATA"
echo ""

# マージのmutationを実行
echo "💾 楽天商品を更新し、Yahoo!商品を削除中..."

MUTATION_RESULT=$(curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "mutations": [
      {
        "patch": {
          "id": "product-rakuten-fancl-shop-10009019",
          "set": {
            "janCode": "4908049456313",
            "identifiers.jan": "4908049456313",
            "urls.yahoo": "https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3756713&pid=892228479&vc_url=https%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ffancl-y%2F5945.html"
          }
        }
      },
      {
        "delete": {
          "id": "product-yahoo-fancl-y-5945"
        }
      }
    ]
  }')

echo "結果: $MUTATION_RESULT"
echo ""

# 結果を確認
if echo "$MUTATION_RESULT" | grep -q '"results"'; then
    echo "✅ マージが完了しました！"
    echo ""
    echo "📊 結果:"
    echo "  - 楽天商品にJANコード (4908049456313) を追加"
    echo "  - Yahoo!商品のURLを楽天商品に追加"
    echo "  - Yahoo!商品を削除"
    echo ""
    echo "🌐 更新された商品を確認: https://suptia.com/products/fancl-d-3"
else
    echo "❌ エラーが発生しました"
    echo "$MUTATION_RESULT"
    exit 1
fi
