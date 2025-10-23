#!/bin/bash

# 現在存在する成分のスラッグ一覧を作成
existing_slugs=""
for file in *-article.json; do
  slug=$(jq -r '.slug // empty' "$file" 2>/dev/null)
  if [ -n "$slug" ]; then
    existing_slugs="$existing_slugs ingredient-$slug"
  fi
done

echo "=== 存在する成分ID ==="
echo "$existing_slugs" | tr ' ' '\n' | sort | uniq

echo ""
echo "=== 参照されている成分ID ==="
all_refs=""
for file in *-article.json; do
  refs=$(jq -r '.relatedIngredients[]?._ref // empty' "$file" 2>/dev/null)
  if [ -n "$refs" ]; then
    all_refs="$all_refs $refs"
  fi
done
echo "$all_refs" | tr ' ' '\n' | sort | uniq

echo ""
echo "=== 存在しない参照（修正が必要） ==="
for ref in $(echo "$all_refs" | tr ' ' '\n' | sort | uniq); do
  if ! echo "$existing_slugs" | tr ' ' '\n' | grep -q "^$ref$"; then
    echo "❌ $ref"
    # どのファイルで参照されているか確認
    for file in *-article.json; do
      if jq -r '.relatedIngredients[]?._ref // empty' "$file" 2>/dev/null | grep -q "^$ref$"; then
        echo "   → $file"
      fi
    done
  fi
done