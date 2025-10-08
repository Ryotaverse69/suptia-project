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
    console.log('product.focus-blendの参照を更新中...');

    const product = await client.getDocument('product.focus-blend');

    if (product && product.ingredients && Array.isArray(product.ingredients)) {
      console.log('現在のingredients:', JSON.stringify(product.ingredients, null, 2));

      // ingredient.vitamin-c → ingredient-vitamin-c に変更
      const updatedIngredients = product.ingredients.map(item => {
        if (item.ingredientRef && item.ingredientRef._ref === 'ingredient.vitamin-c') {
          return {
            ...item,
            ingredientRef: {
              ...item.ingredientRef,
              _ref: 'ingredient-vitamin-c'
            }
          };
        }
        return item;
      });

      console.log('更新後のingredients:', JSON.stringify(updatedIngredients, null, 2));

      await client
        .patch('product.focus-blend')
        .set({ ingredients: updatedIngredients })
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
