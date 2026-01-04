/**
 * Intent Classification Dictionaries
 *
 * 辞書マッチ・パターンマッチ用のデータ
 */

/**
 * 主要な成分名キーワード
 * - 完全一致・部分一致で検索キーワードを判定
 */
export const INGREDIENT_KEYWORDS: string[] = [
  // ビタミン系
  "ビタミン",
  "vitamin",
  "マルチビタミン",
  "multivitamin",
  "葉酸",
  "folic acid",
  "ナイアシン",
  "niacin",
  "パントテン酸",
  // ミネラル系
  "カルシウム",
  "calcium",
  "マグネシウム",
  "magnesium",
  "亜鉛",
  "zinc",
  "鉄",
  "iron",
  "セレン",
  "selenium",
  "クロム",
  "chromium",
  // オメガ系
  "オメガ",
  "omega",
  "dha",
  "epa",
  "フィッシュオイル",
  "fish oil",
  // アミノ酸・プロテイン系
  "プロテイン",
  "protein",
  "bcaa",
  "アミノ酸",
  "amino acid",
  "グルタミン",
  "glutamine",
  "クレアチン",
  "creatine",
  // 腸活・プロバイオティクス
  "乳酸菌",
  "プロバイオティクス",
  "probiotics",
  "食物繊維",
  "fiber",
  // その他人気成分
  "コラーゲン",
  "collagen",
  "ルテイン",
  "lutein",
  "コエンザイム",
  "coq10",
  "アシュワガンダ",
  "ashwagandha",
  "メラトニン",
  "melatonin",
  "グルコサミン",
  "glucosamine",
  "コンドロイチン",
  "chondroitin",
];

/**
 * 疑問・相談を示すパターン
 * - これらにマッチ → AI相談へ
 */
export const QUESTION_PATTERNS: RegExp[] = [
  // 疑問符
  /？$/,
  /\?$/,
  // 安全性・副作用
  /大丈夫/,
  /安全/,
  /危険/,
  /副作用/,
  /リスク/,
  /注意/,
  // 質問表現
  /どう(です|でしょう|なの)?/,
  /何がいい/,
  /どれがいい/,
  /おすすめ/,
  /選び方/,
  /どっち/,
  // 比較
  /違い/,
  /比較/,
  /どちら/,
  // 効果・効能
  /効果(は|ある)?/,
  /効く/,
  /意味(は|ある)?/,
  // 飲み合わせ
  /飲み合わせ/,
  /一緒に/,
  /併用/,
  /相互作用/,
  // 条件付き質問
  /〜ても/,
  /〜でも/,
  /〜けど/,
  /〜だけど/,
  /〜が/,
];

/**
 * 条件・背景を示すパターン
 * - ユーザーの状況を示す（妊娠中、服薬中など）
 */
export const CONDITION_PATTERNS: RegExp[] = [
  // 妊娠・授乳
  /妊娠/,
  /授乳/,
  /妊婦/,
  /母乳/,
  // 年齢
  /子供/,
  /こども/,
  /高齢/,
  /年配/,
  /シニア/,
  /\d+歳/,
  // 服薬・持病
  /服薬/,
  /薬を飲/,
  /持病/,
  /糖尿/,
  /高血圧/,
  /腎臓/,
  /肝臓/,
  /アレルギー/,
  // その他状況
  /ダイエット中/,
  /運動/,
  /トレーニング/,
  /筋トレ/,
];

/**
 * 悩み・症状を示すパターン
 */
export const SYMPTOM_PATTERNS: RegExp[] = [
  // 疲労
  /疲れ/,
  /だるい/,
  /しんどい/,
  /元気が(出|で)ない/,
  // 睡眠
  /眠れない/,
  /不眠/,
  /睡眠/,
  /寝付/,
  /夜中に起き/,
  // 美容・肌
  /肌荒れ/,
  /ニキビ/,
  /シミ/,
  /しわ/,
  /老化/,
  /エイジング/,
  // ストレス・メンタル
  /ストレス/,
  /イライラ/,
  /不安/,
  /落ち込/,
  /集中(でき|力)/,
  // 身体
  /冷え/,
  /むくみ/,
  /便秘/,
  /下痢/,
  /胃腸/,
  /関節/,
  /腰痛/,
  /頭痛/,
  /目の疲れ/,
  /眼精疲労/,
  // 免疫
  /免疫/,
  /風邪/,
  /体調/,
];

/**
 * 比較を示すパターン
 */
export const COMPARISON_PATTERNS: RegExp[] = [
  /と.{1,10}(の)?違い/,
  /vs/i,
  /比べ/,
  /比較/,
  /.{1,20}と.{1,20}どっち/,
  /.{1,20}と.{1,20}どちら/,
];

/**
 * 商品ブランド名キーワード
 * - これらを含む場合は商品検索と判定
 */
export const PRODUCT_BRAND_KEYWORDS: string[] = [
  // 国内ブランド
  "ネイチャーメイド",
  "nature made",
  "ディアナチュラ",
  "dear natura",
  "dhc",
  "ファンケル",
  "fancl",
  "アサヒ",
  "小林製薬",
  "大塚製薬",
  "オリヒロ",
  "orihiro",
  "nowフーズ",
  "now foods",
  // 海外ブランド
  "iherb",
  "アイハーブ",
  "source naturals",
  "life extension",
  "jarrow",
  "thorne",
  "solgar",
  "garden of life",
  "nordic naturals",
  "california gold",
];

/**
 * 入力テキストを正規化
 */
export function normalizeInput(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      // 全角を半角に
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0),
      )
      // 連続スペースを1つに
      .replace(/\s+/g, " ")
  );
}

/**
 * 成分名を抽出
 */
export function extractIngredients(normalizedInput: string): string[] {
  const found: string[] = [];
  for (const keyword of INGREDIENT_KEYWORDS) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }
  return [...new Set(found)];
}

/**
 * 商品ブランド名を抽出
 */
export function extractProducts(normalizedInput: string): string[] {
  const found: string[] = [];
  for (const brand of PRODUCT_BRAND_KEYWORDS) {
    if (normalizedInput.includes(brand.toLowerCase())) {
      found.push(brand);
    }
  }
  return [...new Set(found)];
}

/**
 * 条件を抽出
 */
export function extractConditions(normalizedInput: string): string[] {
  const found: string[] = [];
  for (const pattern of CONDITION_PATTERNS) {
    const match = normalizedInput.match(pattern);
    if (match) {
      found.push(match[0]);
    }
  }
  return [...new Set(found)];
}

/**
 * 症状を抽出
 */
export function extractSymptoms(normalizedInput: string): string[] {
  const found: string[] = [];
  for (const pattern of SYMPTOM_PATTERNS) {
    const match = normalizedInput.match(pattern);
    if (match) {
      found.push(match[0]);
    }
  }
  return [...new Set(found)];
}
