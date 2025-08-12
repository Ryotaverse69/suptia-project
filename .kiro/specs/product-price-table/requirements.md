# Requirements Document

## Introduction

商品詳細ページ（`/products/[slug]`）に正規化価格テーブルを実装し、ユーザーがサプリメントのコストパフォーマンスを簡単に比較できるようにします。この機能により、実効コスト/日とmg/日あたりコストを表示し、価格の透明性を向上させます。

## Requirements

### Requirement 1

**User Story:** サプリメント購入を検討するユーザーとして、商品詳細ページで実効コスト/日を確認したい。そうすることで、日々のコストを把握して予算計画を立てられる。

#### Acceptance Criteria

1. WHEN ユーザーが商品詳細ページを表示する THEN システムは実効コスト/日を計算して表示する SHALL
2. WHEN 商品に複数の成分が含まれている THEN システムは全成分の合計mgに基づいてコストを計算する SHALL
3. IF 商品データに必要な情報（価格、容量、1日摂取量）が不足している THEN システムは適切なエラーメッセージを表示する SHALL

### Requirement 2

**User Story:** サプリメント購入を検討するユーザーとして、商品詳細ページでmg/日あたりコストを確認したい。そうすることで、成分の単位あたり価格を他商品と比較できる。

#### Acceptance Criteria

1. WHEN ユーザーが商品詳細ページを表示する THEN システムはmg/日あたりコストを計算して表示する SHALL
2. WHEN 商品に複数の成分が含まれている THEN システムは各成分のmg/日を合計してコストを計算する SHALL
3. WHEN mg/日の合計が0の場合 THEN システムは「計算不可」と表示する SHALL

### Requirement 3

**User Story:** 開発者として、価格計算ロジックが正確に動作することを確認したい。そうすることで、ユーザーに正しい価格情報を提供できる。

#### Acceptance Criteria

1. WHEN 価格計算関数をテストする THEN システムは実効コスト/日の計算が正確である SHALL
2. WHEN 価格計算関数をテストする THEN システムはmg/日あたりコストの計算が正確である SHALL
3. WHEN エッジケース（0値、null値）をテストする THEN システムは適切にエラーハンドリングする SHALL

### Requirement 4

**User Story:** サプリメント購入を検討するユーザーとして、価格テーブルが見やすく表示されることを期待する。そうすることで、情報を素早く理解できる。

#### Acceptance Criteria

1. WHEN ユーザーが商品詳細ページを表示する THEN システムは価格情報を表形式で見やすく表示する SHALL
2. WHEN モバイルデバイスでページを表示する THEN システムは価格テーブルをレスポンシブに表示する SHALL
3. WHEN 価格情報が表示される THEN システムは通貨記号（¥）と適切な小数点以下桁数で表示する SHALL

### Requirement 5

**User Story:** 開発者として、lib/cost.tsの計算ロジックを活用したい。そうすることで、一貫した価格計算を全体で使用できる。

#### Acceptance Criteria

1. WHEN 商品詳細ページで価格計算を行う THEN システムはlib/cost.tsの関数を使用する SHALL
2. WHEN lib/cost.tsに新しい計算関数が必要な場合 THEN システムは適切な関数を追加する SHALL
3. WHEN 価格計算ロジックを変更する THEN システムは既存のテストが通ることを確認する SHALL