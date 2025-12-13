/**
 * 商品フィルタリング・重複チェック用の共通ロジック（完全改善版）
 *
 * 目的:
 * 1. 非サプリメント商品の混入を防ぐ（誤検出を最小化）
 * 2. 重複商品の登録を防ぐ
 */

// サプリメント・プロテイン関連のポジティブキーワード
const SUPPLEMENT_KEYWORDS = [
  'サプリメント', 'サプリ', '栄養補助食品', '健康食品', '栄養機能食品',
  'ビタミン', 'マルチビタミン', 'ミネラル', 'カルシウム', 'マグネシウム',
  '鉄', '亜鉛', 'アミノ酸', 'BCAA',
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
  // プロテイン関連
  'プロテイン', 'ホエイ', 'ホエイプロテイン', 'WPI', 'WPC',
  'ソイプロテイン', 'カゼイン', 'カゼインプロテイン',
  'HMB', 'EAA', 'クレアチン', 'グルタミン',
  'ウェイトゲイナー', 'マスゲイナー', 'ウエイトゲイナー',
  'VALX', 'マイプロテイン', 'MYPROTEIN', 'ザバス', 'SAVAS',
  'ビーレジェンド', 'be LEGEND', 'ゴールドスタンダード', 'オプティマム',
];

// サプリメント・プロテインとして許可する例外キーワード
const SUPPLEMENT_WHITELIST_EXCEPTIONS = [
  'DHA', 'EPA', 'DPA', 'オメガ3', 'オメガ-3',
  'フィッシュオイル', '魚油', 'クリルオイル', '青魚',
  '米ぬか', '野菜不足', '青汁', 'にんにく卵黄', '乳酸菌',
  'プロポリス', 'ローヤルゼリー', 'マヌカ', 'はちみつ',
  'カロリミット', 'ダイエットサプリ',
  'リキッド', '液体',
  'ビタミンC', 'ビタミンD', 'ビタミンE', // ビタミンサプリと美容液の併用を許可
  // プロテイン関連
  'プロテイン', 'ホエイ', 'WPI', 'WPC', 'ソイプロテイン',
  'BCAA', 'EAA', 'HMB', 'クレアチン', 'グルタミン',
];

// 絶対除外キーワード（ホワイトリスト例外があっても必ず除外）
const ABSOLUTE_BLACKLIST = [
  // ふるさと納税商品（通常価格ではないため除外）
  'ふるさと納税',

  // 化粧品ブランド（ビタミンC等のサプリ成分名が含まれていても化粧品）
  'COSRX', 'コスアールエックス',
  'ロクシタン', 'シャネル', 'ディオール', 'ランコム',
  'イニスフリー', 'innisfree', 'エチュード', 'ETUDE',
  'ミシャ', 'MISSHA', 'トニーモリー', 'TONYMOLY',
  'ラネージュ', 'LANEIGE', 'スキンフード', 'SKINFOOD',
  'ドクタージャルト', 'Dr.Jart', 'クレドポー',
  'SK-II', 'SKII', 'エスケーツー',
  'KOSE', 'コーセー', 'POLA', 'ポーラ',
  '資生堂', 'SHISEIDO', 'カネボウ', 'KANEBO',
  '雪肌精', 'ルナソル', 'LUNASOL',

  // 明確な化粧品カテゴリ
  '美容液', 'セラム', '化粧水', '乳液',
  'ファンデーション', 'コンシーラー', 'BBクリーム', 'CCクリーム',
  '口紅', 'マスカラ', 'アイライナー', 'アイシャドウ',
  'シャンプー', 'コンディショナー', 'ヘアトリートメント',
  '洗顔料', 'クレンジング', 'メイク落とし',
  '韓国コスメ',
];

