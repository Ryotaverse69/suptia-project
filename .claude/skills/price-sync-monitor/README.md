# Price Sync Monitor

価格同期モニター - 価格データの鮮度、異常値、API障害を監視

## 概要

**price-sync-monitor** は、Amazon PA-API・楽天APIから取得した価格データの品質を継続的に監視し、異常値やAPI障害を検出するツールです。

## 主な機能（実装予定）

- ✅ キャッシュ期限切れの検出
- ✅ 異常価格（前回比±80%超）の警告
- ✅ API障害・レート制限の検知
- ✅ Slack/Discord通知連携
- ✅ 価格履歴グラフ生成
- ✅ SLOダッシュボード（エラー率、キャッシュヒット率）

## SLO（Service Level Objectives）

| メトリクス               | 目標値 | アラート閾値                        |
| ------------------------ | ------ | ----------------------------------- |
| `price_sync_error_rate`  | < 1%   | > 5%（Critical）、> 2%（Warning）   |
| `cache_hit_rate`         | > 90%  | < 70%（Critical）、< 85%（Warning） |
| `unmatched_product_rate` | < 5%   | > 10%（Warning）                    |
| `api_latency`            | < 1.5s | > 3s（Critical）、> 2s（Warning）   |

## 使用方法（実装予定）

```bash
# 価格同期ステータスをチェック
npx tsx .claude/skills/price-sync-monitor/index.ts --mode check

# 異常価格を検出
npx tsx .claude/skills/price-sync-monitor/index.ts --mode detect-anomalies --threshold 80

# Slack通知を有効化
npx tsx .claude/skills/price-sync-monitor/index.ts --notify slack --webhook-url <URL>
```

## ステータス

⏳ **スケルトン実装済み** - フェーズ2.5（API連携開始）で完全実装予定

## ライセンス

MIT License
