# Product Matcher

複数ECサイトの商品を正確にマッチング

## 概要

**product-matcher** は、Amazon、楽天、iHerbなど複数のECサイトから取得した商品データを照合し、同一商品を識別するツールです。

## 主な機能

- ✅ **JAN一致**: JANコード（13桁）による完全一致マッチング（信頼度: 1.0）
- ✅ **ASIN一致**: Amazon ASINによる完全一致マッチング（信頼度: 0.95）
- ✅ **タイトル類似度**: Cosine類似度によるタイトルマッチング（信頼度: 動的）
- ✅ **信頼度スコア**: 0.0〜1.0のスコアで信頼度を算出
- ✅ **未マッチ商品リスト**: マッチしなかった商品と候補を出力
- ✅ **マッチング精度レポート**: 統計情報と詳細レポート生成

## マッチング戦略

### 優先順位（autoモード）

1. **JAN一致** → 信頼度 1.0（最も確実）
2. **ASIN一致** → 信頼度 0.95（高信頼）
3. **タイトル類似度** → 信頼度は類似度スコア（0.92以上推奨）

### タイトル正規化

タイトルマッチングでは以下の正規化を行います：

- ブランド名を除去（NOW Foods、Nature Madeなど）
- 容量を除去（250粒、1000mgなど）
- 記号・特殊文字を除去

**例**:

```
元: "NOW Foods ビタミンC 1000mg 250粒【高品質】"
↓
正規化後: "ビタミンc 高品質"
```

## 使用方法

### 基本的な使い方

```bash
# 基本的なマッチング
npx tsx .claude/skills/product-matcher/index.ts \
  --source amazon-products.json \
  --target rakuten-products.json

# 閾値を調整
npx tsx .claude/skills/product-matcher/index.ts \
  --source amazon.json \
  --target rakuten.json \
  --threshold 0.85
```

### オプション

| オプション         | 短縮形 | 説明                                      | デフォルト |
| ------------------ | ------ | ----------------------------------------- | ---------- |
| `--source`         | `-s`   | マッチング元の商品データファイル（必須）  | -          |
| `--target`         | `-t`   | マッチング先の商品データファイル（必須）  | -          |
| `--threshold`      | -      | 類似度の閾値（0.0-1.0）                   | `0.92`     |
| `--strategy`       | -      | マッチング戦略                            | `auto`     |
| `--format`         | `-f`   | 出力フォーマット（console/json/markdown） | `console`  |
| `--save`           | `-o`   | レポートをファイルに保存                  | -          |
| `--no-review-list` | -      | 未マッチ商品のレビューリストを生成しない  | -          |
| `--help`           | `-h`   | ヘルプを表示                              | -          |

### マッチング戦略

- `auto`: JAN → ASIN → Titleの順で自動マッチング（推奨）
- `jan-only`: JANコードのみでマッチング
- `asin-only`: ASINのみでマッチング
- `title-only`: タイトル類似度のみでマッチング
- `all`: すべての方法を並行実行（重複を許容）

## 商品データフォーマット

### 必須フィールド

```json
{
  "id": "unique-product-id",
  "title": "NOW Foods ビタミンC 1000mg 250粒",
  "source": "amazon"
}
```

### 推奨フィールド

```json
{
  "id": "unique-product-id",
  "title": "NOW Foods ビタミンC 1000mg 250粒",
  "brand": "NOW Foods",
  "jan": "0123456789012",
  "asin": "B000123456",
  "price": 1980,
  "currency": "JPY",
  "source": "amazon",
  "url": "https://amazon.co.jp/...",
  "imageUrl": "https://m.media-amazon.com/..."
}
```

## 信頼度レベル

| レベル     | 信頼度範囲 | 説明                   |
| ---------- | ---------- | ---------------------- |
| **High**   | ≥0.92      | 同一商品とみなして良い |
| **Medium** | 0.85-0.91  | 手動レビュー推奨       |
| **Low**    | 0.75-0.84  | 要確認                 |

## 出力例

### コンソール出力

```
┌─────────────────────────────────────────────────────────┐
│         Product Matcher Report                          │
├─────────────────────────────────────────────────────────┤
│ Source: amazon-products.json                            │
│ Target: rakuten-products.json                           │
│ Strategy: AUTO                                          │
│ Threshold: 0.92                                         │
│ Status: GOOD                                            │
└─────────────────────────────────────────────────────────┘

📊 Statistics
  Source Products: 100
  Target Products: 95
  Matched: 87 (87.0%)
  Unmatched: 13
  Average Confidence: 94.2%

🔍 Match Type Breakdown
  JAN Matches: 45
  ASIN Matches: 22
  Title Matches: 20

📈 Confidence Level Breakdown
  High (≥0.92): 75
  Medium (0.85-0.91): 10
  Low (0.75-0.84): 2
```

### 未マッチ商品レビューリスト

`unmatched-review-list-<timestamp>.json`ファイルが自動生成されます：

```json
[
  {
    "product": {
      "id": "amazon-123",
      "title": "マイナーブランド ビタミンD 500粒",
      "source": "amazon"
    },
    "reason": "マッチング候補が見つかりません",
    "candidates": []
  },
  {
    "product": {
      "id": "amazon-456",
      "title": "NOW Foods オメガ3 1000mg",
      "source": "amazon"
    },
    "reason": "類似度が閾値（0.92）未満（最高: 0.88）",
    "candidates": [
      {
        "product": {
          "id": "rakuten-789",
          "title": "【楽天1位】NOW オメガ3フィッシュオイル 1000mg",
          "source": "rakuten"
        },
        "confidence": 0.88,
        "matchType": "title"
      }
    ]
  }
]
```

## ワークフロー例

### 1. API連携後の商品同定

```bash
# Amazonと楽天の商品データをマッチング
npx tsx .claude/skills/product-matcher/index.ts \
  --source amazon-products.json \
  --target rakuten-products.json \
  --save match-report.md

# レビューリストを確認
cat unmatched-review-list-*.json

# 手動レビュー後、Sanityに保存
# （未実装：--save-to-sanityオプションで自動保存予定）
```

### 2. 定期的なマッチング精度チェック

```bash
# 毎日の価格同期時にマッチング精度をモニタリング
npx tsx .claude/skills/product-matcher/index.ts \
  --source products-today.json \
  --target products-yesterday.json \
  --format json \
  --save daily-match-report.json
```

## トラブルシューティング

### Q: マッチ率が低い（50%以下）

A: 以下を確認してください：

1. **JANコードが存在するか**:

   ```bash
   # JANコード保有率を確認
   jq '[.[] | select(.jan != null)] | length' amazon-products.json
   ```

2. **タイトルが正規化されているか**:
   - ブランド名、容量が適切に除去されているか確認

3. **閾値を下げる**:
   ```bash
   --threshold 0.85  # デフォルト: 0.92
   ```

### Q: 誤マッチが多い

A: 閾値を上げてください：

```bash
--threshold 0.95  # より厳格に
```

### Q: タイトル類似度の計算が遅い

A: JANまたはASINのみでマッチングしてください：

```bash
--strategy jan-only
```

## 今後の拡張予定

- [ ] Sanity連携（`--save-to-sanity`オプション）
- [ ] 機械学習による商品分類
- [ ] 画像類似度によるマッチング
- [ ] バッチ処理の並列化

## ライセンス

MIT License

## 作成者

Ryota - Suptia Project
