/**
 * 成分自動作成・紐付けユーティリティ
 *
 * 商品同期時に成分マスタが存在しない場合、自動で作成する
 */

// 商品名から成分を検出するパターン
const INGREDIENT_PATTERNS = [
  // ビタミン系
  { pattern: /ビタミン\s*C|vitamin\s*c/i, name: 'ビタミンC', slug: 'vitamin-c' },
  { pattern: /ビタミン\s*D3?|vitamin\s*d3?/i, name: 'ビタミンD', slug: 'vitamin-d' },
  { pattern: /ビタミン\s*E|vitamin\s*e/i, name: 'ビタミンE', slug: 'vitamin-e' },
  { pattern: /ビタミン\s*B12|vitamin\s*b12/i, name: 'ビタミンB12', slug: 'vitamin-b12' },
  { pattern: /ビタミン\s*B6|vitamin\s*b6/i, name: 'ビタミンB6', slug: 'vitamin-b6' },
  { pattern: /葉酸|folic\s*acid/i, name: '葉酸', slug: 'folic-acid' },
  { pattern: /ビオチン|biotin/i, name: 'ビオチン', slug: 'biotin' },

  // ミネラル系
  { pattern: /亜鉛|zinc/i, name: '亜鉛', slug: 'zinc' },
  { pattern: /カルシウム|calcium/i, name: 'カルシウム', slug: 'calcium' },
  { pattern: /マグネシウム|magnesium/i, name: 'マグネシウム', slug: 'magnesium' },
  { pattern: /鉄分?(?!板)|iron/i, name: '鉄', slug: 'iron' },
  { pattern: /セレン|selenium/i, name: 'セレン', slug: 'selenium' },

  // オメガ系
  { pattern: /DHA/i, name: 'DHA', slug: 'dha' },
  { pattern: /EPA/i, name: 'EPA', slug: 'epa' },
  { pattern: /オメガ\s*3|omega\s*3/i, name: 'オメガ3', slug: 'omega-3' },

  // プロテイン系
  { pattern: /ホエイ\s*プロテイン|whey\s*protein/i, name: 'ホエイプロテイン', slug: 'whey-protein' },
  { pattern: /ソイ\s*プロテイン|soy\s*protein/i, name: 'ソイプロテイン', slug: 'soy-protein' },
  { pattern: /(?<!ホエイ|ソイ)プロテイン|protein/i, name: 'プロテイン', slug: 'protein' },

  // その他
  { pattern: /コラーゲン|collagen/i, name: 'コラーゲン', slug: 'collagen' },
  { pattern: /乳酸菌|プロバイオティクス|probiotics/i, name: 'プロバイオティクス', slug: 'probiotics' },
  { pattern: /コエンザイム\s*Q10|CoQ10/i, name: 'CoQ10', slug: 'coq10' },
  { pattern: /グルコサミン|glucosamine/i, name: 'グルコサミン', slug: 'glucosamine' },
  { pattern: /コンドロイチン|chondroitin/i, name: 'コンドロイチン', slug: 'chondroitin' },
  { pattern: /ルテイン|lutein/i, name: 'ルテイン', slug: 'lutein' },
  { pattern: /大豆\s*イソフラボン|isoflavone/i, name: '大豆イソフラボン', slug: 'soy-isoflavone' },
  { pattern: /イチョウ葉|ギンコ|ginkgo/i, name: 'ギンコ（イチョウ葉）', slug: 'ginkgo' },
  { pattern: /HMB/i, name: 'HMB', slug: 'hmb' },
  { pattern: /BCAA/i, name: 'BCAA', slug: 'bcaa' },
  { pattern: /クレアチン|creatine/i, name: 'クレアチン', slug: 'creatine' },
];

// 推奨摂取量（RDA）- 自動入力用
const DEFAULT_RDA = {
  'vitamin-c': 100,
  'vitamin-d': 0.02,
  'vitamin-e': 6.5,
  'vitamin-b12': 0.0024,
  'vitamin-b6': 1.4,
  'folic-acid': 0.48,
  'biotin': 0.05,
  'zinc': 11,
  'calcium': 800,
  'magnesium': 340,
  'iron': 10,
  'selenium': 0.03,
  'dha': 1000,
  'epa': 1000,
  'omega-3': 2000,
  'whey-protein': 25000,
  'soy-protein': 20000,
  'protein': 20000,
  'collagen': 5000,
  'probiotics': 1,
  'coq10': 100,
  'glucosamine': 1500,
  'chondroitin': 1200,
  'lutein': 10,
  'soy-isoflavone': 40,
  'ginkgo': 120,
  'hmb': 3000,
  'bcaa': 5000,
  'creatine': 5000,
};

/**
 * 商品名から成分を検出
 * @param {string} productName 商品名
 * @returns {Array<{name: string, slug: string, defaultAmount: number}>}
 */
export function detectIngredients(productName) {
  const detected = [];

  for (const { pattern, name, slug } of INGREDIENT_PATTERNS) {
    if (pattern.test(productName)) {
      detected.push({
        name,
        slug,
        defaultAmount: DEFAULT_RDA[slug] || 1000,
      });
    }
  }

  return detected;
}

/**
 * 成分マスタを作成（存在しない場合のみ）
 * @param {object} client Sanity client
 * @param {string} name 成分名
 * @param {string} slug スラッグ
 * @returns {string} 成分ID
 */
export async function ensureIngredientExists(client, name, slug) {
  const ingredientId = `ingredient-${slug}`;

  // 既存チェック
  const existing = await client.fetch(
    '*[_type == "ingredient" && _id == $id][0]',
    { id: ingredientId }
  );

  if (existing) {
    return ingredientId;
  }

  // 新規作成
  console.log(`  📝 成分マスタ作成: ${name}`);

  await client.createIfNotExists({
    _id: ingredientId,
    _type: 'ingredient',
    name: name,
    slug: { _type: 'slug', current: slug },
    description: `${name}のサプリメント成分`,
    // 基本情報は後で手動補完
  });

  return ingredientId;
}

/**
 * 商品に成分を自動紐付け
 * @param {object} client Sanity client
 * @param {string} productName 商品名
 * @returns {Array<{ingredient: {_type: string, _ref: string}, amountMgPerServing: number, isPrimary: boolean}>}
 */
export async function autoLinkIngredients(client, productName) {
  const detected = detectIngredients(productName);
  const ingredients = [];

  for (let i = 0; i < detected.length; i++) {
    const { name, slug, defaultAmount } = detected[i];
    const ingredientId = await ensureIngredientExists(client, name, slug);

    ingredients.push({
      ingredient: { _type: 'reference', _ref: ingredientId },
      amountMgPerServing: defaultAmount,
      isPrimary: i === 0, // 最初の成分を主成分とする
    });
  }

  return ingredients;
}

export { INGREDIENT_PATTERNS, DEFAULT_RDA };
