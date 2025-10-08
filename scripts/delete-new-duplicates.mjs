import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function deleteDuplicates() {
  // 削除するドキュメントID（短い説明のもの）
  const idsToDelete = [
    'b6425c3a-3d46-40cc-9c27-9bcfea2386cd', // BCAA (88文字)
    'P1Z7m8fgwpF7BuhejyHKvE', // CoQ10 (93文字)
    'drafts.7504da82-a6c2-403a-8a35-4b77a60c4881', // NAC (123文字、draft)
    'ingredient.vitamin-c', // vitamin-c 重複
  ];

  for (const id of idsToDelete) {
    try {
      console.log(`削除中: ${id}`);
      await client.delete(id);
      console.log(`✅ 削除完了: ${id}\n`);
    } catch (error) {
      console.error(`❌ 削除失敗: ${id}`, error.message);
    }
  }

  console.log('完了！');
}

deleteDuplicates().catch(console.error);
