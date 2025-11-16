# 🤖 Suptia 完全自動化システム

## 📊 概要

Suptiaは毎日深夜3時（JST）に自動的に以下を実行します：

1. **価格同期** - 楽天市場 & Yahoo!ショッピングから最新価格を取得
2. **ランク計算** - 336商品の5つの比較軸でランクを自動計算
3. **フロントエンド更新** - ISR APIでキャッシュを無効化し、最新データを反映

## 🎯 実装内容

### 1. GitHub Actions ワークフロー

**ファイル**: `.github/workflows/sync-products.yml`

**実行タイミング**:

- 毎日深夜3時（JST）= UTC 18:00
- 手動実行も可能

**処理フロー**:

```
┌─────────────────────────────────────────────────┐
│ 1. 楽天商品同期 (46秒)                            │
│    - 最新価格を取得                              │
│    - Sanity CMSに保存                           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. Yahoo商品同期 (47秒)                          │
│    - 最新価格を取得                              │
│    - Sanity CMSに保存                           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. ランク計算 (49秒)                             │
│    - 5つの比較軸でランク計算                      │
│    - S/A/B/C/Dランク決定                        │
│    - ISR API呼び出し ← ★重要★                    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. 同期完了通知 (3秒)                            │
│    - 結果確認                                   │
│    - エラー通知（失敗時）                         │
└─────────────────────────────────────────────────┘
```

### 2. ISR API（On-Demand ISR）

**ファイル**: `apps/web/src/app/api/revalidate/route.ts`

**機能**:

- Next.jsの静的ページキャッシュを無効化
- 次回アクセス時に最新データで再生成
- セキュリティ: `REVALIDATE_SECRET`による認証

**エンドポイント**:

- GET: ヘルスチェック
- POST: キャッシュ無効化

## 🔧 環境変数設定

### GitHub Secrets

以下のシークレットが必要です：

```
SANITY_API_TOKEN
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
RAKUTEN_APPLICATION_ID
RAKUTEN_AFFILIATE_ID
YAHOO_SHOPPING_CLIENT_ID
YAHOO_AFFILIATE_ID
REVALIDATE_SECRET
```

### Vercel 環境変数

以下の環境変数が必要です：

```
REVALIDATE_SECRET=F/f461KisbTGf3NmmzHeqXeOSSsP5WxtTZcQZ1b40do=
```

**重要**: Production, Preview, Development すべてに設定

## 📈 監視方法

### 1. GitHub Actionsの実行履歴

```bash
# 最新の実行状況を確認
gh run list --workflow=sync-products.yml --limit 5

# 特定の実行を詳細表示
gh run view <RUN_ID>

# ログを確認
gh run view <RUN_ID> --log
```

### 2. ISR APIの動作確認

```bash
# ヘルスチェック
curl -X GET "https://suptia.com/api/revalidate?secret=YOUR_SECRET" | jq '.'

# 手動で再検証
curl -X POST "https://suptia.com/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/products"}' | jq '.'
```

## 🚨 トラブルシューティング

### ワークフローが失敗した場合

1. **GitHub Actionsの実行ログを確認**

   ```bash
   gh run list --workflow=sync-products.yml --limit 1
   gh run view <RUN_ID> --log
   ```

2. **よくあるエラー**:
   - API認証エラー → GitHub Secretsを確認
   - ランク計算失敗 → Sanityのデータを確認
   - ISR API失敗 → Vercel環境変数を確認

### ISR APIが404を返す場合

1. **Vercelのデプロイ状況を確認**
   - https://vercel.com/dashboard
   - 最新のコミットがデプロイされているか

2. **環境変数を確認**
   - `REVALIDATE_SECRET`が設定されているか
   - Production環境にも適用されているか

3. **再デプロイ**
   - キャッシュをクリアして再デプロイ

## 🎊 成功の確認

ワークフローが成功すると、以下のメッセージが表示されます：

```
✅ すべての同期が成功しました
   - 価格データ更新: ✓
   - ランク計算: ✓
   - フロントエンド更新: ✓
```

## 📅 次回実行予定

次回の自動実行:

```bash
# cronスケジュール: '0 18 * * *' (UTC)
# = 毎日深夜3時（JST）
```

手動実行:

```bash
gh workflow run sync-products.yml
```

## 🔄 メンテナンス

### 定期メンテナンス（不要）

自動化により、以下は**不要**になりました：

- ❌ 手動での価格更新
- ❌ 手動でのランク計算
- ❌ 手動でのデプロイ

### 監視推奨（週1回）

- GitHub Actionsの実行履歴を確認
- エラー通知がないか確認
- 商品数・価格データの妥当性を確認

---

**最終更新**: 2025-11-16
**ステータス**: ✅ 完全自動化達成
**次回実行**: 毎日深夜3時（JST）