// 非サプリメント商品のネガティブキーワード（ホワイトリスト例外でスキップ可能）
const NON_SUPPLEMENT_KEYWORDS = [
  // 家電製品
  'iPhone', 'iPad', 'Android', 'スマホ本体', 'パソコン本体',
  'テレビ', '冷蔵庫', '洗濯機', '掃除機', 'スピーカー',

  // 衣類・ファッション
  'ウォッチ バンド', 'アップルウォッチ バンド',
  '靴', 'スニーカー', 'バッグ', '財布',

  // 化粧品・スキンケア（飲用ではない）
  'ローション', 'トナー', 'エッセンス', 'アンプル',
  'フェイスマスク', 'シートマスク', 'フェイスパック',
  'リップクリーム', 'リップグロス',
  '基礎化粧品', 'コスメティック',
  'ボディクリーム', 'ボディローション', 'ハンドクリーム', 'フェイスクリーム',
  'ヘアオイル',
  '日焼け止め', 'UVケア', 'サンスクリーン',
  'ピーリングジェル', 'スクラブ洗顔',
  'ホワイトニングクリーム', 'ブライトニングクリーム',

  // 調理器具
  'ケーキ型', 'シフォンケーキ型', '鍋', 'フライパン',

  // 食品（一般食品・非サプリメント）
  'いりこ', '小魚おやつ',
  'マヨネーズ', '調味料',

  // ベビー用品
  'スリーパー', 'ガーゼ', 'ベビー服',

  // 保護フィルム
  'ガラスフィルム', '保護フィルム', '液晶保護',

  // 医薬部外品・医薬品
  '医薬部外品', '第1類医薬品', '第2類医薬品', '第3類医薬品',
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

  // 明示的なサプリメント・プロテイン表記があるかチェック
  const hasExplicitSupplementLabel =
    cleanedNameLower.includes('サプリメント') ||
    cleanedNameLower.includes('サプリ') ||
    cleanedNameLower.includes('栄養補助食品') ||
    cleanedNameLower.includes('健康食品') ||
    cleanedNameLower.includes('プロテイン') ||
    cleanedNameLower.includes('ホエイ') ||
    cleanedNameLower.includes('bcaa') ||
    cleanedNameLower.includes('eaa');

  // 絶対除外チェック（最優先 - ただし明示的サプリ表記がある場合は除外しない）
  for (const keyword of ABSOLUTE_BLACKLIST) {
    if (cleanedNameLower.includes(keyword.toLowerCase())) {
      // 商品名に「サプリ」等が含まれる場合、説明文として使われている可能性があるのでスキップ
      if (hasExplicitSupplementLabel) {
        continue;
      }
      return {
        isSupplement: false,
        score: -100,
        reason: `絶対除外キーワード検出: "${keyword}"`,
      };
    }
  }

  // ホワイトリスト例外チェック
  const hasWhitelistException = SUPPLEMENT_WHITELIST_EXCEPTIONS.some(keyword =>
    cleanedNameLower.includes(keyword.toLowerCase())
  );

  // ブラックリストチェック（ホワイトリスト例外がある場合はスキップ可能）
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
 * 改善版:
 * - ブランド名が商品名の任意位置にあっても検出可能
 * - mergeKey（セット数を除外したキー）を生成して重複検出に使用
 * - 形態（ハードカプセル、ソフトカプセル等）を検出
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
    [/(iHerb)/i, 'iherb'],
    [/(Thorne)/i, 'thorne'],
    [/(Pure Encapsulations)/i, 'pure-encapsulations'],
    [/(Nordic Naturals)/i, 'nordic-naturals'],
    [/(Garden of Life)/i, 'garden-of-life'],
    // プロテインブランド
    [/(VALX|バルクス)/i, 'valx'],
    [/(マイプロテイン|MYPROTEIN|Myprotein)/i, 'myprotein'],
    [/(ザバス|SAVAS)/i, 'savas'],
    [/(ビーレジェンド|be LEGEND)/i, 'belegend'],
    [/(ゴールドスタンダード|Gold Standard)/i, 'gold-standard'],
    [/(オプティマム|Optimum)/i, 'optimum'],
    [/(DNS)/i, 'dns'],
    [/(グロング|GronG)/i, 'grong'],
    [/(ハイクリア|HIGH CLEAR)/i, 'high-clear'],
    [/(ウイダー|weider)/i, 'weider'],
    [/(ケンタイ|Kentai)/i, 'kentai'],
    [/(ゴールドジム|GOLD'S GYM)/i, 'golds-gym'],
  ];

  let brand = '';
  for (const [pattern, brandKey] of brandPatterns) {
    if (pattern.test(name)) {
      brand = brandKey;
      break;
    }
  }

  // 日数を抽出（複数日数表記の場合は最小値を使用）
  const multiDaysMatch = name.match(/(\d+)日.*\/.*(\d+)日/);
  const singleDaysMatch = name.match(/(\d+)\s*日\s*分?/);
  let days = null;
  if (multiDaysMatch) {
    // 複数日数表記の場合、商品はバリエーション販売なので特別扱い
    days = 'multi';
  } else if (singleDaysMatch) {
    days = parseInt(singleDaysMatch[1], 10);
  }

  // 粒数を抽出
  const pillsMatch = name.match(/(\d+)\s*(粒|錠|カプセル)/);
  const pills = pillsMatch ? parseInt(pillsMatch[1], 10) : null;

  // 形態を検出
  let form = null;
  if (/ハードカプセル/i.test(name)) {
    form = 'hard-capsule';
  } else if (/ソフトカプセル/i.test(name)) {
    form = 'soft-capsule';
  } else if (/パウダー|粉末/i.test(name)) {
    form = 'powder';
  } else if (/タブレット/i.test(name)) {
    form = 'tablet';
  } else if (/リキッド|液体|ドリンク/i.test(name)) {
    form = 'liquid';
  } else if (/グミ/i.test(name)) {
    form = 'gummy';
  }

  // 主要成分を抽出
  const ingredients = [];
  const ingredientPatterns = [
    [/ビタミン\s*[CＣ]/gi, 'vitamin-c'],
    [/ビタミン\s*[DＤ]/gi, 'vitamin-d'],
    [/ビタミン\s*[EＥ]/gi, 'vitamin-e'],
    [/ビタミン\s*[AＡ]/gi, 'vitamin-a'],
    [/ビタミン\s*B1/gi, 'vitamin-b1'],
    [/ビタミン\s*B2/gi, 'vitamin-b2'],
    [/ビタミン\s*B6/gi, 'vitamin-b6'],
    [/ビタミン\s*B12/gi, 'vitamin-b12'],
    [/マルチビタミン/gi, 'multivitamin'],
    [/カルシウム/gi, 'calcium'],
    [/マグネシウム/gi, 'magnesium'],
    [/亜鉛/gi, 'zinc'],
    [/鉄/gi, 'iron'],
    [/葉酸/gi, 'folic-acid'],
    [/DHA/gi, 'dha'],
    [/EPA/gi, 'epa'],
    [/オメガ\s*3|オメガ-3|Omega-?3/gi, 'omega3'],
    [/コラーゲン/gi, 'collagen'],
    [/グルコサミン/gi, 'glucosamine'],
    [/コンドロイチン/gi, 'chondroitin'],
    [/ルテイン/gi, 'lutein'],
    [/乳酸菌/gi, 'probiotics'],
    [/ビフィズス菌/gi, 'bifidobacterium'],
    [/ナットウキナーゼ/gi, 'nattokinase'],
    [/コエンザイム\s*Q10|CoQ10/gi, 'coq10'],
    [/BCAA/gi, 'bcaa'],
    [/HMB/gi, 'hmb'],
    [/EAA/gi, 'eaa'],
    [/クレアチン/gi, 'creatine'],
    [/グルタミン/gi, 'glutamine'],
    [/ホエイ|WPI|WPC|Whey/gi, 'whey-protein'],
    [/ソイプロテイン|大豆プロテイン/gi, 'soy-protein'],
    [/カゼイン/gi, 'casein-protein'],
    [/プロテイン/gi, 'protein'],
    [/アスタキサンチン/gi, 'astaxanthin'],
    [/セサミン/gi, 'sesamin'],
    [/ブルーベリー/gi, 'blueberry'],
  ];

  for (const [pattern, ingredientKey] of ingredientPatterns) {
    if (pattern.test(name)) {
      ingredients.push(ingredientKey);
    }
  }

  // セット数を抽出
  const setPatterns = [
    /(\d+)\s*(個|袋|本|箱|コ)\s*セット/i,
    /×\s*(\d+)\s*(袋|本|個|箱)/i,
    /\*\s*(\d+)\s*(袋|本|個|箱)/i,
  ];
  let setCount = 1;
  for (const pattern of setPatterns) {
    const match = name.match(pattern);
    if (match) {
      setCount = parseInt(match[1], 10);
      if (setCount > 1) break;
    }
  }

  // 主要成分を1つに絞る（最初に検出された成分）
  const mainIngredient = ingredients[0] || 'unknown';
  const sortedIngredients = [...new Set(ingredients)].sort();

  if (!brand || (!days && !pills && ingredients.length === 0)) return null;

  // mergeKey: セット数を除外した重複検出用キー
  // 同じブランド・成分・日数・形態の商品は、セット数が異なっても同一商品とみなす
  const mergeKey = `${brand}-${mainIngredient}-${days || 'x'}${form ? `-${form}` : ''}`;

  return {
    brand,
    days,
    pills,
    mainIngredient,
    ingredients: sortedIngredients,
    setCount,
    form,
    // key: セット数を含む完全なキー（価格データの重複チェック用）
    key: `${brand}-${mainIngredient}-${days || 'x'}-${setCount}${form ? `-${form}` : ''}`,
    // mergeKey: セット数を除外したキー（商品の重複検出用）
    mergeKey,
  };
}

// Sanityから既存の商品IDリストを取得
export async function fetchExistingProductIds(token) {
  const SANITY_PROJECT_ID = 'fny3jdcg';
  const SANITY_DATASET = 'production';

  const query = '*[_type == "product"]{ itemCode, janCode, source, _id, name, priceData }';
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
    byProductKey: new Map(),      // セット数を含む完全なキー
    byMergeKey: new Map(),        // セット数を除外したキー（重複検出用）
  };

  for (const product of data.result) {
    if (product.itemCode) {
      existingProducts.byItemCode.set(product.itemCode, {
        _id: product._id,
        source: product.source,
        name: product.name,
        priceData: product.priceData,
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
        priceData: product.priceData,
      });
    }

    // 商品キーを生成して登録
    const productKey = generateProductKey(product.name);
    if (productKey) {
      // 完全なキー（セット数を含む）
      if (!existingProducts.byProductKey.has(productKey.key)) {
        existingProducts.byProductKey.set(productKey.key, []);
      }
      existingProducts.byProductKey.get(productKey.key).push({
        _id: product._id,
        source: product.source,
        name: product.name,
        productKey,
        priceData: product.priceData,
      });

      // mergeKey（セット数を除外）で登録
      if (!existingProducts.byMergeKey.has(productKey.mergeKey)) {
        existingProducts.byMergeKey.set(productKey.mergeKey, []);
      }
      existingProducts.byMergeKey.get(productKey.mergeKey).push({
        _id: product._id,
        source: product.source,
        name: product.name,
        productKey,
        priceData: product.priceData,
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
      existingName: existing.name,
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
        existingName: existingList[0].name,
        shouldMergePrice: true, // 価格データのみマージすべき
      };
    }
  }

  // 3. 商品キーを生成
  const productKey = generateProductKey(product.name);
  if (!productKey) {
    return {
      isDuplicate: false,
      reason: '商品キーを生成できませんでした（ブランドまたは成分が検出できない）',
    };
  }

  // 4. mergeKey（セット数を除外）で重複チェック
  // 同じブランド・成分・日数・形態の商品は、セット数が異なっても同一商品とみなす
  if (existingProducts.byMergeKey.has(productKey.mergeKey)) {
    const existingList = existingProducts.byMergeKey.get(productKey.mergeKey);
    if (existingList.length > 0) {
      // 最もデータが充実している既存商品を選択（priceDataが多い方を優先）
      const sortedExisting = existingList.sort((a, b) => {
        const aLen = a.priceData?.length || 0;
        const bLen = b.priceData?.length || 0;
        return bLen - aLen;
      });
      const primary = sortedExisting[0];

      return {
        isDuplicate: true,
        reason: `同じmergeKeyの商品が既に存在: ${productKey.mergeKey}`,
        existingId: primary._id,
        existingSource: primary.source,
        existingName: primary.name,
        shouldMergePrice: true, // 価格データのみマージすべき
        productKey,
        setCount: productKey.setCount, // セット数情報を含める
      };
    }
  }

  // 5. 完全なキー（セット数を含む）で重複チェック（フォールバック）
  if (existingProducts.byProductKey.has(productKey.key)) {
    const existingList = existingProducts.byProductKey.get(productKey.key);
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
    productKey,
  };
}

// 既存商品に価格データを追加（重複商品の価格統合用）
// setCount: セット数（2以上の場合、セット商品として記録）
// originalProductName: マージ元の商品名（セット商品の場合、元の商品名を記録）
export async function addPriceToExistingProduct(existingId, priceData, token, options = {}) {
  const SANITY_PROJECT_ID = 'fny3jdcg';
  const SANITY_DATASET = 'production';

  const { setCount = 1, originalProductName = null } = options;

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

  // 重複チェック（ソース＋金額＋セット数）
  const priceKey = `${priceData.source}-${priceData.amount}-${setCount}`;
  const isDuplicatePrice = existingPriceData.some(pd => {
    const existingKey = `${pd.source}-${pd.amount}-${pd.quantity || 1}`;
    return existingKey === priceKey;
  });

  if (isDuplicatePrice) {
    return { success: true, skipped: true, reason: '同じ価格データが既に存在' };
  }

  // セット情報を含めた価格データを作成
  const enrichedPriceData = {
    ...priceData,
  };

  // セット商品の場合、セット情報を追加
  if (setCount > 1) {
    enrichedPriceData.quantity = setCount;
    enrichedPriceData.setLabel = `${setCount}個セット`;
    // 単価を計算
    if (priceData.amount && !priceData.unitPrice) {
      enrichedPriceData.unitPrice = Math.round(priceData.amount / setCount);
    }
  }

  // 元の商品名を保持（デバッグ・トレース用）
  if (originalProductName) {
    enrichedPriceData.originalProductName = originalProductName;
  }

  // 価格データを追加
  const mutations = [
    {
      patch: {
        id: existingId,
        setIfMissing: { priceData: [] },
        insert: {
          after: 'priceData[-1]',
          items: [enrichedPriceData],
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

  return { success: true, merged: true, setCount };
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

// generateProductKeyをエクスポート（同期スクリプトからセット情報を取得する用途）
export { generateProductKey };
