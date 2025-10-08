import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function fixReference() {
  try {
    console.log('product.focus-blendの参照を確認中...');

    const product = await client.getDocument('product.focus-blend');

    if (product && product.focus && Array.isArray(product.focus)) {
      console.log('現在の参照:', product.focus);

      // ingredient.vitamin-c → ingredient-vitamin-c に変更
      const updatedFocus = product.focus.map(ref => {
        if (ref._ref === 'ingredient.vitamin-c') {
          return { ...ref, _ref: 'ingredient-vitamin-c' };
        }
        return ref;
      });

      console.log('更新後の参照:', updatedFocus);

      await client
        .patch('product.focus-blend')
        .set({ focus: updatedFocus })
        .commit();

      console.log('✅ 参照を更新しました');

      // 削除を試みる
      console.log('\ningredient.vitamin-cを削除中...');
      await client.delete('ingredient.vitamin-c');
      console.log('✅ 削除完了');
    }
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

fixReference().catch(console.error);
