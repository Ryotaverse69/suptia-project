#!/usr/bin/env node

/**
 * フィルター機能のデータを検証するスクリプト
 * 本番環境で動作確認するために必要な情報を出力
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function verifyFilterData() {
  console.log('🔍 フィルターデータを検証中...\n');

  try {
    // 商品ページと同じクエリで取得
    const query = `*[_type == "product"] | order(priceJPY asc){
      _id,
      name,
      priceJPY,
      servingsPerContainer,
      servingsPerDay,
      externalImageUrl,
      source,
      slug
    }`;

    const products = await client.fetch(query);

    console.log(`📦 全商品数: ${products.length}\n`);

    // 有効な商品のみフィルター（商品ページと同じロジック）
    const validProducts = products.filter(
      (product) =>
        product.priceJPY &&
        typeof product.priceJPY === 'number' &&
        product.priceJPY > 0 &&
        product.servingsPerContainer &&
        product.servingsPerDay,
    );

    console.log(`✅ 有効な商品数: ${validProducts.length}\n`);

    // ECサイト別の商品数を集計
    const sourceCounts = {};
    validProducts.forEach((p) => {
      const source = p.source || '(未設定)';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    console.log('📊 ECサイト別商品数:');
    Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([source, count]) => {
        console.log(`  ${source}: ${count}件`);
      });

    // Amazon商品の詳細
    const amazonProducts = validProducts.filter((p) => p.source === 'amazon');
    console.log(`\n📦 Amazon商品 (${amazonProducts.length}件):`);
    amazonProducts.forEach((p) => {
      console.log(`  ✅ ${p.name}`);
      console.log(`     source: "${p.source}"`);
      console.log(`     _id: ${p._id}`);
      console.log(
        `     価格: ¥${p.priceJPY} (${p.servingsPerContainer}回分 / 1日${p.servingsPerDay}回)`,
      );
      console.log('');
    });

    // フィルターロジックのテスト
    console.log('\n🧪 フィルターロジックテスト:');
    const ecSiteFilter = 'amazon';
    const filtered = validProducts.filter(
      (product) => product.source === ecSiteFilter,
    );
    console.log(`  フィルター条件: source === "${ecSiteFilter}"`);
    console.log(`  結果: ${filtered.length}件の商品が該当`);

    if (filtered.length === amazonProducts.length) {
      console.log('  ✅ フィルターロジックは正常に動作します');
    } else {
      console.log('  ❌ フィルターロジックに問題があります');
    }

    // ブラウザコンソールで実行可能なデバッグコード生成
    console.log('\n\n🌐 ブラウザコンソールで実行するデバッグコード:');
    console.log('─'.repeat(60));
    console.log(`
// 1. 商品データの確認
console.log('全商品数:', document.querySelectorAll('[data-testid="product-card"]').length);

// 2. Amazonフィルターをクリック
document.querySelector('button:has-text("Amazon")').click();

// 3. フィルター後の商品数を確認
setTimeout(() => {
  console.log('フィルター後の商品数:', document.querySelectorAll('[data-testid="product-card"]').length);
  console.log('期待値: ${amazonProducts.length}件');
}, 1000);

// 4. React DevToolsで状態を確認
// ProductsSection > ecSiteFilter の値が "amazon" になっているか確認
    `.trim());
    console.log('─'.repeat(60));

    console.log('\n\n💡 トラブルシューティング:');
    console.log('1. ハードリロード: Cmd+Shift+R (Mac) または Ctrl+Shift+R (Windows)');
    console.log('2. ブラウザキャッシュクリア');
    console.log('3. シークレットモードで開く');
    console.log('4. Vercelダッシュボードで最新デプロイを確認');
    console.log('5. 上記のブラウザコンソールコードを実行して動作確認');
  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

verifyFilterData().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
