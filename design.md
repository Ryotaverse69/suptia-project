# Design Overview

## Architecture
- Monorepo: `apps/web` (Next.js 14) and `packages/schemas` (Sanity v3).
- Data source: Sanity for editorial content; price data mocked in local JSON for MVP.
- Domain services: scoring, cost normalization, compliance checker in `/apps/web/src/lib/`.

## Data Models (Sanity)
- Ingredient { id, name, category, synonyms[], mechanisms[], evidenceLevel (A/B/C), safetyNotes[], tags[] }
- Product { id, brand, name, ingredients[{ref, amountMgPerServing}], servingsPerDay, servingsPerContainer, priceJPY, urls{ amazon?, rakuten?, iherb? }, images[], warnings[] }
- Evidence { id, ingredientRef, claim, studyType, summary, pubmedId?, grade(A/B/C) }
- Rule { id, personaTag, interaction, severity, action }
- Persona { id, tags[pregnancy|condition|meds|stimulantSensitivity], notes }

## Domain Logic
- EffectiveCostPerDay(JPY) = priceJPY / servingsPerContainer * servingsPerDay.
- NormalizedCostPerMgPerDay = EffectiveCostPerDay / Σ(ingredients.mgPerDay).
- 4-score = weighted(evidence, safety, cost, practicality). (weights configurable)

## Pages (Next.js)
- `/` Home: search, CTA, cheap-now (mock), alert banner.
- `/ingredients/[slug]` Detail: evidence summary, linked products.
- `/products/[slug]` Detail: composition, normalized price table, warnings, price history chart (mock).
- `/compare` Compare view: side-by-side normalized dosages.

## Acceptance Criteria Examples
- Given a Product with price 3,000 JPY, 60 servings, 2 servings/day → EffectiveCostPerDay = 100 JPY.
- Given two Products with different dose sizes → normalized table shows JPY per mg/day correctly.
- When summary text contains an NG phrase → UI shows warning and suggestion; user can apply fix.
