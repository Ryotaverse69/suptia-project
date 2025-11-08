/**
 * 全成分ドキュメントをSanityで公開する
 * ドラフト状態の成分を公開状態に変更
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/web/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function publishAllIngredients() {
  console.log('📢 全成分を公開中...\n');

  try {
    // 全成分を取得（rawモードでドラフト含む）
    const allIngredients = await client.fetch(
      `*[_type == "ingredient"]{ _id, name }`,
      {},
      { perspective: 'raw' }
    );

    console.log(`📊 対象成分数: ${allIngredients.length}件\n`);

    // ドラフトと公開済みを分類
    const drafts = allIngredients.filter(i => i._id.startsWith('drafts.'));
    const published = allIngredients.filter(i => !i._id.startsWith('drafts.'));

    console.log(`  ドラフト: ${drafts.length}件`);
    console.log(`  公開済み: ${published.length}件\n`);

    if (drafts.length === 0) {
      console.log('✅ 全ての成分は既に公開されています！');
      return;
    }

    console.log('📢 ドラフトを公開中...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const draft of drafts) {
      const publishedId = draft._id.replace('drafts.', '');
      
      try {
        // ドラフトの完全なデータを取得
        const draftDoc = await client.getDocument(draft._id);
        
        if (!draftDoc) {
          console.log(`⚠️  スキップ: ${draft.name} (ドキュメントが見つかりません)`);
          continue;
        }

        // 公開済みドキュメントが既に存在するかチェック
        const existingPublished = await client.getDocument(publishedId).catch(() => null);

        if (existingPublished) {
          // 既存の公開ドキュメントを更新
          await client
            .patch(publishedId)
            .set({
              ...draftDoc,
              _id: publishedId,
              _type: 'ingredient',
            })
            .commit();
        } else {
          // 新規公開ドキュメントを作成
          await client.create({
            ...draftDoc,
            _id: publishedId,
            _type: 'ingredient',
          });
        }

        // ドラフトを削除
        await client.delete(draft._id);

        console.log(`✅ 公開: ${draft.name}`);
        successCount++;

      } catch (error) {
        console.error(`❌ エラー: ${draft.name}`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 結果:');
    console.log(`  ✅ 公開成功: ${successCount}件`);
    console.log(`  ❌ エラー: ${errorCount}件`);
    console.log(`  ℹ️  既に公開済み: ${published.length}件`);
    console.log('\n✨ 完了');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  }
}

publishAllIngredients().catch(console.error);
