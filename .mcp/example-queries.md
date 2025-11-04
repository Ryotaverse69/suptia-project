# Suptia MCP 活用例クエリ集

Claude Desktop または Claude Code でこれらのクエリを試してみてください。

## 🗄️ Supabase MCP クエリ

### 基本操作

#### テーブル一覧の確認

```
Supabaseに接続して、データベースのテーブル一覧を表示して
```

#### ユーザープロファイルの作成

```
Supabaseのuser_profilesテーブルに新しいプロファイルを追加して：
- アレルギー: 大豆、乳製品
- 健康目標: 睡眠改善、免疫力向上
- 懸念事項: なし
```

#### 価格アラートの設定

```
Supabaseのprice_alertsテーブルに以下のアラートを追加して：
- 商品ID: product-rakuten-tsuruha-10020349
- 商品名: DHC ビタミンC ハードカプセル 60日分
- 目標価格: 350円
```

#### お気に入り商品の追加

```
favoritesテーブルに商品を追加して：
- 商品ID: product-rakuten-tsuruha-10020349
- 商品名: DHC ビタミンC
```

---

### 分析クエリ

#### アクティブな価格アラート一覧

```
Supabaseから、現在アクティブな価格アラートを全て取得して、
目標価格と現在価格の差が大きい順に並べて
```

**期待される出力:**

```sql
SELECT
  product_name,
  target_price,
  current_price,
  (current_price - target_price) as price_diff
FROM price_alerts
WHERE is_active = TRUE
  AND current_price IS NOT NULL
ORDER BY price_diff DESC;
```

#### ユーザー別お気に入り商品数

```
Supabaseのfavoritesテーブルから、
ユーザーごとのお気に入り商品数を集計して
```

**期待される出力:**

```sql
SELECT
  user_id,
  COUNT(*) as favorites_count,
  MAX(added_at) as last_added_at
FROM favorites
GROUP BY user_id
ORDER BY favorites_count DESC;
```

#### 商品別価格推移（過去7日間）

```
Supabaseのprice_historyテーブルから、
product-rakuten-tsuruha-10020349の過去7日間の価格推移を取得して、
日別平均価格をグラフ化して
```

**期待される出力:**

```sql
SELECT
  DATE_TRUNC('day', recorded_at) as date,
  source,
  AVG(unit_price) as avg_price,
  MIN(unit_price) as min_price,
  MAX(unit_price) as max_price
FROM price_history
WHERE product_id = 'product-rakuten-tsuruha-10020349'
  AND recorded_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', recorded_at), source
ORDER BY date, source;
```

#### 人気の健康目標トップ5

```
Supabaseのuser_profilesとdiagnosis_resultsから、
最も多く選ばれている健康目標トップ5を教えて
```

**期待される出力:**

```sql
SELECT
  unnest(health_goals) as goal,
  COUNT(*) as frequency
FROM user_profiles
GROUP BY goal
ORDER BY frequency DESC
LIMIT 5;
```

---

### 高度な分析

#### アレルギー別の推薦除外商品

```
Supabaseのuser_profilesから、
大豆アレルギーを持つユーザー数と、
そのユーザーに推薦すべきでない商品の特徴を分析して
```

#### 価格アラート達成率

```
Supabaseのprice_alertsから、
過去30日間で目標価格を達成したアラートの割合を計算して
```

**期待される出力:**

```sql
SELECT
  COUNT(*) FILTER (WHERE current_price <= target_price AND notified_at IS NOT NULL) as achieved,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE current_price <= target_price) / COUNT(*), 2) as achievement_rate
FROM price_alerts
WHERE created_at > NOW() - INTERVAL '30 days';
```

#### ユーザー行動分析

```
Supabaseのproduct_viewsとfavoritesを結合して、
商品を閲覧してからお気に入りに追加するまでの平均時間を計算して
```

---

## 📊 Google Search Console MCP クエリ

### 基本操作

#### サイト全体のパフォーマンス

```
Google Search Consoleから、
Suptiaサイト（sc-domain:suptia.com）の過去7日間の検索パフォーマンスを取得して：
- 総クリック数
- 総表示回数
- 平均CTR
- 平均順位
```

**⚠️ 重要**: Search Consoleのプロパティタイプに応じて正しい形式を使用：

- ドメインプロパティ: `sc-domain:suptia.com` ← **Suptiaはこちら**
- URLプレフィックス: `https://suptia.com/`

#### トップ検索クエリ

```
Google Search Consoleから、
過去30日間でクリック数が多かったクエリトップ20を表示して
```

#### ページ別パフォーマンス

```
Google Search Consoleから、
/ingredients/ 配下のページのパフォーマンスを表示して、
CTRが低い順に並べて
```

---

### SEO改善分析

#### 低CTRページの特定

```
Google Search Consoleから、
表示回数が1000回以上なのにCTRが2%未満のページを特定して、
改善提案をして
```

**期待される出力例:**

```
📊 低CTRページ（改善優先度順）:

1. /ingredients/magnesium
   - 表示: 5,200回
   - クリック: 78回
   - CTR: 1.5%
   - 平均順位: 8.2位

   🔍 主な検索クエリ:
   - "マグネシウム サプリ" (順位 7位, CTR 1.2%)
   - "マグネシウム 効果" (順位 9位, CTR 1.8%)

   💡 改善提案:
   - タイトルに「おすすめ」「比較」を追加
   - メタディスクリプションに具体的な効果を記載
   - リッチリザルト（FAQ）を追加
```

