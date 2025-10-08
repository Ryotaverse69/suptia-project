import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function fixAllReferences() {
  try {
    // 全ての参照を見つける
    console.log('ingredient.vitamin-cへの全ての参照を検索中...\n');
    const docs = await client.fetch('*[references("ingredient.vitamin-c")]');

    console.log(`見つかった参照: ${docs.length}件\n`);

    for (const doc of docs) {
      console.log(`修正中: ${doc._id} (${doc._type})`);

      // ドキュメントの全フィールドをチェック
      const updated = JSON.parse(JSON.stringify(doc), (key, value) => {
        if (value && typeof value === 'object' && value._ref === 'ingredient.vitamin-c') {
          return { ...value, _ref: 'ingredient-vitamin-c' };
        }
        return value;
      });

      // _idと_typeを除外してパッチを作成
      const { _id, _type, _createdAt, _updatedAt, _rev, ...patchData } = updated;

      await client
        .patch(doc._id)
        .set(patchData)
        .commit();

      console.log(`✅ 更新完了: ${doc._id}\n`);
    }

    // 削除を試みる
    console.log('ingredient.vitamin-cを削除中...');
    await client.delete('ingredient.vitamin-c');
    console.log('✅ 削除完了！');

  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

fixAllReferences().catch(console.error);
