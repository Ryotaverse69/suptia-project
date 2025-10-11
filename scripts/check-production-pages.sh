#!/bin/bash

echo "=== 本番サイトの新規5記事をチェック ==="
echo ""

for slug in creatine turmeric ginkgo l-carnitine astaxanthin; do
  echo "チェック中: $slug"
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://suptia.com/ingredients/$slug")
  if [ "$status" = "200" ]; then
    echo "✅ $slug: OK (HTTP $status)"
  else
    echo "❌ $slug: エラー (HTTP $status)"
  fi
done

echo ""
echo "詳細確認: https://suptia.com/ingredients"
