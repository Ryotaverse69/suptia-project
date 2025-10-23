# SSL証明書エラーの解決ガイド

## 現在の状況

✅ **2025年10月23日 更新: SSL証明書は正常に動作しています**

- 証明書有効期限: 2025年12月22日まで（60日間有効）
- 発行者: Let's Encrypt
- 検証状態: 正常

一部の環境でSSL証明書の警告が表示される場合は、ブラウザのキャッシュが原因の可能性があります。

## 即座にアクセス可能なURL

### 本番環境（推奨）

- https://suptia-project-ryotaverses-projects.vercel.app
- https://suptia-project-git-master-ryotaverses-projects.vercel.app

これらのURLは自動SSL証明書が有効で、すべての環境で安全にアクセスできます。

## ドメイン設定の確認手順

### 1. Vercel Dashboardでの確認

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. `suptia-project`プロジェクトを選択
3. Settings → Domainsタブを開く
4. suptia.comの設定を確認

### 2. DNSレコードの確認

現在の設定：

- Aレコード: 76.76.21.21（Vercel）
- CNAME: cname.vercel-dns.com（推奨）

### 3. SSL証明書の再発行

Vercel Dashboardから：

1. Settings → Domains
2. suptia.comの横の「...」メニュー
3. 「Renew Certificate」をクリック

## トラブルシューティング

### ブラウザ側の対処

#### 1. キャッシュクリア

```bash
# Chrome
chrome://settings/clearBrowserData

# Safari
開発メニュー → キャッシュを空にする

# Firefox
about:preferences#privacy → Cookieとサイトデータを消去
```

#### 2. DNSキャッシュクリア

**macOS:**

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Windows:**

```bash
ipconfig /flushdns
```

**Linux:**

```bash
sudo systemd-resolve --flush-caches
```

### SSL証明書の確認方法

#### 方法1: ブラウザで確認（簡単）

**Chrome/Edge:**

1. suptia.comにアクセス
2. URLバー左側の鍵アイコンをクリック
3. 「この接続は保護されています」→「証明書は有効です」をクリック
4. 証明書の詳細が表示される

**Safari:**

1. suptia.comにアクセス
2. URLバー左側の鍵アイコンをクリック
3. 「証明書を表示」をクリック

**Firefox:**

1. suptia.comにアクセス
2. URLバー左側の鍵アイコンをクリック
3. 「接続の詳細」→「詳細を表示」

#### 方法2: コマンドラインで確認

```bash
# クイックチェックスクリプトを実行
./check-ssl.sh

# または個別にチェック
# SSL証明書の詳細を確認
openssl s_client -connect suptia.com:443 -servername suptia.com < /dev/null

# 証明書の有効期限を確認
echo | openssl s_client -connect suptia.com:443 -servername suptia.com 2>/dev/null | openssl x509 -noout -dates

# 現在の証明書情報（2025年10月23日時点）
# ✅ 有効期限: 2025年12月22日まで
# ✅ 発行者: Let's Encrypt
# ✅ 検証結果: 正常
```

## Vercel CLIでの操作

```bash
# ドメイン一覧を確認
vercel domains ls

# エイリアスを再設定
vercel alias set suptia-project-ryotaverses-projects.vercel.app suptia.com

# SSL証明書を強制更新
vercel certs issue suptia.com
```

## 代替ソリューション

### Cloudflareの利用（推奨）

1. [Cloudflare](https://www.cloudflare.com/)にサインアップ
2. suptia.comドメインを追加
3. NameserverをCloudflareに変更
4. SSL/TLS設定を「Full」に設定
5. DNS設定でVercelを指定：
   - Type: CNAME
   - Name: @
   - Target: cname.vercel-dns.com

### メリット：

- 無料のSSL証明書
- DDoS保護
- CDNによる高速化
- 詳細なアナリティクス

## 環境変数の更新

`.env.local`を更新：

```env
# 一時的にVercelのURLを使用
NEXT_PUBLIC_SITE_URL=https://suptia-project-ryotaverses-projects.vercel.app
```

## チェックリスト

- [ ] Vercel Dashboardでドメイン設定を確認
- [ ] DNS設定が正しいか確認
- [ ] SSL証明書の有効期限を確認
- [ ] ブラウザキャッシュをクリア
- [ ] DNSキャッシュをクリア
- [ ] 別のブラウザ/デバイスでテスト
- [ ] Cloudflare経由での設定を検討

## サポート

問題が解決しない場合：

1. [Vercel Support](https://vercel.com/support)
2. [プロジェクトのIssues](https://github.com/Ryotaverse69/suptia-project/issues)
