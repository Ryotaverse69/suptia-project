# GitHub Actions 完全自動化セットアップガイド

## 概要

成分量データの抽出・更新を完全自動化するGitHub Actionsワークフローのセットアップ手順です。

**実行スケジュール**:

- **自動実行**: 毎週日曜日 午前3時（JST）
- **手動実行**: いつでもGitHub UIから実行可能

---

## 📋 セットアップ手順

### ステップ1: GitHub Secretsの設定

以下の環境変数をGitHub Secretsに登録する必要があります。

#### 1-1. GitHubリポジトリページに移動

```
https://github.com/Ryotaverse69/suptia-project/settings/secrets/actions
```

#### 1-2. 必須のSecretsを追加

「New repository secret」をクリックして、以下を追加：

| Secret名                        | 値                               | 説明                           |
| ------------------------------- | -------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `fny3jdcg`                       | SanityプロジェクトID           |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`                     | Sanityデータセット             |
| `SANITY_API_TOKEN`              | （Sanityダッシュボードから取得） | Sanity API書き込み権限トークン |

**⚠️ 重要**: `SANITY_API_TOKEN`は**書き込み権限（Editor）**が必要です。

#### 1-3. Sanity APIトークンの取得方法

1. Sanityダッシュボードにログイン: https://www.sanity.io/manage
2. プロジェクト「Suptia」を選択
3. 「API」タブ → 「Tokens」セクション
4. 「Add API token」をクリック
5. 以下の設定で作成：
   - **Name**: `GitHub Actions (Ingredient Update)`
   - **Permissions**: `Editor` （書き込み権限）
6. 生成されたトークンをコピーして、GitHub Secretsに登録

---

### ステップ2: オプション設定（Slack通知）

更新失敗時にSlack通知を受け取りたい場合：

#### 2-1. Slack Incoming Webhookの作成

1. Slackワークスペースにログイン
2. https://api.slack.com/apps にアクセス
3. 「Create New App」→「From scratch」
4. App名: `Suptia Notifications`
5. 「Incoming Webhooks」を有効化
6. 「Add New Webhook to Workspace」
7. 通知先チャンネルを選択（例: `#suptia-alerts`）
8. Webhook URLをコピー

#### 2-2. GitHub Secretsに追加

| Secret名            | 値                               | 説明                      |
| ------------------- | -------------------------------- | ------------------------- |
| `SLACK_WEBHOOK_URL` | （Slackから取得したWebhook URL） | Slack通知用（オプション） |

---

## 🚀 使い方

### 自動実行（推奨）

設定後、毎週日曜日午前3時（JST）に自動的に実行されます。何もする必要はありません。

### 手動実行

1. GitHubリポジトリページに移動
2. 「Actions」タブをクリック
3. 左サイドバーから「Update Missing Ingredient Amounts」を選択
4. 「Run workflow」ボタンをクリック
5. オプションを選択：
   - **Dry run**: チェックを入れると、実際には更新せずプレビューのみ
   - チェックなし: 実際に更新を実行
6. 「Run workflow」を確定

---

## 📊 実行結果の確認

### GitHub Actions UIで確認

1. 「Actions」タブ → 実行履歴
2. 最新の実行をクリック
3. **Job Summary**セクションで結果を確認：

```
📊 成分量データ更新結果

| 項目     | 件数 |
|----------|------|
| 対象商品 | 66件 |
| 更新成功 | 52件 |
| 更新失敗 | 14件 |

✅ 更新完了
Sanityデータベースに反映されました。

実行日時: 2025-11-17 18:00:00 UTC
```

### ログファイルのダウンロード

実行履歴ページの下部「Artifacts」セクションから、詳細ログをダウンロード可能（30日間保存）。

---

## 🔧 トラブルシューティング

### エラー: "SANITY_API_TOKEN is not set"

**原因**: GitHub Secretsに`SANITY_API_TOKEN`が登録されていない

**解決方法**:

1. リポジトリの「Settings」→「Secrets and variables」→「Actions」
2. `SANITY_API_TOKEN`を確認・追加

### エラー: "Insufficient permissions"

**原因**: Sanity APIトークンに書き込み権限がない

**解決方法**:

1. Sanityダッシュボードで新しいトークンを作成
2. **Permissions: Editor**を選択
3. GitHub Secretsの`SANITY_API_TOKEN`を更新

### 実行が失敗する

**確認事項**:

1. Sanity APIトークンの有効性
2. ネットワーク接続
3. Sanityサービスの稼働状況（https://status.sanity.io/）

**対処方法**:

- ログファイルをダウンロードして詳細を確認
- 手動実行で「Dry run」モードを試してみる

---

## 📅 実行スケジュールのカスタマイズ

`.github/workflows/update-ingredient-amounts.yml`の`cron`設定を変更：

```yaml
schedule:
  - cron: "0 18 * * 6" # 毎週土曜日 18:00 UTC = 日曜日 3:00 JST
```

**変更例**:

- **毎日実行**: `0 18 * * *`（毎日 3:00 JST）
- **月1回**: `0 18 1 * *`（毎月1日 3:00 JST）
- **週2回**: `0 18 * * 0,3`（日曜・水曜 3:00 JST）

**Cron記法参考**: https://crontab.guru/

---

## 🎯 期待される効果

- **データカバー率向上**: 80.4% → 95-100%（定期的な自動更新）
- **運用コスト削減**: 手動作業不要
- **データ鮮度維持**: 新商品追加時も自動対応
- **透明性**: 実行履歴・ログが常に確認可能

---

## 📝 関連ドキュメント

- [成分量抽出ロジック改善ロードマップ](./INGREDIENT_EXTRACTION_ROADMAP.md)
- [GitHub Actions公式ドキュメント](https://docs.github.com/en/actions)
- [Sanity API Documentation](https://www.sanity.io/docs/http-api)

---

**最終更新日**: 2025-11-15
**バージョン**: 1.0.0
**作成者**: Ryota
