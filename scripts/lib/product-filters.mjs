/**
 * 商品フィルタリング・重複チェック用の共通ロジック
 *
 * 目的:
 * 1. 非サプリメント商品の混入を防ぐ
 * 2. 重複商品の登録を防ぐ
 */

// ========================================
// サプリメント判定用キーワード
// ========================================

/**
 * サプリメント関連のポジティブキーワード（ホワイトリスト）
 * これらのキーワードを含む商品はサプリメントの可能性が高い
 */
const SUPPLEMENT_KEYWORDS = [
  // 基本用語
  'サプリメント', 'サプリ', '栄養補助食品', '健康食品', '栄養機能食品',

  // ビタミン類
  'ビタミン', 'マルチビタミン', 'ビタミンA', 'ビタミンB', 'ビタミンC', 'ビタミンD', 'ビタミンE', 'ビタミンK',
  'ナイアシン', '葉酸', 'パントテン酸', 'ビオチン',

  // ミネラル類
  'ミネラル', 'カルシウム', 'マグネシウム', '鉄', '亜鉛', 'セレン', 'クロム', 'ヨウ素',

  // アミノ酸・タンパク質
  'プロテイン', 'アミノ酸', 'BCAA', 'グルタミン', 'アルギニン', 'シトルリン', 'オルニチン',

  // 脂肪酸
  'オメガ3', 'オメガ6', 'DHA', 'EPA', 'フィッシュオイル', '魚油',

  // 特定成分
  'コラーゲン', 'グルコサミン', 'コンドロイチン', 'ヒアルロン酸', 'プラセンタ',
  'コエンザイムQ10', 'CoQ10', 'αリポ酸', 'Lカルニチン',

  // 植物由来成分
  'マカ', '高麗人参', 'ウコン', 'クルクミン', 'ルテイン', 'アスタキサンチン',
  'レスベラトロール', 'イソフラボン', 'リコピン', 'アントシアニン',

  // プロバイオティクス
  '乳酸菌', 'ビフィズス菌', 'プロバイオティクス', '善玉菌', '腸活',

  // その他
  'マルチミネラル', '総合栄養', '栄養素', '健康維持', '美容サポート',
  'ダイエットサポート', 'エイジングケア', '疲労回復', '免疫サポート',

  // 形状・タイプ
  'カプセル', '錠剤', 'タブレット', 'ソフトカプセル', 'ハードカプセル',
  '粉末タイプ', '顆粒', 'ドリンクタイプ', 'ゼリータイプ',

  // 期間・容量
  '30日分', '60日分', '90日分', '180日分', '徳用',
];

/**
 * 非サプリメント商品のネガティブキーワード（ブラックリスト）
 * これらのキーワードを含む商品は除外する
 */
const NON_SUPPLEMENT_KEYWORDS = [
  // 食品類
  'お米', '米', 'ご飯', 'パン', '麺', 'パスタ', 'うどん', 'そば',
  '野菜', '果物', '肉', '魚', '卵', '牛乳', 'チーズ', 'ヨーグルト',
  '調味料', '醤油', '味噌', 'ソース', 'ドレッシング', 'オイル',
  'お菓子', 'スナック', 'チョコレート', 'クッキー', 'ケーキ',
  '飲料', 'ジュース', 'お茶', 'コーヒー', 'ワイン', 'ビール', '酒',

  // 家電製品
  'エアコン', '冷蔵庫', '洗濯機', '掃除機', '電子レンジ', '炊飯器',
  'テレビ', 'パソコン', 'スマホ', 'カメラ', 'プリンター',
  'ドライヤー', 'アイロン', '扇風機', 'ヒーター', '加湿器',

  // 衣類・ファッション
  '服', 'シャツ', 'パンツ', 'スカート', 'ワンピース', 'コート',
  '靴', 'スニーカー', 'ブーツ', 'サンダル', 'バッグ', '財布',
  'アクセサリー', 'ネックレス', 'ピアス', '時計', 'メガネ',

  // 書籍・メディア
  '本', '書籍', '雑誌', 'マンガ', '漫画', 'CD', 'DVD', 'ブルーレイ',
  'ゲーム', 'ゲームソフト',

  // 日用品
  '洗剤', '柔軟剤', 'シャンプー', 'リンス', '石鹸', 'ボディソープ',
  '歯ブラシ', '歯磨き粉', 'タオル', 'ティッシュ', 'トイレットペーパー',

  // 家具・インテリア
  '家具', 'テーブル', '椅子', 'ソファ', 'ベッド', '棚', 'ラック',
  'カーテン', 'ラグ', 'マット', 'クッション', '照明', 'ライト',

  // 調理器具
  '鍋', 'フライパン', '包丁', 'まな板', 'ボウル', '食器', '皿', 'コップ',
  'ストウブ', 'ル・クルーゼ', '圧力鍋', '土鍋',

  // ソフトウェア・デジタル商品
  'ソフトウェア', 'アプリ', 'セキュリティソフト', 'ノートン', 'ウイルスバスター',
  'Office', 'Windows', 'Mac',

  // その他
  'ふるさと納税', '旅行', 'チケット', 'ギフト券', 'クーポン',
  'ペット用品', 'ベビー用品', '文房具', 'おもちゃ', 'スポーツ用品',
];

