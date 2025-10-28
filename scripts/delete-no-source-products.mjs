#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

async function main() {
  console.log('🗑️  source未設定商品削除スクリプト\n');

  // source が定義されていない商品を取得
  const query = \`*[_type == "product" && !defined(source)]{_id, name, slug}\`;
  const products = await client.fetch(query);

  console.log(\`📋 見つかった商品: \${products.length}件\n\`);
  
  if (products.length === 0) {
    console.log('✅ source未設定の商品は存在しません');
    return;
  }

  products.forEach((p, i) => {
    console.log(\`  \${i + 1}. \${p.name}\`);
    console.log(\`     ID: \${p._id}\`);
    console.log(\`     Slug: \${p.slug?.current || 'なし'}\`);
  });

  console.log('\n🚀 削除を実行中...\n');

  // 一件ずつ削除
  let deleted = 0;
  for (const product of products) {
    try {
      await client.delete(product._id);
      console.log(\`  ✅ 削除: \${product.name}\`);
      deleted++;
    } catch (error) {
      console.error(\`  ❌ エラー: \${product.name} - \${error.message}\`);
    }
  }

  console.log(\`\n✅ \${deleted}件の商品を削除しました！\`);
}

main().catch(console.error);
