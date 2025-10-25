# 🔒 GitHub Secrets設定ガイド

Suptiaプロジェクトの自動化を完全に機能させるため、GitHub Secretsに環境変数を設定する必要があります。

## 📋 必要なSecrets一覧

### 必須のSecrets（最優先）

これらのSecretsがないと、基本的な機能が動作しません：

| Secret名            | 説明                     | 取得方法                                                                         |
| ------------------- | ------------------------ | -------------------------------------------------------------------------------- |
| `SANITY_PROJECT_ID` | SanityプロジェクトID     | [Sanity Dashboard](https://www.sanity.io/manage) → プロジェクト選択 → Project ID |
| `SANITY_DATASET`    | Sanityデータセット名     | 通常は `production`                                                              |
| `SANITY_API_TOKEN`  | Sanity APIトークン       | 下記の「Sanity APIトークン作成方法」参照                                         |
| `VERCEL_TOKEN`      | Vercelデプロイ用トークン | [Vercel Settings](https://vercel.com/account/tokens) → Create Token              |
| `VERCEL_ORG_ID`     | Vercel組織ID/スコープID  | 下記の「Vercel組織ID取得方法」参照                                               |
| `VERCEL_PROJECT_ID` | VercelプロジェクトID     | Vercelプロジェクト → Settings → General → Project ID                             |

### オプションのSecrets（推奨）

これらは特定の機能を使用する場合に必要：

| Secret名                        | 説明                       | 用途                       |
| ------------------------------- | -------------------------- | -------------------------- |
| `VERCEL_TEAM_ID`                | VercelチームID             | チーム環境でのデプロイ時   |
| `SLACK_WEBHOOK`                 | Slack通知用WebhookURL      | デプロイ通知を受け取る場合 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID        | アクセス解析を行う場合     |
| `AMAZON_ACCESS_KEY_ID`          | Amazon PA-API キーID       | 価格同期機能（将来実装）   |
| `AMAZON_SECRET_ACCESS_KEY`      | Amazon PA-API シークレット | 価格同期機能（将来実装）   |
| `RAKUTEN_APPLICATION_ID`        | 楽天API アプリID           | 価格同期機能（将来実装）   |

## 🚀 設定手順

### Step 1: GitHubリポジトリのSecretsページを開く

1. GitHubリポジトリ（[https://github.com/Ryotaverse69/suptia-project](https://github.com/Ryotaverse69/suptia-project)）を開く
2. 上部メニューの **Settings** をクリック
3. 左側メニューの **Secrets and variables** → **Actions** をクリック

### Step 2: Sanity APIトークンの作成

1. [Sanity管理画面](https://www.sanity.io/manage)にログイン
2. プロジェクトを選択
3. **API** タブをクリック
4. **Tokens** セクションで **Add API token** をクリック
5. 以下の設定でトークンを作成：
   - **Name**: `GitHub Actions`
   - **Permissions**: `Editor`（読み書き可能）
6. トークンをコピー（**重要：この画面を閉じると二度と表示されません**）

### Step 3: Vercel組織ID（ORG_ID）の取得

#### 方法1: Vercel CLIを使用（推奨）

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# プロジェクト情報を表示
vercel whoami
```

このコマンドで表示される情報：

- **個人アカウントの場合**: `Scope` の値が `VERCEL_ORG_ID`
- **チームの場合**: `Team` のIDが `VERCEL_ORG_ID`

#### 方法2: Vercelダッシュボードから確認

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択
3. **Settings** → **General** をクリック
4. ページのURLを確認:
   - 個人: `https://vercel.com/[username]/[project]/settings`
   - チーム: `https://vercel.com/[team-slug]/[project]/settings`
5. `.vercel/project.json`ファイルがある場合は、その中の`orgId`が該当

#### 方法3: APIで確認

```bash
# Vercel APIを使用（VERCEL_TOKENが必要）
curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  https://api.vercel.com/v2/user
```

レスポンスの`id`フィールドが個人アカウントのORG_IDです。

**📝 注意**:

- **VERCEL_ORG_ID**: 個人の場合はUser Scope ID、チームの場合はTeam ID
- **VERCEL_PROJECT_ID**: プロジェクト固有のID（プロジェクト設定画面で確認可能）
- 両方とも`.vercel/project.json`ファイルがある場合は、そこから確認可能

#### 🎯 このプロジェクトの場合

`.vercel/project.json`ファイルに既に値があります：

```json
{
  "projectId": "prj_NWkcnXBay0NvP9FEZUuXAICo0514", // ← VERCEL_PROJECT_ID
  "orgId": "team_RIwNpcvXKq5GcbPbIvWObT5I", // ← VERCEL_ORG_ID
  "projectName": "suptia-project"
}
```

これらの値をそのままGitHub Secretsに設定してください。

### Step 4: Vercelトークンの作成

1. [Vercel Settings](https://vercel.com/account/tokens)にアクセス
2. **Create Token** をクリック
3. トークン名を入力（例：`suptia-github-actions`）
4. スコープはデフォルトのままでOK
5. **Create** をクリックしてトークンをコピー

### Step 5: GitHubにSecretsを追加

各Secretごとに以下の手順を繰り返します：

1. **New repository secret** ボタンをクリック
2. **Name** フィールドにSecret名を入力（例：`SANITY_PROJECT_ID`）
3. **Secret** フィールドに値を貼り付け
4. **Add secret** をクリック

### Step 6: 設定の確認

すべてのSecretsを追加したら、以下のコマンドで確認：

```bash
# GitHub CLIがインストールされている場合
gh secret list

# または、GitHub ActionsのWorkflowを手動実行してテスト
# Actions → Skills Automation → Run workflow
```

## 📝 .env.localファイルとの対応

ローカル開発用の`.env.local`ファイルと、GitHub Secretsの対応関係：

```bash
# .env.local の内容
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id  # → SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production          # → SANITY_DATASET
SANITY_API_TOKEN=your_api_token               # → SANITY_API_TOKEN

# 追加で必要なもの（GitHub Secretsのみ）
VERCEL_TOKEN=...                              # Vercel自動デプロイ用
VERCEL_ORG_ID=...                             # Vercel組織ID
VERCEL_PROJECT_ID=...                         # VercelプロジェクトID
```

## 🔍 トラブルシューティング

### エラー: "Error: SANITY_API_TOKEN is not set"

**原因**: Sanity APIトークンがGitHub Secretsに設定されていない

**解決方法**:

1. 上記の手順でSanity APIトークンを作成
2. GitHub Secretsに`SANITY_API_TOKEN`として追加

### エラー: "Error: Vercel deployment failed"

**原因**: Vercel関連のSecretsが不足

**解決方法**:

1. `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`がすべて設定されているか確認
2. Vercelプロジェクトの設定画面で正しいIDを確認

### エラー: "Permission denied"

**原因**: トークンの権限不足

**解決方法**:

1. Sanity APIトークンは`Editor`権限が必要
2. Vercelトークンはフルアクセス権限が必要

## ✅ 設定完了チェックリスト

設定が完了したら、以下を確認：

- [ ] `SANITY_PROJECT_ID` を追加した
- [ ] `SANITY_DATASET` を追加した
- [ ] `SANITY_API_TOKEN` を追加した
- [ ] `VERCEL_TOKEN` を追加した
- [ ] `VERCEL_ORG_ID` を追加した
- [ ] `VERCEL_PROJECT_ID` を追加した
- [ ] GitHub ActionsのWorkflowが緑色（成功）になる

## 🎉 設定完了後にできること

GitHub Secretsの設定が完了すると、以下が自動化されます：

1. **プッシュ時の自動検証**
   - 記事の薬機法チェック
   - コンプライアンス検証

2. **プルリクエストの自動レビュー**
   - 記事品質の自動評価
   - コメントで結果を通知

3. **masterブランチへの自動デプロイ**
   - ビルド → テスト → デプロイ
   - Slack通知（設定した場合）

4. **週次メンテナンス**
   - 価格分析の自動実行
   - SEO最適化の実行

## 📚 参考リンク

- [GitHub Secrets公式ドキュメント](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Sanity APIトークン管理](https://www.sanity.io/docs/http-auth)
- [Vercel APIトークン](https://vercel.com/docs/rest-api#authentication)
- [GitHub Actions環境変数](https://docs.github.com/en/actions/learn-github-actions/environment-variables)

## 🆘 サポート

設定に問題がある場合：

1. このガイドの手順を再確認
2. `.github/workflows/`のワークフローファイルを確認
3. GitHub ActionsのログでエラーメッセージをチェックGitHub Issueで質問

---

**最終更新**: 2025年1月
**バージョン**: 1.0.0
