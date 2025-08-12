# Suptia Sanity Schemas

This package contains Sanity v3 schema definitions for the Suptia MVP supplement decision engine.

## Schemas

### Core Content Types

- **Ingredient** (`ingredient`): Supplement ingredients with evidence levels, safety notes, and categorization
- **Product** (`product`): Commercial supplement products with pricing, composition, and retailer links
- **Evidence** (`evidence`): Scientific evidence linking ingredients to health claims
- **Rule** (`rule`): Compliance and safety rules for different user personas
- **Persona** (`persona`): User archetypes with specific health goals and restrictions

### Usage

```typescript
import { schemaTypes } from '@suptia/schemas';

export default defineConfig({
  // ... other config
  schema: {
    types: schemaTypes,
  },
});
```

## Schema Relationships

- Products reference Ingredients through composition
- Evidence references Ingredients for claims
- Rules can reference specific Ingredients for targeted warnings
- Personas reference Ingredients for recommendations and restrictions

## Field Validation

All schemas include comprehensive validation rules to ensure data quality:

- Required fields are marked with validation rules
- Numeric fields have min/max constraints
- Reference fields ensure data integrity
- URL fields validate proper formatting

## Data Model Details

### Ingredient
- Categories: vitamin, mineral, herb, amino, other
- Evidence levels: A (high quality), B (moderate), C (limited)
- Includes synonyms for search optimization
- Safety notes for contraindications

### Product
- Multi-ingredient composition with precise dosages
- Price tracking in JPY
- Multiple retailer URL support (Amazon, Rakuten, iHerb)
- Form types: capsule, tablet, softgel, powder, liquid, gummy

### Evidence
- Links to specific ingredients
- Study type classification (RCT, meta-analysis, etc.)
- Evidence grading system
- PubMed ID integration

### Rule
- Persona-based safety rules
- Severity levels: low, medium, high
- Ingredient-specific or general rules
- Active/inactive status

### Persona
- Tag-based classification system
- Health goal tracking
- Ingredient recommendations and restrictions
- Detailed notes for context