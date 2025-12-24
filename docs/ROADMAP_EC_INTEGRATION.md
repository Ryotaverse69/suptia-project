# EC統合ロードマップ

## 📅 タイムライン

### フェーズ1: MVP期（現在）

**期間**: 2025年10月〜12月

**実施内容**:

- ✅ Sanity CMSで商品データ管理
- ✅ 手動キュレーション（人気商品50-100個）
- ✅ 楽天市場API統合（無料枠）
- ⏳ コンテンツ作成（成分ガイド100記事）

**ECサイト対応**:

- 楽天市場（API） - 無料枠で開始 ✅
- Amazon（アフィリエイトリンクのみ、手動） ✅
  - **登録完了**: 2025年11月2日
  - **Store ID**: `suptia6902-22`
  - **認証期間**: 180日間（〜2026年4月30日）
- iHerb（アフィリエイトリンクのみ、手動）

**売上目標**: 初回売上達成（Amazon PA-API要件）

- **目標**: 180日以内に3件以上の売上
- **期限**: 2026年4月30日まで
- **戦略**: 商品詳細ページで手動アフィリエイトリンク追加

---

### フェーズ2: API統合期

**期間**: 2026年1月〜3月

**前提条件**:

- ✅ **Amazon PA-API売上要件クリア**（過去30日以内に3件以上の売上）
- ✅ 月間PV 10,000以上
- ✅ 安定したトラフィック

**実施内容**:

1. **Amazon PA-API有効化**
   - `.env.local`で`ENABLE_AMAZON_API=true`に変更
   - API認証情報を設定
   - 商品データ自動取得開始

2. **CJ Affiliate登録・API統合** ← ここで実施
   - CJ Affiliateアカウント作成
   - iHerbプログラム申請
   - Product Feed API統合
   - 自動同期開始

3. **価格比較機能強化**
   - 楽天 vs Amazon vs iHerb
   - 最安値自動検索
   - 価格履歴トラッキング

**ECサイト対応**:

- 楽天市場（API） - 継続
- **Amazon（PA-API）** - 新規有効化
- **iHerb（CJ Affiliate API）** - 新規統合
- Yahoo!ショッピング（API）検討

---

### フェーズ3: スケール期

**期間**: 2026年4月〜

**前提条件**:

- 月間PV 100,000以上
- 安定したアフィリエイト収益

**実施内容**:

- Rakuten Advertising、Impact追加（複数ネットワーク対応）
- Bright Data検討（リアルタイム価格・在庫）
- 自動同期頻度アップ（1日4回）
- 商品数1,000+に拡大

---

## 🎯 Amazon & CJ同時統合の理由

### なぜ同時に行うのか？

1. **売上要件クリア後の集中実装**
   - Amazon PA-APIは売上がないと使えない
   - CJ Affiliateも実績があった方が承認されやすい
   - 同じタイミングで統合すれば効率的

2. **価格比較の完成度**
   - Amazon + iHerb両方が揃って初めて「真の価格比較」
   - 片方だけでは比較の価値が低い

3. **実装コストの最適化**
   - API統合の作業をまとめて実施
   - テスト・デバッグも一気に完了

---

## 📋 Amazon & CJ統合チェックリスト

### 事前準備（今すぐ）

- [x] Amazon PA-API実装コード作成済み
- [x] CJ Affiliate実装コード作成済み
- [x] 申請用ドキュメント作成済み
- [x] **Amazonアソシエイト登録完了**（2025-11-02）
  - Store ID: `suptia6902-22`
  - 認証期間: 2026年4月30日まで
- [ ] アフィリエイト開示ページ作成（`/legal/affiliate`）
- [x] 商品データスキーマ確定
- [x] 環境変数テンプレート準備完了

### Amazon売上達成時（フェーズ2開始条件）

**目標**: 過去30日以内に3件以上の売上

**確認方法**:

```
Amazonアソシエイト管理画面
→ レポート
→ 注文レポート
→ 過去30日の売上件数を確認
```

**達成したら**:

- [ ] Amazon PA-APIアクセスキーを取得
- [ ] `.env.local`に設定
- [ ] `ENABLE_AMAZON_API=true`に変更
- [ ] テスト検索実行
- [ ] エラーハンドリング確認

### CJ Affiliate申請・統合（Amazon統合と同時）

**ステップ1: 申請**

- [ ] CJ Affiliateアカウント作成
- [ ] 申請フォーム記入（`CJ_AFFILIATE_APPLICATION_COPY_PASTE.md`参照）
- [ ] iHerbプログラムに申請
- [ ] 承認待ち（1-3営業日）

