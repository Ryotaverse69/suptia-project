#!/usr/bin/env node

import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('/tmp/sanity-ingredients.json', 'utf-8'));

console.log('🔍 Sanity成分データベース重複分析\n');
console.log(`📁 総成分数: ${data.length}\n`);

// 重複チェック（日本語名）
const nameMap = new Map();
data.forEach(item => {
  if (!nameMap.has(item.name)) {
    nameMap.set(item.name, []);
  }
  nameMap.get(item.name).push(item);
});

const duplicates = Array.from(nameMap.entries())
  .filter(([_, items]) => items.length > 1)
  .sort((a, b) => a[0].localeCompare(b[0], 'ja'));

if (duplicates.length > 0) {
  console.log(`🔴 重複発見: ${duplicates.length}種類\n`);
  console.log('=' .repeat(70));

  duplicates.forEach(([name, items], index) => {
    console.log(`\n${index + 1}. ${name} (${items.length}件)`);
    console.log('-'.repeat(70));

    items.forEach((item, idx) => {
      const idType = item._id.startsWith('ingredient-') ? '✅ 標準ID' : '⚠️  自動生成ID';
      console.log(`  [${idx + 1}] ${idType}`);
      console.log(`      _id: ${item._id}`);
      console.log(`      nameEn: ${item.nameEn}`);
      console.log(`      slug: ${item.slug?.current || '(なし)'}`);
    });
  });

  console.log('\n' + '='.repeat(70));
  console.log('\n📝 削除推奨リスト（自動生成IDを削除）:\n');

  const toDelete = [];
  duplicates.forEach(([name, items]) => {
    // 標準ID（ingredient-で始まる）を保持、自動生成IDを削除
    const standardIds = items.filter(item => item._id.startsWith('ingredient-'));
    const autoIds = items.filter(item => !item._id.startsWith('ingredient-'));

    if (standardIds.length > 0 && autoIds.length > 0) {
      console.log(`${name}:`);
      console.log(`  ✅ 保持: ${standardIds[0]._id}`);
      autoIds.forEach(item => {
        console.log(`  ❌ 削除: ${item._id}`);
        toDelete.push(item._id);
      });
      console.log();
    } else if (items.length > 1) {
      // すべてが標準IDまたはすべてが自動生成IDの場合
      console.log(`${name}: ⚠️  手動確認が必要`);
      items.forEach((item, idx) => {
        console.log(`  [${idx === 0 ? '✅ 保持?' : '❌ 削除?'}] ${item._id}`);
      });
      console.log();
    }
  });

  console.log('='.repeat(70));
  console.log(`\n🗑️  削除対象ID数: ${toDelete.length}`);
  console.log('\n削除コマンド用IDリスト:');
  console.log(JSON.stringify(toDelete, null, 2));

} else {
  console.log('✅ 重複なし');
}