/**
 * サプリメントカテゴリのキーワード（楽天・Yahooのカテゴリ名で判定）
 */
const SUPPLEMENT_CATEGORIES = [
  'サプリメント',
  '健康食品',
  'ダイエット・健康',
  '栄養補助食品',
  '栄養・健康ドリンク',
  'プロテイン',
  'ビタミン',
  'ミネラル',
];

// ========================================
// フィルタリング関数
// ========================================

/**
 * 商品名がサプリメントかどうかを判定
 * @param {string} productName - 商品名
 * @returns {object} { isSupplement: boolean, score: number, reason: string }
 */
export function isSupplement(productName) {
  if (!productName) {
    return { isSupplement: false, score: 0, reason: '商品名が空' };
  }

  const nameLower = productName.toLowerCase();

  // ブラックリストチェック（優先）
  for (const keyword of NON_SUPPLEMENT_KEYWORDS) {
    if (nameLower.includes(keyword.toLowerCase())) {
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
    if (nameLower.includes(keyword.toLowerCase())) {
      score += 10;
      matchedKeywords.push(keyword);
    }
  }

  // スコアが30以上ならサプリメントと判定（3つ以上のキーワードマッチ）
  const isSupplement = score >= 30;

  return {
    isSupplement,
    score,
    reason: isSupplement
      ? `サプリメントキーワード検出: ${matchedKeywords.join(', ')}`
      : 'サプリメント関連キーワードが不足',
    matchedKeywords,
  };
}

/**
 * 商品カテゴリがサプリメントかどうかを判定
 * @param {string} categoryPath - カテゴリパス（例: "ダイエット・健康 > サプリメント"）
 * @returns {boolean}
 */
export function isSupplementCategory(categoryPath) {
  if (!categoryPath) return false;

  const categoryLower = categoryPath.toLowerCase();

  return SUPPLEMENT_CATEGORIES.some(cat =>
    categoryLower.includes(cat.toLowerCase())
  );
}

/**
 * 商品が本当にサプリメントかどうかを総合判定
 * @param {object} product - 商品データ（name, genreId, categoryPath等）
 * @returns {object} { isValid: boolean, reason: string, score: number }
 */
export function validateProduct(product) {
  const nameCheck = isSupplement(product.name);

  // カテゴリチェック
  const categoryValid = product.genreId
    ? isSupplementCategory(product.genreId)
    : product.categoryPath
    ? isSupplementCategory(product.categoryPath)
    : false;

  // 最終判定
  // 1. ブラックリストに該当したら即却下
  if (nameCheck.score === -100) {
    return {
      isValid: false,
      reason: nameCheck.reason,
      score: nameCheck.score,
    };
  }

  // 2. 商品名がサプリメントキーワードを含むか、カテゴリがサプリメントならOK
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

// ========================================
// 重複チェック関数
// ========================================

/**
 * Sanityから既存の商品IDリストを取得
 * @param {string} token - Sanity APIトークン
 * @returns {Promise<Set<string>>} 既存のitemCodeまたはjanCodeのセット
 */
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

  // itemCode と janCode のマップを作成
  const existingProducts = {
    byItemCode: new Map(), // key: itemCode, value: { _id, source }
    byJanCode: new Map(),  // key: janCode, value: [{ _id, source }, ...]
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

/**
 * 商品が既に存在するかチェック
 * @param {object} product - チェックする商品データ
 * @param {object} existingProducts - 既存商品のマップ
 * @returns {object} { isDuplicate: boolean, reason: string, existingId?: string }
 */
export function checkDuplicate(product, existingProducts) {
  // itemCodeでチェック（同一ソース内での重複）
  if (product.itemCode && existingProducts.byItemCode.has(product.itemCode)) {
    const existing = existingProducts.byItemCode.get(product.itemCode);
    return {
      isDuplicate: true,
      reason: `同じitemCodeの商品が既に存在: ${product.itemCode}`,
      existingId: existing._id,
      existingSource: existing.source,
    };
  }

  // JANコードでチェック（異なるソース間での重複は許可）
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

// ========================================
// 統計情報
// ========================================

/**
 * フィルタリング統計を集計
 * @param {Array} products - 商品リスト
 * @param {Array} validProducts - 有効な商品リスト
 * @param {Array} duplicates - 重複商品リスト
 * @returns {object} 統計情報
 */
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

  // 却下理由を集計
  for (const product of invalidProducts) {
    const validation = validateProduct(product);
    const reason = validation.reason;
    stats.rejectionReasons[reason] = (stats.rejectionReasons[reason] || 0) + 1;
  }

  return stats;
}

/**
 * フィルタリング統計を見やすく表示
 * @param {object} stats - 統計情報
 */
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