**ステップ2: API統合**

- [ ] API KeyとWebsite ID取得
- [ ] iHerb Advertiser ID確認
- [ ] `.env.local`に設定
  ```bash
  CJ_API_KEY=your_api_key
  CJ_WEBSITE_ID=your_website_id
  CJ_IHERB_ADVERTISER_ID=advertiser_id
  ```
- [ ] テスト検索実行
- [ ] エラーハンドリング確認

**ステップ3: 価格比較機能実装**

- [ ] 最安値自動検索機能
- [ ] 3ECサイト（楽天、Amazon、iHerb）の価格を一括取得
- [ ] UI実装（価格比較テーブル）
- [ ] Sanityに商品データ同期

**ステップ4: 自動化**

- [ ] Vercel Cronで毎日同期
- [ ] 価格履歴の記録
- [ ] 在庫切れ検知
- [ ] Slackに通知

---

## 💾 実装済みファイル（使用準備完了）

### Amazon PA-API

```
apps/web/src/lib/ec-adapters/amazon.ts
apps/web/src/lib/ec-adapters/index.ts
```

### CJ Affiliate API

```
apps/web/src/lib/integrations/cj-affiliate.ts
apps/web/src/lib/integrations/rakuten-advertising.ts
apps/web/src/lib/integrations/impact-radius.ts
apps/web/src/lib/integrations/affiliate-manager.ts
```

### ドキュメント

```
docs/AFFILIATE_API_GUIDE.md
docs/IHERB_INTEGRATION_SUMMARY.md
docs/CJ_AFFILIATE_APPLICATION.md
docs/CJ_AFFILIATE_APPLICATION_COPY_PASTE.md
```

---

## 📊 進捗トラッキング

### 現在の状態（2025年10月25日）

| 項目             | 状態      | 備考                         |
| ---------------- | --------- | ---------------------------- |
| 楽天市場API      | ✅ 完了   | 無料枠で運用中               |
| Amazon PA-API    | ⏳ 待機中 | 売上要件達成待ち             |
| CJ Affiliate     | ⏳ 待機中 | Amazon統合と同時実施         |
| 実装コード       | ✅ 完了   | すべて準備済み               |
| 申請ドキュメント | ✅ 完了   | コピペ用テンプレート作成済み |

### 次のマイルストーン

**🎯 マイルストーン1: Amazon初回売上達成**

- 目標: 過去30日以内に3件以上の売上
- 期限: 2025年12月末
- 達成後: フェーズ2開始（Amazon & CJ統合）

**🎯 マイルストーン2: API統合完了**

- Amazon PA-API統合
- CJ Affiliate統合
- 価格比較機能リリース
- 期限: 2026年1月末

**🎯 マイルストーン3: 自動化・スケール**

- 毎日自動同期
- 商品数1,000+
- 月間PV 100,000
- 期限: 2026年3月末

---

## 🔔 リマインダー

### Amazon売上達成時にやること

1. **即座に確認**

   ```
   Amazonアソシエイト管理画面で売上件数を確認
   → 3件以上なら次のステップへ
   ```

2. **PA-API申請**

   ```
   Product Advertising API
   → アクセスキー取得
   → シークレットキー取得
   ```

3. **環境変数設定**

   ```bash
   ENABLE_AMAZON_API=true
   AMAZON_ACCESS_KEY_ID=your_key
   AMAZON_SECRET_ACCESS_KEY=your_secret
   ```

4. **CJ Affiliate申請を同時開始**

   ```
   https://www.cj.com/
   → Sign Up → Publisher
   → docs/CJ_AFFILIATE_APPLICATION_COPY_PASTE.md を参照
   ```

5. **Slackに通知**（自分宛）
   ```
   "🎉 Amazon売上達成！フェーズ2開始の準備を進めます"
   ```

---

## 📝 メモ

### 2025年10月25日

**決定事項**:

- CJ Affiliate登録はAmazon PA-API統合と同時に実施
- 理由: 売上要件クリア後にまとめて実装する方が効率的
- 準備: 実装コードと申請ドキュメントはすべて完成済み

**次のアクション**:

1. Amazon初回売上を目指してコンテンツ強化
2. アフィリエイト開示ページ作成
3. 売上達成後、即座にフェーズ2へ移行

---

**最終更新**: 2025-10-25
**ステータス**: フェーズ1（MVP期）進行中
**次のマイルストーン**: Amazon初回売上達成
