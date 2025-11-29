/**
 * 商品フィルタリング・重複チェック用の共通ロジック（完全改善版）
 *
 * 目的:
 * 1. 非サプリメント商品の混入を防ぐ（誤検出を最小化）
 * 2. 重複商品の登録を防ぐ
 */

// サプリメント関連のポジティブキーワード
const SUPPLEMENT_KEYWORDS = [
  'サプリメント', 'サプリ', '栄養補助食品', '健康食品', '栄養機能食品',
  'ビタミン', 'マルチビタミン', 'ミネラル', 'カルシウム', 'マグネシウム',
  '鉄', '亜鉛', 'プロテイン', 'アミノ酸', 'BCAA',
  'オメガ3', 'オメガ-3', 'DHA', 'EPA', 'DPA',
  'フィッシュオイル', '魚油', 'クリルオイル',
  'コラーゲン', 'グルコサミン', 'コンドロイチン',
  '乳酸菌', 'ビフィズス菌', 'プロバイオティクス',
  'プロポリス', 'ローヤルゼリー', 'マヌカ',
  'カロリミット', 'ダイエットサプリ', 'ファンケル', 'DHC',
  'リキッド', '液体サプリ', 'ドリンク',
  'ハードカプセル', 'ソフトカプセル', 'カプセル',
  'タブレット', '錠', '粒',
  '30日分', '60日分', '90日分', '180日分',
];

// サプリメントとして許可する例外キーワード
const SUPPLEMENT_WHITELIST_EXCEPTIONS = [
  'DHA', 'EPA', 'DPA', 'オメガ3', 'オメガ-3',
  'フィッシュオイル', '魚油', 'クリルオイル', '青魚',
  '米ぬか', '野菜不足', '青汁', 'にんにく卵黄', '乳酸菌',
  'プロポリス', 'ローヤルゼリー', 'マヌカ', 'はちみつ',
  'カロリミット', 'ダイエットサプリ',
  'リキッド', '液体',
  'ビタミンC', 'ビタミンD', 'ビタミンE', // ビタミンサプリと美容液の併用を許可
];

// 非サプリメント商品のネガティブキーワード（厳格版）
const NON_SUPPLEMENT_KEYWORDS = [
  // 家電製品
  'iPhone', 'iPad', 'Android', 'スマホ本体', 'パソコン本体',
  'テレビ', '冷蔵庫', '洗濯機', '掃除機', 'スピーカー',

  // 衣類・ファッション
  'ウォッチ バンド', 'アップルウォッチ バンド',
  '靴', 'スニーカー', 'バッグ', '財布',

  // 化粧品（飲用ではない）
  '美容液', 'セラム', '化粧水', '乳液',

  // 調理器具
  'ケーキ型', 'シフォンケーキ型', '鍋', 'フライパン',

  // 食品（一般食品・非サプリメント）
  'いりこ', '小魚おやつ',
  'マヨネーズ', '調味料',

  // ベビー用品
  'スリーパー', 'ガーゼ', 'ベビー服',

  // 保護フィルム
  'ガラスフィルム', '保護フィルム', '液晶保護',
];

// プロモーション文字列を除去
function removePromotionalText(text) {
  if (!text) return '';

  return text
    .replace(/[0-9０-９]+円?OFF[クーポン]*/g, '')
    .replace(/クーポンで[0-9０-９]+%?OFF/g, '')
    .replace(/ポイント[0-9０-９]+倍/g, '')
    .replace(/P[0-9０-９]+倍/g, '')
    .replace(/最大[0-9０-９]+%?OFF/g, '')
    .replace(/楽天お買い物マラソン/g, '')
    .replace(/タイムセール/g, '')
    .replace(/送料無料/g, '')
    .replace(/ふるさと納税/g, '')
    .replace(/レビューキャンペーン/g, '')
    .replace(/\\[^\\／]*\\/g, '')
    .replace(/【[^】]*】/g, '')
    .trim();
}

