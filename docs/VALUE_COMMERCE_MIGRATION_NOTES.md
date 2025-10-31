# バリューコマース移行ノート

## 📋 環境変数の変更点

### ❌ 削除された環境変数

```bash
# 旧方式（削除）
YAHOO_AFFILIATE_ID=...
```

**理由**: Yahoo!ショッピングのアフィリエイトは、バリューコマース経由で行うため、専用の`YAHOO_AFFILIATE_ID`は不要になりました。

---

### ✅ 新しい環境変数

```bash
# 新方式（バリューコマース）
VALUE_COMMERCE_SID=3756713
VALUE_COMMERCE_PID=892228479
```

**説明**:

- `VALUE_COMMERCE_SID`: バリューコマースのサイトID
- `VALUE_COMMERCE_PID`: Yahoo!ショッピング広告のプログラムID

---

## 🔄 アフィリエイトリンク生成方式の変更

### 旧方式（非推奨）

```typescript
// 固定のアフィリエイトIDを使用
const affiliateUrl = `${YAHOO_AFFILIATE_ID}${encodeURIComponent(itemUrl)}`;
```

**問題点**:

- アフィリエイトIDの形式が不明確
- Yahoo!ショッピング専用の仕組みで拡張性がない

---

### 新方式（推奨）✅

```typescript
// バリューコマースのMyLink形式で動的生成
function generateValueCommerceUrl(originalUrl: string): string {
  const encodedUrl = encodeURIComponent(originalUrl);
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${VALUE_COMMERCE_SID}&pid=${VALUE_COMMERCE_PID}&vc_url=${encodedUrl}`;
}
```

**メリット**:

- 標準的なアフィリエイトリンク形式
- バリューコマース管理画面でクリック数・成果を追跡可能
- 他のECサイト（楽天市場など）にも拡張可能

---

## 📊 生成されるURLの比較

### 旧方式のURL例（非推奨）

```
（形式不明）
```

### 新方式のURL例 ✅

```
https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3756713&pid=892228479&vc_url=https%3A%2F%2Fshopping.yahoo.co.jp%2Fproducts%2Fz1234567890
```

**構造**:

- `sid=3756713`: サイトID
- `pid=892228479`: プログラムID（Yahoo!ショッピング）
- `vc_url=...`: 元のYahoo!商品URL（エンコード済み）

---

## 🛠️ 移行チェックリスト

### ローカル環境（`.env.local`）

- [x] `VALUE_COMMERCE_SID=3756713` を追加
- [x] `VALUE_COMMERCE_PID=892228479` を追加
- [x] ~~`YAHOO_AFFILIATE_ID`を削除~~（元から不要）

### Vercel環境（本番）

- [ ] `VALUE_COMMERCE_SID=3756713` を追加
- [ ] `VALUE_COMMERCE_PID=892228479` を追加

### コード

- [x] `YahooAdapter`に`generateValueCommerceUrl()`メソッドを実装
- [x] コンストラクタに`valueCommerceSid`と`valueCommercePid`を追加
- [x] `sync-yahoo-products.mjs`を更新

### データ

- [x] 既存Yahoo!商品33件にアフィリエイトリンクを追加

---

## 📈 成果確認方法

### バリューコマース管理画面

1. https://aff.valuecommerce.ne.jp/ にログイン
2. 「レポート」→「クリックレポート」
   - クリック数が反映される（数時間後）
3. 「レポート」→「成果レポート」
   - 購入が発生した場合、成果として記録される

### 報酬率

- **Yahoo!ショッピング**: 商品価格の1〜2%
- **Cookie有効期間**: 89日間
- **最低支払額**: 1,000円
- **支払日**: 翌々月15日

---

## 🔍 トラブルシューティング

### Q: アフィリエイトリンクが生成されない

**A**: 環境変数を確認

```bash
# .env.localの内容を確認
cat apps/web/.env.local | grep VALUE_COMMERCE

# 正しい出力:
VALUE_COMMERCE_SID=3756713
VALUE_COMMERCE_PID=892228479
```

### Q: クリック数が反映されない

**A**: 以下を確認

1. SIDとPIDが正しいか
2. URLの形式が正しいか（`https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=...`）
3. 数時間〜24時間待つ（反映に時間がかかる）

### Q: 旧方式のアフィリエイトリンクが残っている

**A**: 以下のコマンドで更新

```bash
npx tsx scripts/update-yahoo-affiliate-links.mjs
```

---

## 📚 関連ドキュメント

- [VALUE_COMMERCE_SETUP_GUIDE.md](VALUE_COMMERCE_SETUP_GUIDE.md) - セットアップガイド
- [VALUE_COMMERCE_QUICKSTART.md](VALUE_COMMERCE_QUICKSTART.md) - クイックスタート
- [VALUE_COMMERCE_BANK_ACCOUNT_GUIDE.md](VALUE_COMMERCE_BANK_ACCOUNT_GUIDE.md) - 屋号口座登録

---

**最終更新日**: 2025年10月30日
**作成者**: Suptiaプロジェクトチーム
