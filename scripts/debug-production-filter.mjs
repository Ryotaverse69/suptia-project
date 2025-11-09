#!/usr/bin/env node

/**
 * 本番環境のフィルター問題をデバッグするスクリプト
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

async function debugProductionFilter() {
  console.log('🔍 本番環境のフィルター問題をデバッグ中...\n');

  try {
    // 環境変数の確認
    console.log('📋 環境変数:');
    console.log(`  NEXT_PUBLIC_SANITY_PROJECT_ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`  NEXT_PUBLIC_SANITY_DATASET: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log('');

    // Amazon商品を直接クエリ
    const amazonProducts = await client.fetch(`
      *[_type == "product" && source == "amazon"]{
        _id,
        name,
        source,
        "slug": slug.current,
        priceJPY,
        servingsPerContainer,
        servingsPerDay
      }
    `);

    console.log(`📦 Amazon商品数: ${amazonProducts.length}\n`);

    if (amazonProducts.length === 0) {
      console.log('❌ Amazon商品が見つかりません！');
      console.log('\n可能性:');
      console.log('1. 本番環境のVercel環境変数でデータセットが異なる');
      console.log('2. Sanityの本番データセットに商品が登録されていない');
      console.log('');

      // 全商品のsourceを確認
      const allProducts = await client.fetch(`
        *[_type == "product"]{
          source
        }
      `);

      const sourceCounts = {};
      allProducts.forEach((p) => {
        const source = p.source || '(未設定)';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      console.log('📊 このデータセットの商品内訳:');
      Object.entries(sourceCounts).forEach(([source, count]) => {
        console.log(`  ${source}: ${count}件`);
      });

      process.exit(1);
    }

    console.log('✅ Amazon商品が正しく登録されています:');
    amazonProducts.forEach((p) => {
      console.log(`  - ${p.name}`);
      console.log(`    _id: ${p._id}`);
      console.log(`    source: "${p.source}"`);
      console.log(`    slug: ${p.slug}`);
      console.log('');
    });

    // 商品ページのクエリをシミュレート
    console.log('🧪 商品ページのクエリをシミュレート:');
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

    const allProducts = await client.fetch(query);
    const validProducts = allProducts.filter(
      (product) =>
        product.priceJPY &&
        typeof product.priceJPY === 'number' &&
        product.priceJPY > 0 &&
        product.servingsPerContainer &&
        product.servingsPerDay,
    );

    const amazonInValid = validProducts.filter((p) => p.source === 'amazon');
    console.log(`  全商品: ${allProducts.length}件`);
    console.log(`  有効な商品: ${validProducts.length}件`);
    console.log(`  有効なAmazon商品: ${amazonInValid.length}件`);

    if (amazonInValid.length === amazonProducts.length) {
      console.log('\n✅ すべてのAmazon商品が有効です');
    } else {
      console.log('\n⚠️ 一部のAmazon商品が無効です（価格情報が不完全）');
      const invalidAmazon = amazonProducts.filter(
        (ap) => !amazonInValid.find((vp) => vp._id === ap._id),
      );
      invalidAmazon.forEach((p) => {
        console.log(`  - ${p.name}`);
        console.log(`    priceJPY: ${p.priceJPY}`);
        console.log(`    servingsPerContainer: ${p.servingsPerContainer}`);
        console.log(`    servingsPerDay: ${p.servingsPerDay}`);
      });
    }

    console.log('\n\n📋 本番環境で確認すべきこと:');
    console.log('1. Vercelダッシュボード > Environment Variables');
    console.log('   NEXT_PUBLIC_SANITY_DATASET が "production" になっているか');
    console.log('');
    console.log('2. Vercelダッシュボード > Deployments');
    console.log('   最新のコミット (a275906d) がデプロイされているか');
    console.log('');
    console.log('3. ブラウザのコンソールで以下を実行:');
    console.log('   localStorage.clear()');
    console.log('   sessionStorage.clear()');
    console.log('   location.reload(true)');
    console.log('');
    console.log('4. Vercelで強制的に再デプロイ:');
    console.log('   Deployments > 最新デプロイ > ... > Redeploy');
  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

debugProductionFilter().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