// 商品名がサプリメントかどうかを判定
export function isSupplement(productName) {
  if (!productName) {
    return { isSupplement: false, score: 0, reason: '商品名が空' };
  }

  const cleanedName = removePromotionalText(productName);
  const cleanedNameLower = cleanedName.toLowerCase();

  // ホワイトリスト例外チェック（最優先）
  const hasWhitelistException = SUPPLEMENT_WHITELIST_EXCEPTIONS.some(keyword =>
    cleanedNameLower.includes(keyword.toLowerCase())
  );

  // ブラックリストチェック
  for (const keyword of NON_SUPPLEMENT_KEYWORDS) {
    if (cleanedNameLower.includes(keyword.toLowerCase())) {
      if (hasWhitelistException) {
        continue;
      }
      return {
        isSupplement: false,
        score: -100,
        reason: `非サプリメントキーワード検出: "${keyword}"`,
      };
    }
  }

  // ホワイトリストチェック
  let score = 0;
  const matchedKeywords = [];

  for (const keyword of SUPPLEMENT_KEYWORDS) {
    if (cleanedNameLower.includes(keyword.toLowerCase())) {
      score += 10;
      matchedKeywords.push(keyword);
    }
  }

  const isSupplement = score >= 10;  // 1つ以上のキーワードマッチで判定

  return {
    isSupplement,
    score,
    reason: isSupplement
      ? `サプリメントキーワード検出: ${matchedKeywords.slice(0, 3).join(', ')}`
      : 'サプリメント関連キーワードが不足',
    matchedKeywords,
  };
}

// 商品カテゴリがサプリメントかどうかを判定
export function isSupplementCategory(categoryPath) {
  if (!categoryPath) return false;

  const SUPPLEMENT_CATEGORIES = [
    'サプリメント', '健康食品', 'ダイエット・健康',
    '栄養補助食品', 'プロテイン', 'ビタミン', 'ミネラル',
  ];

  const categoryLower = categoryPath.toLowerCase();
  return SUPPLEMENT_CATEGORIES.some(cat =>
    categoryLower.includes(cat.toLowerCase())
  );
}

// 商品が本当にサプリメントかどうかを総合判定
export function validateProduct(product) {
  const nameCheck = isSupplement(product.name);

  const categoryValid = product.genreId
    ? isSupplementCategory(product.genreId)
    : product.categoryPath
    ? isSupplementCategory(product.categoryPath)
    : false;

  if (nameCheck.score === -100) {
    return {
      isValid: false,
      reason: nameCheck.reason,
      score: nameCheck.score,
    };
  }

  const isValid = nameCheck.isSupplement || categoryValid;

  return {
    isValid,
    reason: isValid
      ? `商品名: ${nameCheck.reason}, カテゴリ: ${categoryValid ? 'OK' : 'NG'}`
      : `サプリメントとして不適格: ${nameCheck.reason}`,
    score: nameCheck.score,
    nameCheck,
    categoryValid,
  };
}

/**
 * 商品名から識別キーを生成（重複検出用）
 *
 * 改善版: ブランド名が商品名の任意位置にあっても検出可能
 */
