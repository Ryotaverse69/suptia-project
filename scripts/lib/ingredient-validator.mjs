/**
 * 成分量バリデーター
 * 同期スクリプトで使用して、異常値を事前に検出・修正する
 */

// 推奨1日摂取量（mg）
const RDA = {
  'ビタミンC': 100,
  'ビタミンC（アスコルビン酸）': 100,
  'ビタミンD': 0.02,
  'ビタミンD3': 0.02,
  'ビタミンE': 6.5,
  'ビタミンB1': 1.4,
  'ビタミンB2': 1.6,
  'ビタミンB6': 1.4,
  'ビタミンB12': 0.0024,
  '葉酸': 0.48,
  'ビオチン': 0.05,
  'ビタミンK': 0.15,
  'カルシウム': 800,
  'マグネシウム': 340,
  '亜鉛': 11,
  '鉄': 10,
  '銅': 0.9,
  'セレン': 0.03,
  'オメガ3': 2000,
  'DHA': 1000,
  'EPA': 1000,
  'コラーゲン': 5000,
  'ホエイプロテイン': 25000,
  'プロテイン': 20000,
  '大豆イソフラボン': 40,
  'ギンコ（イチョウ葉）': 120,
  'プロバイオティクス': 1, // CFUベースなので参考値
};

// μg単位で表記されることが多い成分
const MCG_INGREDIENTS = [
  '葉酸', 'ビオチン', 'ビタミンB12', 'ビタミンD', 'ビタミンD3',
  'ビタミンK', 'セレン', 'クロム', 'モリブデン'
];

/**
 * 成分量をバリデート・修正
 * @param {string} ingredientName 成分名
 * @param {number} amount 入力された量（mg）
 * @param {string} productName 商品名（パターン抽出用）
 * @returns {{ value: number, warning?: string, autoFixed: boolean }}
 */
export function validateIngredientAmount(ingredientName, amount, productName = '') {
  const rda = RDA[ingredientName];

  // 0または未定義の場合
  if (!amount || amount === 0) {
    const extracted = extractAmountFromProductName(productName, ingredientName);
    if (extracted) {
      return {
        value: extracted,
        warning: `0mgを商品名から${extracted}mgに自動修正`,
        autoFixed: true
      };
    }
    if (rda) {
      return {
        value: rda,
        warning: `0mgをRDA値${rda}mgに自動修正`,
        autoFixed: true
      };
    }
    return {
      value: 0,
      warning: '成分量が0mgです。手動確認が必要',
      autoFixed: false
    };
  }

  // μg→mg変換ミスの検出
  if (MCG_INGREDIENTS.includes(ingredientName) && rda) {
    if (amount >= rda * 500) {
      const corrected = amount / 1000;
      return {
        value: corrected,
        warning: `μg→mg変換ミス: ${amount}mg → ${corrected}mg`,
        autoFixed: true
      };
    }
  }

  // 極端に大きい値（100,000mg以上）
  if (amount >= 100000) {
    if (ingredientName === 'コラーゲン') {
      return {
        value: 5000,
        warning: `異常値${amount}mgを5000mgに修正`,
        autoFixed: true
      };
    }
    return {
      value: amount,
      warning: `極端な値: ${amount}mg。手動確認が必要`,
      autoFixed: false
    };
  }

  // RDAの1000倍以上
  if (rda && amount > rda * 1000) {
    return {
      value: amount,
      warning: `推奨量の${Math.round(amount / rda)}倍。確認推奨`,
      autoFixed: false
    };
  }

  // RDAの1%未満（異常に少ない）
  if (rda && amount < rda * 0.01 && amount > 0) {
    // プロバイオティクスは例外
    if (ingredientName === 'プロバイオティクス') {
      return { value: amount, autoFixed: false };
    }
    return {
      value: amount,
      warning: `推奨量の${(amount / rda * 100).toFixed(2)}%。確認推奨`,
      autoFixed: false
    };
  }

  return { value: amount, autoFixed: false };
}

/**
 * 商品名から成分量を抽出
 */
function extractAmountFromProductName(productName, ingredientName) {
  if (!productName) return null;

  const patterns = [
    /(\d+(?:,\d+)?)\s*mg/i,
    /(\d+(?:\.\d+)?)\s*g(?!ram)/i,
    /(\d+(?:,\d+)?)\s*粒/,
  ];

  // 成分名に関連するパターン
  const ingredientPatterns = {
    'ビタミンC': [/ビタミン\s*C\s*(\d+)/i, /C\s*(\d+)\s*mg/i],
    'ビタミンD': [/ビタミン\s*D\s*(\d+)/i, /D3?\s*(\d+)/i],
    'DHA': [/DHA\s*(\d+)/i],
    'EPA': [/EPA\s*(\d+)/i],
    'コラーゲン': [/コラーゲン\s*(\d+)/i],
  };

  const specificPatterns = ingredientPatterns[ingredientName];
  if (specificPatterns) {
    for (const pattern of specificPatterns) {
      const match = productName.match(pattern);
      if (match) {
        return parseInt(match[1].replace(',', ''), 10);
      }
    }
  }

  return null;
}

/**
 * 複数の成分をまとめてバリデート
 */
export function validateIngredients(ingredients, productName = '') {
  const results = [];
  const warnings = [];

  for (const ing of ingredients) {
    const validation = validateIngredientAmount(
      ing.ingredientName,
      ing.amountMgPerServing,
      productName
    );

    results.push({
      ...ing,
      amountMgPerServing: validation.value,
      autoFixed: validation.autoFixed
    });

    if (validation.warning) {
      warnings.push(`${ing.ingredientName}: ${validation.warning}`);
    }
  }

  return { ingredients: results, warnings };
}

export { RDA, MCG_INGREDIENTS };
