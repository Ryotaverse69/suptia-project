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

// Sanityから既存の商品IDリストを取得
export async function fetchExistingProductIds(token) {
  const SANITY_PROJECT_ID = 'fny3jdcg';
  const SANITY_DATASET = 'production';

  const query = '*[_type == "product"]{ itemCode, janCode, source, _id }';
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
  };

  for (const product of data.result) {
    if (product.itemCode) {
      existingProducts.byItemCode.set(product.itemCode, {
        _id: product._id,
        source: product.source,
      });
    }

    if (product.janCode) {
      if (!existingProducts.byJanCode.has(product.janCode)) {
        existingProducts.byJanCode.set(product.janCode, []);
      }
      existingProducts.byJanCode.get(product.janCode).push({
        _id: product._id,
        source: product.source,
      });
    }
  }

  return existingProducts;
}

// 商品が既に存在するかチェック
export function checkDuplicate(product, existingProducts) {
  if (product.itemCode && existingProducts.byItemCode.has(product.itemCode)) {
    const existing = existingProducts.byItemCode.get(product.itemCode);
    return {
      isDuplicate: true,
      reason: `同じitemCodeの商品が既に存在: ${product.itemCode}`,
      existingId: existing._id,
      existingSource: existing.source,
    };
  }

  if (product.janCode && existingProducts.byJanCode.has(product.janCode)) {
    const existingList = existingProducts.byJanCode.get(product.janCode);
    const sameSourceDuplicate = existingList.find(e => e.source === product.source);

    if (sameSourceDuplicate) {
      return {
        isDuplicate: true,
        reason: `同じJANコードかつ同じソースの商品が既に存在: ${product.janCode}`,
        existingId: sameSourceDuplicate._id,
        existingSource: sameSourceDuplicate.source,
      };
    }
  }

  return {
    isDuplicate: false,
    reason: '重複なし',
  };
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