#### 検索順位が下がったページ

```
Google Search Consoleから、
過去30日間で検索順位が5位以上下がったページを教えて
```

#### 新規インデックスページの確認

```
Google Search Consoleから、
過去7日間で新しくインデックスされたページを確認して
```

---

### コンテンツ戦略

#### 未カバーの検索クエリ発見

```
Google Search Consoleの検索クエリデータから、
「サプリ」または「成分」を含むクエリで、
まだSuptiaに該当ページがないものをリストアップして
```

**期待される出力例:**

```
📝 記事作成候補（検索需要あり、未カバー）:

1. "NAC サプリ 効果" - 1,200回/月
   → N-アセチルシステイン（NAC）の成分記事を作成

2. "CoQ10 還元型" - 850回/月
   → CoQ10の詳細記事（還元型 vs 酸化型の比較）

3. "アスタキサンチン 疲労回復" - 620回/月
   → アスタキサンチンの成分記事を作成

優先順位: NAC（検索ボリューム最大、競合少ない）
```

#### 競合ページとの比較

```
Google Search Consoleから、
「ビタミンC サプリ おすすめ」での自社順位を確認して、
上位10位以内の競合ページを分析して
```

#### インプレッション > クリックのギャップ分析

```
Google Search Consoleから、
表示回数は多いのにクリック数が少ないクエリトップ10を教えて、
それぞれの改善案を提案して
```

---

### パフォーマンス監視

#### Core Web Vitals チェック

```
Google Search Consoleから、
Suptiaサイトのモバイル版Core Web Vitalsを確認して、
問題があるページを教えて
```

#### インデックスカバレッジエラー

```
Google Search Consoleから、
現在のインデックスカバレッジエラーを全て表示して、
優先度順に並べて
```

#### サイトマップ送信状況

```
Google Search Consoleから、
送信済みのサイトマップの状態を確認して
```

---

## 🔗 統合クエリ（Supabase + Search Console）

### SEO改善 → データベース保存

```
Google Search Consoleから低CTRページを特定して、
それらのページ情報をSupabaseの新しいテーブル「seo_improvement_tasks」に保存して：
- ページURL
- 現在のCTR
- 表示回数
- 改善優先度（高/中/低）
- 改善提案
```

### ユーザー行動 + 検索クエリ分析

```
Supabaseのproduct_viewsから人気商品を取得して、
その商品に関連する検索クエリをGoogle Search Consoleから取得して、
SEO最適化の提案をして
```

### 価格アラート + 検索トレンド

```
Supabaseの価格アラートで人気の商品を特定して、
その商品名の検索トレンドをGoogle Search Consoleから分析して、
需要が高まっているタイミングでアラート通知を最適化する提案をして
```

---

## 🚀 実践例：完全なワークフロー

### 例1: 新規成分記事の企画・作成・監視

**ステップ1: 需要分析**

```
Google Search Consoleから、
「サプリ 成分」を含む検索クエリで、
まだ記事がないものトップ10を教えて
```

**ステップ2: 記事作成優先順位を決定**

```
Supabaseのdiagnosis_resultsから、
ユーザーが頻繁に検索している健康目標を集計して、
Search Consoleのクエリと照合して、
最も需要がある未カバー成分を特定して
```

**ステップ3: 記事公開後のインデックス監視**

```
新しく公開した /ingredients/nac ページが
Google Search Consoleでインデックスされているか確認して
```

**ステップ4: パフォーマンストラッキング**

```
/ingredients/nac ページの過去7日間のパフォーマンスを
Google Search Consoleから取得して、
Supabaseのseo_performance_historyテーブルに保存して
```

---

### 例2: 価格アラート最適化

**ステップ1: 人気商品の特定**

```
Supabaseのprice_alertsから、
アラート設定数が多い商品トップ10を教えて
```

**ステップ2: SEO最適化**

```
その商品に関連する検索クエリを
Google Search Consoleから取得して、
商品ページのSEO改善案を提案して
```

**ステップ3: 検索需要とアラートの相関分析**

```
Search Consoleの検索ボリュームと
Supabaseの価格アラート設定数を比較して、
需要が高いのにアラートが少ない商品を特定して
```

---

## 📝 Tips

### Supabase MCPのコツ

1. **複雑なクエリは段階的に**

   ```
   まず簡単なSELECT文で確認 → JOINを追加 → 集計関数を追加
   ```

2. **RLSを意識する**

   ```
   「自分のデータのみ表示」などの制限を考慮してクエリを書く
   ```

3. **インデックスを活用**
   ```
   WHERE句やORDER BY句で使う列にはインデックスが張られているか確認
   ```

### Google Search Console MCPのコツ

1. **日付範囲を明示**

   ```
   「過去7日間」「過去30日間」など具体的に指定
   ```

2. **ディメンション（次元）を指定**

   ```
   「クエリ別」「ページ別」「デバイス別」など
   ```

3. **フィルターを活用**
   ```
   「/ingredients/ 配下のみ」「モバイルのみ」など
   ```

---

**最終更新**: 2025-11-01
