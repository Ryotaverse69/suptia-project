# 商品スコア自動同期システム

## 概要

バックエンドで計算した商品のエビデンススコアと安全性スコアを、Sanityに自動的に同期するシステムです。

## 問題点（改善前）

- フロントエンドで毎回スコアを再計算していた
- Sanityに古いランクデータが残っていた
- バックエンドとフロントエンドでスコア計算ロジックが乖離していた
- スコアの更新が手動で管理されていなかった

## 解決策

### 1. **自動同期スクリプト**

[scripts/sync-product-scores.mjs](../scripts/sync-product-scores.mjs)

**機能：**

- 全商品を取得
- 各商品の成分データから以下を計算：
  - **エビデンススコア**（配合率ベース）
  - **安全性スコア**（副作用・相互作用を考慮）
  - **ランク**（S/A/B/C/D）
- Sanityに保存：
  - `scores.evidence`
  - `scores.safety`
  - `tierRatings.evidenceRank`
  - `tierRatings.safetyRank`

**使い方：**

```bash
# Dry-runモード（実際には保存しない）
node scripts/sync-product-scores.mjs --dry-run

# 特定の件数のみ処理
node scripts/sync-product-scores.mjs --limit=10 --dry-run

# 既存スコアを上書きして本番実行
node scripts/sync-product-scores.mjs --force

# 全商品を本番実行
node scripts/sync-product-scores.mjs --force
```

### 2. **GitHub Actions自動実行**

[.github/workflows/sync-scores.yml](../.github/workflows/sync-scores.yml)

**スケジュール：**

- 毎日深夜3時（JST）に自動実行
- 手動トリガーも可能（GitHubのActionsタブから）

**処理内容：**

1. リポジトリをチェックアウト
2. Node.js環境をセットアップ
3. 依存関係をインストール
4. 環境変数を設定（Secretsから）
5. スコア同期スクリプトを実行
6. 失敗時はIssueを自動作成

**必要なSecrets：**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`

### 3. **フロントエンドでの利用**

[apps/web/src/app/products/[slug]/page.tsx](../apps/web/src/app/products/[slug]/page.tsx)

**変更点：**

- Sanityから取得した `scores` と `tierRatings` を優先使用
- スコアが未設定の場合のみフロントエンドで計算
- エビデンスランクと安全性ランクは常にスコアから再計算（絶対評価）

```typescript
// エビデンスランクと安全性ランクは常にスコアから再計算（絶対評価）
if (updatedTierRatings && finalScores.evidence) {
  const evidenceRank = scoreToTierRank(finalScores.evidence);
  updatedTierRatings.evidenceRank = evidenceRank;
  console.log(
    `[エビデンスランク再計算] evidenceScore ${finalScores.evidence}点 → ${evidenceRank}ランク`,
  );
}

if (updatedTierRatings && finalScores.safety) {
  const safetyRank = scoreToTierRank(finalScores.safety);
  updatedTierRatings.safetyRank = safetyRank;
  console.log(
    `[安全性ランク再計算] safetyScore ${finalScores.safety}点 → ${safetyRank}ランク`,
  );
}
```

## スコア計算ロジック

### エビデンススコア

**計算方法：**

1. 各成分のエビデンスレベル（S/A/B/C/D）をスコアに変換
   - S: 95点
   - A: 85点
   - B: 75点
   - C: 65点
   - D: 50点
2. 成分の配合率で重み付け平均
3. 結果を四捨五入

**例（ビタミンC単体商品）：**

- ビタミンC: エビデンスレベル S（95点）
- 配合率: 100%
- **最終スコア: 95点 → Sランク**

### 安全性スコア

**計算方法：**

1. 基本スコア: 90点
2. ペナルティ:
   - 副作用あり: -5点/件（最大-20点）
   - 相互作用あり: -10点/件（最大-30点）
3. ボーナス:
   - ビタミン・ミネラル: +5点
4. 成分の配合率で重み付け平均

**例（ビタミンC）：**

- 基本スコア: 90点
- 副作用: 5件 × -5点 = -25点
- カテゴリボーナス（ビタミン）: +5点
- **最終スコア: 70点 → Bランク**

（注: 実際の副作用情報によってスコアは変動します）

### ランク変換

スコアからランクへの変換基準：

```typescript
function scoreToRank(score) {
  if (score >= 90) return "S"; // 90点以上
  if (score >= 80) return "A"; // 80〜89点
  if (score >= 70) return "B"; // 70〜79点
  if (score >= 60) return "C"; // 60〜69点
  return "D"; // 60点未満
}
```

## 運用フロー

### 日次自動同期

```
毎日深夜3時（JST）
    ↓
GitHub Actions起動
    ↓
全商品のスコアを再計算
    ↓
Sanityに保存
    ↓
フロントエンドで最新スコア表示
```

### 手動実行（必要時）

```bash
# ローカル環境で実行
npm run sync:scores

# または直接実行
node scripts/sync-product-scores.mjs --force
```

### 新商品追加時

新商品がSanityに追加されると：

1. 次回の自動同期（深夜3時）でスコアが計算される
2. または手動で `npm run sync:scores` を実行

## トラブルシューティング

### スコアが更新されない

**原因1: 既存スコアがある**

```bash
# --forceフラグで強制更新
node scripts/sync-product-scores.mjs --force
```

**原因2: 成分データがない**

- Sanityで商品に成分データが紐付いているか確認
- `ingredients` 配列が空でないか確認

**原因3: 環境変数が設定されていない**

```bash
# .env.localを確認
cat apps/web/.env.local | grep SANITY
```

### GitHub Actionsが失敗する

**確認事項：**

1. Secretsが正しく設定されているか
2. Sanity APIトークンが有効か
3. Actions実行ログを確認

## パフォーマンス

- **処理時間**: 約500商品で約5分
- **API制限**: 各商品間で100msの待機時間
- **Sanity API**: 無料プランで十分対応可能

## 今後の拡張

### 計画中の機能

1. **差分更新**: 変更があった商品のみ更新
2. **バッチ処理の最適化**: 並列処理で高速化
3. **通知機能**: Slack/Discord通知
4. **監視ダッシュボード**: スコア変動の可視化

### ログと監視

- GitHub Actionsのログで実行状況を確認
- 失敗時は自動でIssueが作成される
- Sanity Studioで直接データを確認可能

## 関連ドキュメント

- [CLAUDE.md](../CLAUDE.md) - プロジェクト全体のガイド
- [auto-scoring.ts](../apps/web/src/lib/auto-scoring.ts) - スコア計算ロジック
- [tier-ranking.ts](../apps/web/src/lib/tier-ranking.ts) - ランク計算ロジック

---

**最終更新**: 2025-11-13
**バージョン**: 1.0.0
