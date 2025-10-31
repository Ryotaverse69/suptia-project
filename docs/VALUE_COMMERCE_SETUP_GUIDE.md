# バリューコマース セットアップガイド

## 🎉 承認おめでとうございます！

バリューコマースの審査に合格しました。これからYahoo!ショッピングのアフィリエイトリンクを設定していきます。

---

## 📋 セットアップ手順

### ステップ1: Yahoo!ショッピングと提携申請

1. **バリューコマース管理画面にログイン**
   - https://aff.valuecommerce.ne.jp/

2. **広告主検索**
   - 「広告」→「広告検索」をクリック
   - 検索窓に「Yahoo!ショッピング」と入力

3. **提携申請**
   - 「Yahoo!ショッピング」を選択
   - 「広告作成」ボタンをクリック
   - 提携申請ボタンをクリック

4. **承認待ち**
   - 通常は即時承認または数時間以内に承認される
   - メールで通知が届く

---

### ステップ2: SID・PIDの取得

Yahoo!ショッピングとの提携が承認されたら、SIDとPIDを取得します。

#### SID（サイトID）の取得方法

1. バリューコマース管理画面にログイン
2. 画面右上の「サイト管理」をクリック
3. 登録したサイト（Suptia）の詳細を表示
4. **SID**が表示される（例: `s12345678`）

#### PID（広告ID）の取得方法

1. 「広告」→「提携状況」をクリック
2. 「Yahoo!ショッピング」を選択
3. 「広告作成」→「MyLink」をクリック
4. 画面上部に表示される**PID**をコピー（例: `p12345678`）

**重要**: SIDとPIDは以下の形式です：

```
SID: s12345678（数字8桁）
PID: p12345678（数字8桁）
```

---

### ステップ3: 環境変数に追加

#### ローカル環境（`.env.local`）

`apps/web/.env.local` に以下を追加：

```bash
# バリューコマース（Yahoo!ショッピング）
VALUE_COMMERCE_SID=s12345678
VALUE_COMMERCE_PID=p12345678
```

**注意**: 実際の値に置き換えてください。

#### Vercel環境

1. Vercelダッシュボードにログイン
2. Suptiaプロジェクトを選択
3. 「Settings」→「Environment Variables」をクリック
4. 以下の環境変数を追加：

| Name               | Value     | Environment |
| ------------------ | --------- | ----------- |
| VALUE_COMMERCE_SID | s12345678 | Production  |
| VALUE_COMMERCE_PID | p12345678 | Production  |

5. 「Save」をクリック
6. デプロイを再実行（Deployments → Redeploy）

---

### ステップ4: アフィリエイトリンクの実装

#### Yahoo!アダプターの更新

`apps/web/src/lib/ec-adapters/yahoo.ts` にアフィリエイトリンク生成機能を追加します。

```typescript
// バリューコマースのアフィリエイトリンク生成
function generateValueCommerceUrl(itemUrl: string): string {
  const sid = process.env.VALUE_COMMERCE_SID || "";
  const pid = process.env.VALUE_COMMERCE_PID || "";

  if (!sid || !pid) {
    console.warn("VALUE_COMMERCE_SID or VALUE_COMMERCE_PID not set");
    return itemUrl; // アフィリエイトなしのリンクを返す
  }

  // バリューコマースのMyLink形式
  const encodedUrl = encodeURIComponent(itemUrl);
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${sid}&pid=${pid}&vc_url=${encodedUrl}`;
}
```

#### 同期スクリプトの更新

`scripts/sync-yahoo-products.mjs` でアフィリエイトリンクを使用：

```javascript
const affiliateUrl = generateValueCommerceUrl(item.url);

const productData = {
  // ... 既存のフィールド
  affiliateUrl: affiliateUrl,
  prices: [
    {
      amount: parseFloat(item.price),
      currency: "JPY",
      source: "yahoo",
      url: affiliateUrl, // アフィリエイトリンクを使用
      // ... その他のフィールド
    },
  ],
};
```

---

### ステップ5: 既存データの更新

既にSanityに登録されているYahoo!商品にアフィリエイトリンクを追加します。

#### 更新スクリプトの実行

```bash
# Yahoo!商品のアフィリエイトリンクを更新
npx tsx scripts/update-yahoo-affiliate-links.mjs
```

---

### ステップ6: 動作確認

#### テストクリック

1. ローカル環境で開発サーバーを起動

   ```bash
   npm run dev
   ```

2. 商品詳細ページを開く

   ```
   http://localhost:3000/products/[slug]
   ```

3. Yahoo!ショッピングのリンクをクリック
   - URLが `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=...` で始まることを確認
   - リダイレクト後、正しいYahoo!商品ページに遷移することを確認

4. バリューコマース管理画面で確認
   - 「レポート」→「クリックレポート」でクリック数を確認
   - 数時間後にクリック数が反映される

---

## 🔍 トラブルシューティング

### Q1. アフィリエイトリンクが生成されない

**A**: 環境変数を確認

```bash
# ローカル環境
echo $VALUE_COMMERCE_SID
echo $VALUE_COMMERCE_PID

# または.env.localを確認
cat apps/web/.env.local | grep VALUE_COMMERCE
```

### Q2. リンククリック後に404エラー

**A**: URLエンコーディングを確認

- `encodeURIComponent()` が正しく適用されているか
- 元のYahoo!URLが正しいか

### Q3. クリック数が反映されない

**A**: 以下を確認

- SIDとPIDが正しいか
- リンクのURL形式が正しいか（`https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=...`）
- クッキーが有効になっているか
- 数時間〜24時間待つ（反映に時間がかかる場合がある）

---

## 📊 成果確認

### バリューコマース管理画面

1. 「レポート」→「成果レポート」
2. 期間を選択
3. Yahoo!ショッピングの成果を確認

### 報酬発生条件

- **報酬率**: 商品価格の1〜2%（商品カテゴリによる）
- **Cookie有効期間**: 89日間
- **最低支払額**: 1,000円

---

## ✅ チェックリスト

承認後に以下を確認してください：

- [ ] Yahoo!ショッピングと提携申請完了
- [ ] Yahoo!ショッピングとの提携が承認された
- [ ] SIDを取得した（`s12345678`形式）
- [ ] PIDを取得した（`p12345678`形式）
- [ ] `.env.local`にSIDとPIDを追加した
- [ ] Vercelの環境変数にSIDとPIDを追加した
- [ ] Yahoo!アダプターにアフィリエイトリンク生成機能を実装した
- [ ] 既存のYahoo!商品データにアフィリエイトリンクを追加した
- [ ] テストクリックでリンクが正常に動作することを確認した
- [ ] バリューコマース管理画面でクリック数を確認した

---

## 📞 サポート

**バリューコマース カスタマーサポート**

- 電話: `03-5771-4754`（平日10:00〜18:00）
- メール: 管理画面の「お問い合わせ」フォーム

---

**最終更新日**: 2025年10月30日
**作成者**: Suptiaプロジェクトチーム
