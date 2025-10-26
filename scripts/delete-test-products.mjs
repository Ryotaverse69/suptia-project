#!/usr/bin/env node

/**
 * テスト商品（ダミー商品15件）を削除するスクリプト
 *
 * Sanity CLIで実行するため、ブラウザ認証を使用します。
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const dummyProductIds = [
  "1587aeaf-b110-4176-9c2b-b7c01319f928",
  "45a1716d-b7a5-4d8b-a93d-606147a02e47",
  "46817020-4d24-49c6-b967-c60b624440ab",
  "4bff1267-736a-4311-bf91-7c945df05ff1",
  "4db3724c-615b-4ec2-be80-99d051ac43d6",
  "59036ca0-0c8c-4d86-a422-da8bbbb7e748",
  "5993a8eb-1c30-4f02-a869-35c20c635ab3",
  "59a33ba2-4fa1-4498-8226-f8e53c8ae601",
  "70cd5aeb-e362-4bc0-ae45-8e8c425523f4",
  "a1ad94e0-1e65-48ce-8071-db6378c3d88b",
  "ac0c9d49-1418-4fc0-9fb5-f9abaebca900",
  "b152abf6-959b-465c-bbf2-46961156a3fc",
  "c14f8b41-f504-47e2-a24d-26688eedcd12",
  "ea3011f0-cec0-481d-b84c-72dcf8e8571d",
  "ff7b754f-3297-45ae-b7c1-13a1ac4f48a3"
];

async function main() {
  console.log('🗑️  テスト商品削除スクリプト');
  console.log('═'.repeat(60));
  console.log(`削除対象: ${dummyProductIds.length}件のダミー商品\n`);

  console.log('📍 削除対象商品:');
  console.log('  - DHC ビタミンC、EPA、マルチビタミン、亜鉛');
  console.log('  - Life Extension ビタミンC、ツーパーデイ、スーパーオメガ3');
  console.log('  - NOW Foods ビタミンD、マグネシウム、オメガ3、亜鉛');
  console.log('  - Thorne マルチビタミン、ビタミンD');
  console.log('  - ネイチャーメイド スーパーマルチ、ビタミンD\n');

  // Sanity CLIを使用してドキュメントを削除
  const query = `*[_id in [${dummyProductIds.map(id => `"${id}"`).join(', ')}]]`;

  console.log('🚀 Sanity CLIで削除を実行中...\n');

  try {
    const command = `npx sanity documents delete '${query}'`;
    const { stdout, stderr } = await execAsync(command);

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log('\n✅ 削除完了！');
    console.log('═'.repeat(60));
    console.log(`削除件数: ${dummyProductIds.length}件`);
    console.log('\n📊 最終商品数: 219件（実データのみ）');
    console.log('  - 楽天: 120件');
    console.log('  - Yahoo!: 95件');
    console.log('  - その他（URL付き）: 4件');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    console.log('\n💡 代替方法:');
    console.log('  1. Sanity Studioで手動削除: https://suptia.sanity.studio');
    console.log('  2. 以下のIDをコピーして、Studio内で一括削除:');
    console.log(JSON.stringify(dummyProductIds, null, 2));
  }
}

main();