function generateProductKey(name) {
  if (!name) return null;

  // ブランド名を正規化（商品名の任意位置から検出）
  const brandPatterns = [
    [/(DHC|ディーエイチシー)/i, 'dhc'],
    [/(ディアナチュラ|Dear-?Natura)/i, 'dear-natura'],
    [/(ネイチャーメイド|Nature Made)/i, 'nature-made'],
    [/(FANCL|ファンケル)/i, 'fancl'],
    [/(小林製薬)/i, 'kobayashi'],
    [/(大塚製薬)/i, 'otsuka'],
    [/(アサヒ)/i, 'asahi'],
    [/(UHA味覚糖)/i, 'uha'],
    [/(NOW Foods|ナウフーズ)/i, 'now-foods'],
    [/(Doctor's Best)/i, 'doctors-best'],
    [/(Solgar|ソルガー)/i, 'solgar'],
    [/(Life Extension)/i, 'life-extension'],
    [/(Jarrow Formulas)/i, 'jarrow'],
    [/(Swanson)/i, 'swanson'],
    [/(Source Naturals)/i, 'source-naturals'],
    [/(California Gold)/i, 'california-gold'],
  ];

  let brand = '';
  for (const [pattern, brandKey] of brandPatterns) {
    if (pattern.test(name)) {
      brand = brandKey;
      break;
    }
  }

  // 日数を抽出
  const daysMatch = name.match(/(\d+)\s*日\s*分?/);
  const days = daysMatch ? parseInt(daysMatch[1], 10) : null;

  // 粒数を抽出
  const pillsMatch = name.match(/(\d+)\s*(粒|錠|カプセル)/);
  const pills = pillsMatch ? parseInt(pillsMatch[1], 10) : null;

  // 主要成分を抽出
  const ingredients = [];
  const ingredientPatterns = [
    /ビタミン\s*[A-Za-zａ-ｚ]+\d*/gi,
    /マルチビタミン/gi,
    /カルシウム/gi,
    /マグネシウム/gi,
    /亜鉛/gi,
    /鉄/gi,
    /葉酸/gi,
    /DHA/gi,
    /EPA/gi,
    /コラーゲン/gi,
    /グルコサミン/gi,
    /ルテイン/gi,
    /乳酸菌/gi,
    /ナットウキナーゼ/gi,
  ];

  for (const pattern of ingredientPatterns) {
    const matches = name.match(pattern);
    if (matches) {
      for (const match of matches) {
        ingredients.push(match.toLowerCase().replace(/\s+/g, ''));
      }
    }
  }

  // セット数を抽出
  const setPatterns = [
    /(\d+)\s*(個|袋|本|箱|コ)\s*セット/i,
    /×\s*(\d+)\s*(袋|本|個|箱)/i,
  ];
  let setCount = null;
  for (const pattern of setPatterns) {
    const match = name.match(pattern);
    if (match) {
      setCount = parseInt(match[1], 10);
      if (setCount > 1) break;
    }
  }

  if (!brand || (!days && !pills)) return null;

  return {
    brand,
    days,
    pills,
    ingredients: [...new Set(ingredients)].sort(),
    setCount,
    key: `${brand}-${days || 'x'}-${pills || 'x'}-${setCount || '1'}-${ingredients.slice(0, 3).join(',')}`,
  };
}

// Sanityから既存の商品IDリストを取得
export async function fetchExistingProductIds(token) {
  const SANITY_PROJECT_ID = 'fny3jdcg';
  const SANITY_DATASET = 'production';

  const query = '*[_type == "product"]{ itemCode, janCode, source, _id, name }';
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}&perspective=previewDrafts`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }

  const data = await response.json();

  const existingProducts = {
    byItemCode: new Map(),
    byJanCode: new Map(),
    byProductKey: new Map(),
  };

  for (const product of data.result) {
    if (product.itemCode) {
      existingProducts.byItemCode.set(product.itemCode, {
        _id: product._id,
        source: product.source,
        name: product.name,
      });
    }

    if (product.janCode) {
      if (!existingProducts.byJanCode.has(product.janCode)) {
        existingProducts.byJanCode.set(product.janCode, []);
      }
      existingProducts.byJanCode.get(product.janCode).push({
        _id: product._id,
        source: product.source,
        name: product.name,
      });
    }

    // 商品キーを生成して登録
    const productKey = generateProductKey(product.name);
    if (productKey) {
      if (!existingProducts.byProductKey.has(productKey.key)) {
        existingProducts.byProductKey.set(productKey.key, []);
      }
      existingProducts.byProductKey.get(productKey.key).push({
        _id: product._id,
        source: product.source,
        name: product.name,
        productKey,
      });
    }
  }

  return existingProducts;
}

// 商品が既に存在するかチェック
export function checkDuplicate(product, existingProducts) {
  // 1. itemCodeで重複チェック（最優先）
  if (product.itemCode && existingProducts.byItemCode.has(product.itemCode)) {
    const existing = existingProducts.byItemCode.get(product.itemCode);
    return {
      isDuplicate: true,
      reason: `同じitemCodeの商品が既に存在: ${product.itemCode}`,
      existingId: existing._id,
      existingSource: existing.source,
    };
  }

  // 2. JANコードで重複チェック
  if (product.janCode && existingProducts.byJanCode.has(product.janCode)) {
    const existingList = existingProducts.byJanCode.get(product.janCode);
    // JANコードが一致する場合は、同一商品の可能性が高い
    // 価格データを統合するため、既存商品のIDを返す
    if (existingList.length > 0) {
      return {
        isDuplicate: true,
        reason: `同じJANコードの商品が既に存在: ${product.janCode}`,
        existingId: existingList[0]._id,
        existingSource: existingList[0].source,
        shouldMergePrice: true, // 価格データのみマージすべき
      };
    }
  }

  // 3. 商品キー（ブランド+日数+成分）で重複チェック
  const productKey = generateProductKey(product.name);
  if (productKey && existingProducts.byProductKey.has(productKey.key)) {
    const existingList = existingProducts.byProductKey.get(productKey.key);
    // 既存商品と同じ基本構成の場合は重複とみなす
    if (existingList.length > 0) {
      return {
        isDuplicate: true,
        reason: `同じ商品キーの商品が既に存在: ${productKey.key}`,
        existingId: existingList[0]._id,
        existingSource: existingList[0].source,
        existingName: existingList[0].name,
        shouldMergePrice: true, // 価格データのみマージすべき
        productKey,
      };
    }
  }

  return {
    isDuplicate: false,
    reason: '重複なし',
  };
}

// 既存商品に価格データを追加（重複商品の価格統合用）
export async function addPriceToExistingProduct(existingId, priceData, token) {
  const SANITY_PROJECT_ID = 'fny3jdcg';
  const SANITY_DATASET = 'production';

  // まず既存の商品を取得
  const query = `*[_type == "product" && _id == "${existingId}"][0]{ priceData }`;
  const queryUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

  const queryResponse = await fetch(queryUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!queryResponse.ok) {
    throw new Error(`Sanity query error: ${queryResponse.status}`);
  }

  const queryData = await queryResponse.json();
  const existingPriceData = queryData.result?.priceData || [];

  // 重複チェック（ソース＋金額＋店舗名）
  const priceKey = `${priceData.source}-${priceData.amount}-${priceData.storeName || priceData.shopName || ''}`;
  const isDuplicatePrice = existingPriceData.some(pd => {
    const existingKey = `${pd.source}-${pd.amount}-${pd.storeName || pd.shopName || ''}`;
    return existingKey === priceKey;
  });

  if (isDuplicatePrice) {
    return { success: true, skipped: true, reason: '同じ価格データが既に存在' };
  }

  // 価格データを追加
  const mutations = [
    {
      patch: {
        id: existingId,
        setIfMissing: { priceData: [] },
        insert: {
          after: 'priceData[-1]',
          items: [priceData],
        },
      },
    },
  ];

  const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/mutate/${SANITY_DATASET}`;
  const mutateResponse = await fetch(mutateUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  if (!mutateResponse.ok) {
    const error = await mutateResponse.json();
    throw new Error(`Sanity mutation error: ${JSON.stringify(error)}`);
  }

  return { success: true, merged: true };
}

// フィルタリング統計を集計
export function generateFilterStats(products, validProducts, duplicates) {
  const invalidProducts = products.filter(p => {
    const validation = validateProduct(p);
    return !validation.isValid;
  });

  const stats = {
    total: products.length,
    valid: validProducts.length,
    invalid: invalidProducts.length,
    duplicates: duplicates.length,
    accepted: validProducts.length - duplicates.length,
    rejectionReasons: {},
  };

  for (const product of invalidProducts) {
    const validation = validateProduct(product);
    const reason = validation.reason;
    stats.rejectionReasons[reason] = (stats.rejectionReasons[reason] || 0) + 1;
  }

  return stats;
}

// フィルタリング統計を見やすく表示
export function printFilterStats(stats) {
  console.log('\n📊 フィルタリング統計:');
  console.log(`  取得商品数: ${stats.total}件`);
  console.log(`  有効商品数: ${stats.valid}件`);
  console.log(`  無効商品数: ${stats.invalid}件`);
  console.log(`  重複商品数: ${stats.duplicates}件`);
  console.log(`  最終登録数: ${stats.accepted}件`);

  if (Object.keys(stats.rejectionReasons).length > 0) {
    console.log('\n❌ 却下理由:');
    for (const [reason, count] of Object.entries(stats.rejectionReasons)) {
      console.log(`  - ${reason}: ${count}件`);
    }
  }
}
