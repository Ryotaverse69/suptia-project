#!/usr/bin/env node

/**
 * ネイチャーメイド商品を検索するスクリプト
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

async function findNatureMade() {
  console.log('🔍 ネイチャーメイド商品を検索中...\n');

  try {
    // _idで直接検索
    const byId = await client.fetch(
      `*[_type == "product" && _id == "pOpoqaGNdorP1t4hBF94ss"][0]`,
    );

    if (byId) {
      console.log('✅ _idで見つかりました:');
      console.log(`  name: ${byId.name}`);
      console.log(`  source: ${byId.source || '(未設定)'}`);
      console.log(`  _id: ${byId._id}`);
      console.log(`  priceJPY: ${byId.priceJPY}`);
      console.log(`  servingsPerContainer: ${byId.servingsPerContainer}`);
      console.log(`  servingsPerDay: ${byId.servingsPerDay}`);
    } else {
      console.log('❌ _id "pOpoqaGNdorP1t4hBF94ss" が見つかりません');

      // 名前で検索
      const byName = await client.fetch(
        `*[_type == "product" && name match "*ネイチャーメイド*スーパーマルチ*"]{
          _id,
          name,
          source,
          priceJPY,
          servingsPerContainer,
          servingsPerDay
        }`,
      );

      if (byName.length > 0) {
        console.log('\n📦 名前で見つかった商品:');
        byName.forEach((p) => {
          console.log(`  - ${p.name}`);
          console.log(`    _id: ${p._id}`);
          console.log(`    source: ${p.source || '(未設定)'}`);
          console.log('');
        });
      } else {
        console.log('\n❌ 名前でも見つかりません');

        // すべてのネイチャーメイド商品を検索
        const allNatureMade = await client.fetch(
          `*[_type == "product" && name match "*ネイチャーメイド*"]{
            _id,
            name,
            source
          }`,
        );

        console.log(`\n📋 すべてのネイチャーメイド商品 (${allNatureMade.length}件):`);
        allNatureMade.forEach((p) => {
          console.log(`  - ${p.name}`);
          console.log(`    _id: ${p._id}`);
          console.log(`    source: ${p.source || '(未設定)'}`);
          console.log('');
        });
      }
    }
  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

findNatureMade().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
