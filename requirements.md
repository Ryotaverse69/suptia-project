# Suptia MVP 要件（EARS）

## 2.1 診断と推薦（ライト版）
- When a user selects up to three goals (e.g., fatigue, skin, focus), the system shall suggest top 3 ingredients and 5 products with an explainable 4-score (evidence, safety, cost, practicality).
- The recommendation shall display per-day effective cost normalized by dosage (mg/day).
- The system shall warn for contraindications by persona tags (pregnancy/lactation, conditions, meds, stimulant sensitivity).

## 2.2 成分/商品データ
- The system shall provide Sanity schemas for Ingredient, Product, Evidence, Rule, Persona.
- The system shall show a Product Detail page with: composition, normalized price comparison (Amazon/Rakuten placeholders), interaction warnings, research summary, review summary (stub), and price history (mock data).

## 2.3 価格と履歴（MVP）
- The system shall compute normalized price per day using package size, serving per day, and mg per serving.
- The system shall store/display mock price history and allow a user to save a product (favorite) for later alerts (UI only / no backend alerts in MVP).

## 2.4 コンプライアンス
- The system shall include a phrase checker that flags NG claims (e.g., 完治する, 速攻で治る) and suggests compliant alternatives.
- The UI shall enforce compliant phrasing in product/evidence summaries with a non-blocking warning modal and edit suggestions.

## 2.5 UI/UX
- The Home page shall show search + CTA, “いま安い(ダミー)”, “注意が必要な成分”, and quick links.
- The Ingredient Guide shall provide hubs for vitamins/minerals/herbs/amino with filters.
- Comparison view shall align equivalent dosages across multiple products.

## 2.6 パフォーマンス/運用
- The app shall use ISR/SSG where possible and pass ESLint/Prettier checks.
- GA4 placeholder and structured data (Schema.org) shall be scaffolded.
