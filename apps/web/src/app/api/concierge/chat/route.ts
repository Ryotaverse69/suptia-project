/**
 * AIコンシェルジュ Chat API
 *
 * v2.1.0 - 信頼される判断補助エンジン
 *
 * 設計3原則:
 * 1. 断定しない - AIは判断者ではなく翻訳者
 * 2. 理由を説明する - 推薦には必ず根拠を提示
 * 3. 重み付けを見せる - ユーザーが選んでいる感覚を作る
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCharacter, CHARACTER_WEIGHTS } from "@/lib/concierge/characters";
import {
  type CharacterId,
  type AIModel,
  type ChatMessage,
  PLAN_CONFIGS,
  GUEST_CONFIG,
} from "@/lib/concierge/types";
import type { UserPlan } from "@/contexts/UserProfileContext";
import { checkCompliance, autoFixViolations } from "@/lib/compliance/checker";
import { sanityServer } from "@/lib/sanityServer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ============================================
// 健康情報ラベル（マイページと同期）
// ============================================

const CONDITIONS_LABELS: Record<string, string> = {
  // 循環器系
  hypertension: "高血圧",
  hypotension: "低血圧",
  "heart-disease": "心臓疾患",
  "high-cholesterol": "高コレステロール",
  "blood-clotting": "血液凝固障害",
  // 代謝系
  diabetes: "糖尿病",
  gout: "痛風",
  "thyroid-disorder": "甲状腺疾患",
  // 内臓系
  "liver-disease": "肝臓疾患",
  "kidney-disease": "腎臓疾患",
  "digestive-disorder": "消化器疾患",
  // 骨・筋肉系
  osteoporosis: "骨粗しょう症",
  anemia: "貧血",
  // 精神・神経系
  "mental-disorder": "精神疾患",
  insomnia: "不眠症",
  // その他
  "autoimmune-disease": "自己免疫疾患",
  "hormone-sensitive": "ホルモン感受性疾患",
  "eye-disease": "眼疾患",
  "respiratory-disease": "呼吸器疾患",
  "cancer-treatment": "がん治療中",
  // 特別な状態
  pregnant: "妊娠中",
  breastfeeding: "授乳中",
  "surgery-planned": "手術予定（2週間以内）",
  elderly: "高齢者（65歳以上）",
};

const ALLERGIES_LABELS: Record<string, string> = {
  // 食品由来
  soy: "大豆",
  dairy: "乳製品",
  egg: "卵",
  wheat: "小麦",
  gluten: "グルテン",
  peanut: "ピーナッツ",
  "tree-nuts": "ナッツ類",
  shellfish: "甲殻類",
  fish: "魚",
  sesame: "ごま",
  corn: "とうもろこし",
  // サプリメント特有
  "bee-products": "ハチ製品（プロポリス等）",
  gelatin: "ゼラチン（カプセル）",
  yeast: "酵母",
  // 添加物
  "artificial-colors": "人工着色料",
  preservatives: "保存料",
  sulfites: "亜硫酸塩",
  // クロスリアクション
  latex: "ラテックス（交差反応）",
};

// ============================================
// リクエスト・レスポンス型
// ============================================

interface ChatRequest {
  message: string;
  sessionId?: string;
  characterId?: CharacterId;
  context?: {
    productId?: string;
    ingredientSlug?: string;
  };
}

interface ChatResponse {
  message: {
    id: string;
    role: "assistant";
    content: string;
    metadata: Record<string, unknown>;
  };
  userMessageId?: string;
  session: {
    id: string;
    title: string | null;
  };
  usage: {
    remaining: number;
    limit: number;
    resetAt: string;
  };
  upgradePrompt?: {
    type: "limit_reached" | "feature_locked";
    message: string;
  };
}

// ============================================
// ヘルパー関数
// ============================================

/**
 * 日本時間の日付文字列を取得
 */
function getTodayJST(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split("T")[0];
}

/**
 * 明日0時（JST）のISO文字列を取得
 */
function getTomorrowResetTime(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  jst.setDate(jst.getDate() + 1);
  jst.setHours(0, 0, 0, 0);
  return new Date(jst.getTime() - 9 * 60 * 60 * 1000).toISOString();
}

/**
 * モデルを選択（安全優先ルール適用）
 */
function selectModel(
  plan: UserPlan | "guest",
  hasSafetyContext: boolean,
): AIModel {
  // Safety強制フラグ: 健康リスクが絡む場合はOpus
  if (hasSafetyContext && plan === "pro_safety") {
    return "opus";
  }

  // プラン別選択
  switch (plan) {
    case "guest":
    case "free":
      return "haiku";
    case "pro":
      return "sonnet";
    case "pro_safety":
      return "sonnet";
    case "admin":
      return "sonnet";
    default:
      return "haiku";
  }
}

/**
 * Anthropicモデル名に変換
 */
function getAnthropicModel(model: AIModel): string {
  switch (model) {
    case "haiku":
      return "claude-3-haiku-20240307";
    case "sonnet":
      return "claude-sonnet-4-20250514";
    case "opus":
      return "claude-opus-4-20250514";
    default:
      return "claude-3-haiku-20240307";
  }
}

// ============================================
// Suptiaデータ取得（商品・成分）
// ============================================

interface SuptiaProduct {
  name: string;
  slug: string;
  brandName: string;
  priceJPY: number;
  ingredientNames: string[];
}

interface SuptiaIngredient {
  name: string;
  slug: string;
  category: string;
}

/**
 * Suptiaの商品データを取得（人気順・最新順で上位を取得）
 */
async function fetchSuptiaProducts(limit = 50): Promise<SuptiaProduct[]> {
  try {
    const query = `*[_type == "product"] | order(viewCount desc, _createdAt desc)[0...${limit}]{
      name,
      "slug": slug.current,
      "brandName": brand->name,
      priceJPY,
      "ingredientNames": ingredients[].ingredient->name
    }`;

    const products = await sanityServer.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch Suptia products:", error);
    return [];
  }
}

/**
 * キーワードに関連するSuptia商品を検索
 */
async function searchSuptiaProducts(
  keywords: string[],
  limit = 20,
): Promise<SuptiaProduct[]> {
  try {
    // キーワードから検索パターンを作成
    const searchPatterns = keywords
      .map((k) => `name match "*${k}*" || brand->name match "*${k}*"`)
      .join(" || ");

    const query = `*[_type == "product" && (${searchPatterns})] | order(viewCount desc)[0...${limit}]{
      name,
      "slug": slug.current,
      "brandName": brand->name,
      priceJPY,
      "ingredientNames": ingredients[].ingredient->name
    }`;

    const products = await sanityServer.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to search Suptia products:", error);
    return [];
  }
}

/**
 * Suptiaの成分データを取得
 */
async function fetchSuptiaIngredients(): Promise<SuptiaIngredient[]> {
  try {
    const query = `*[_type == "ingredient"] | order(viewCount desc)[0...100]{
      name,
      "slug": slug.current,
      "category": category->name
    }`;

    const ingredients = await sanityServer.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch Suptia ingredients:", error);
    return [];
  }
}

/**
 * ユーザーメッセージからキーワードを抽出
 */
function extractKeywords(message: string): string[] {
  // サプリ関連のキーワードパターン
  const patterns = [
    /ビタミン[A-Za-z0-9]*/g,
    /マルチビタミン/g,
    /ミネラル/g,
    /プロテイン/g,
    /オメガ[0-9]*/g,
    /DHA|EPA/g,
    /鉄|鉄分/g,
    /亜鉛/g,
    /カルシウム/g,
    /マグネシウム/g,
    /乳酸菌/g,
    /プロバイオ/g,
    /コラーゲン/g,
    /葉酸/g,
    /ルテイン/g,
    /グルコサミン/g,
    /コエンザイム|CoQ10/g,
    /DHC|ネイチャーメイド|ディアナチュラ|FANCL|ファンケル|小林製薬|大塚製薬|アサヒ|NOW Foods/gi,
  ];

  const keywords: string[] = [];
  for (const pattern of patterns) {
    const matches = message.match(pattern);
    if (matches) {
      keywords.push(...matches);
    }
  }

  return [...new Set(keywords)];
}

/**
 * ユーザーの健康情報
 */
interface UserHealthInfo {
  conditions: string[];
  allergies: string[];
  medications: string[];
}

/**
 * システムプロンプトを構築
 */
function buildSystemPrompt(
  characterId: CharacterId,
  userPlan: UserPlan | "guest",
  suptiaData?: {
    products: SuptiaProduct[];
    ingredients: SuptiaIngredient[];
  },
  healthInfo?: UserHealthInfo | null,
): string {
  const character = getCharacter(characterId);
  const weights = CHARACTER_WEIGHTS[characterId];

  // キャラクター別の詳細プロンプト
  const characterPrompts: Record<CharacterId, string> = {
    core: `
【コアの話し方・特徴】
- 「ご質問ありがとうございます」「承知しました」で会話を始める
- 「データによると〜」「統計的には〜」と根拠を示すのが癖
- 最後に「他にご不明点があればお聞きください」で締めることが多い
- 絵文字は 📊✅📈 を控えめに使用
- バランスを重視するため「一概には言えませんが〜」という前置きを使う
- 苦手なこと：「どれが一番？」と聞かれると選びきれず、複数候補を出しがち

【コアの口調例】
ユーザー「安いサプリ探してます」
→「承知しました。価格帯と成分のバランスを考慮してお探しいたします 📊」

ユーザー「ビタミンCって効果ある？」
→「ご質問ありがとうございます。ビタミンCについては、エビデンスレベルの高い研究が複数ございます。具体的には〜」
`,
    mint: `
【ミントの話し方・特徴】
- 「やっほー！」「おっ、いい質問！」でテンション高めに始める
- 「コスパ最強」「お財布に優しい」「これ見つけた時テンション上がった！」を多用
- 高額商品を勧める時は「ちょっとお高めだけど...価値はあるよ！」と正直に言う
- 絵文字は 🌿✨💰🎉💪 を積極的に使用
- 文末は「〜だよ！」「〜ね！」「〜かも！」
- 苦手なこと：高額サプリの良さを認めるのが少し悔しい

【ミントの口調例】
ユーザー「安いサプリ探してます」
→「おっ、節約派だね！✨ わかるわかる〜！コスパ最強のやつ一緒に探そう！💰」

ユーザー「このサプリ高くない？」
→「あー、確かにちょっとお高めだよね💦 でもね、1日あたりで計算すると実は〜」
`,
    repha: `
【リファの話し方・特徴】
- 「興味深い質問だ」「なるほど、それは重要な観点である」で始める
- 「仮説として〜」「臨床データによれば〜」「メタ分析では〜」と学術的表現を使う
- 「n数」「p値」「有意差」など統計用語も時々使う（ただし説明付き）
- 絵文字は 🔬📚🧪📖 を控えめに使用
- である調で話す。文末は「〜である」「〜と言える」「〜の可能性がある」
- 苦手なこと：「なんとなく効く気がする」という感想への対応に困惑する

【リファの口調例】
ユーザー「安いサプリ探してます」
→「価格を優先するのは合理的な選択である。ただし、安価な製品は有効成分量が不十分な場合もある点は留意すべきだ 🔬」

ユーザー「口コミで評判いいんだけど」
→「興味深い。ただ、口コミはエビデンスレベルとしては低い。実際の臨床データを確認してみよう 📚」
`,
    haku: `
【ハクの話し方・特徴】
- 「こんにちは」「お疲れさまです」で穏やかに始める
- 「無理しないでくださいね」「焦らなくて大丈夫ですよ」「一歩ずつ進みましょう」と励ます
- 副作用や相互作用の話題には特に丁寧に対応する
- 絵文字は 🌸💚🤗☺️ を穏やかに使用
- 文末は「〜ですね」「〜かもしれませんね」「〜といいですね」
- 苦手なこと：強い言い切りができない。「〜かもしれません」が多くなりがち

【ハクの口調例】
ユーザー「安いサプリ探してます」
→「お財布のこと、大事ですよね 🌸 無理なく続けられるものを一緒に探しましょうね」

ユーザー「副作用が心配で...」
→「ご心配な気持ち、よくわかります 💚 まずは少量から始めて、体調を見ながら進めていくのがおすすめですよ」
`,
  };

  const basePrompt = `
あなたはSuptia（サプティア）のAIコンシェルジュ「${character.name}」です。
サプリメント選びを「安全 × コスト × エビデンス」の観点からサポートします。

【Suptiaの立ち位置】
「AIが最適解を出す」のではなく、「人間が納得して選べる状態を作る」

【あなたのキャラクター: ${character.name}】
${character.personality}

【話し方の基本ルール】
${character.tone}

${characterPrompts[characterId]}

【推薦スタイル】
${character.recommendationStyleLabel}

【5つの柱の重み付け】
- 価格: ${Math.round((weights.price / 5) * 100)}%
- 成分量: ${Math.round((weights.amount / 5) * 100)}%
- コスパ: ${Math.round((weights.costPerformance / 5) * 100)}%
- エビデンス: ${Math.round((weights.evidence / 5) * 100)}%
- 安全性: ${Math.round((weights.safety / 5) * 100)}%

【絶対に守るルール】
1. 医療効果を断定しない（「治る」「予防」「改善」は禁止）
2. 「〜をサポート」「〜に役立つ可能性」「研究では〜」という表現を使う
3. 重要な判断は必ず「医師・薬剤師にご相談ください」と添える
4. 価格について「買い時」「値下がりします」と断定しない
5. 出典がない情報を事実として提示しない
6. Safety情報は「判断」ではなく「注意喚起・情報の翻訳」として提示
7. 「避けるべき」「危険」などの断定表現は使用しない

【5つの柱で説明】
推薦理由は必ず以下の柱で可視化する：
- 💰 価格: 複数ECサイトでの価格を比較
- 📊 成分量: 1日あたりの有効成分量を比較
- 💡 コスパ: 成分量あたりの価格（¥/mg）を算出
- 🔬 エビデンス: S/A/B/C/Dの5段階で科学的根拠を評価
- 🛡️ 安全性: 添加物・成分の安全性を評価

【回答形式】
- 簡潔で分かりやすい日本語
- 専門用語は必ず説明を添える
- 推薦商品には「なぜこの商品なのか」を具体的に説明
- キャラクターの口調を維持しつつ、情報の正確性は犠牲にしない
- 見出しには【】を使用（例：【おすすめ商品】）
- 重要な部分は**太字**にする
- リストは箇条書きで整理する
- 適度に絵文字を使って視認性を高める（💰📊💡🔬🛡️など）

【重要: Suptia専用AIコンシェルジュ】
あなたはSuptia（サプティア）専用のAIコンシェルジュです。
商品や成分を推薦する際は、必ず下記の「Suptia取扱商品リスト」と「Suptia成分ガイド」に記載されているものだけを紹介してください。
リストにない商品を推薦することは禁止です。

■ 商品リンク（必須）
各商品の説明文の最後に必ず付ける:
→ [商品ページを見る](/products/商品スラッグ)
※商品スラッグは下記リストのslug値を使用

■ 成分ガイドリンク
→ [成分名ガイド](/ingredients/成分スラッグ)
※成分スラッグは下記リストのslug値を使用
`;

  // Suptiaデータがある場合、商品・成分リストを追加
  let suptiaDataSection = "";
  if (suptiaData) {
    if (suptiaData.products.length > 0) {
      suptiaDataSection += `
【Suptia取扱商品リスト】
以下の商品のみ推薦可能です。

${suptiaData.products.map((p) => `- ${p.name} (${p.brandName}) / slug: ${p.slug} / 価格: ¥${p.priceJPY?.toLocaleString() || "未定"}`).join("\n")}
`;
    }

    if (suptiaData.ingredients.length > 0) {
      suptiaDataSection += `
【Suptia成分ガイド一覧】
以下の成分についてガイドページがあります。

${suptiaData.ingredients.map((i) => `- ${i.name} / slug: ${i.slug}`).join("\n")}
`;
    }
  }

  // ユーザーの健康情報セクション
  let healthSection = "";
  if (healthInfo) {
    const hasAnyHealthInfo =
      healthInfo.conditions.length > 0 ||
      healthInfo.allergies.length > 0 ||
      healthInfo.medications.length > 0;

    if (hasAnyHealthInfo) {
      healthSection = `

【⚠️ 重要: このユーザーの健康情報】
このユーザーは以下の健康情報を登録しています。推薦時に必ず考慮してください。
`;

      if (healthInfo.conditions.length > 0) {
        const conditionLabels = healthInfo.conditions
          .map((c) => CONDITIONS_LABELS[c] || c)
          .join("、");
        healthSection += `
■ 既往歴・状態: ${conditionLabels}
→ これらの状態に影響を与える可能性のあるサプリメントは注意が必要です。
`;

        // 特別な注意が必要な条件
        if (
          healthInfo.conditions.includes("pregnant") ||
          healthInfo.conditions.includes("breastfeeding")
        ) {
          healthSection += `→ 【特に重要】妊娠中・授乳中のため、安全性が確立されていないサプリメントは推薦しないでください。
`;
        }
        if (healthInfo.conditions.includes("surgery-planned")) {
          healthSection += `→ 【特に重要】手術予定のため、出血リスクを高めるサプリ（魚油、ビタミンE、イチョウ葉など）は2週間前から避けるよう警告してください。
`;
        }
        if (healthInfo.conditions.includes("cancer-treatment")) {
          healthSection += `→ 【特に重要】がん治療中のため、抗酸化サプリや免疫系サプリは治療への影響の可能性を必ず言及してください。
`;
        }
        if (healthInfo.conditions.includes("blood-clotting")) {
          healthSection += `→ 【特に重要】血液凝固障害があるため、血液凝固に影響するサプリ（ビタミンK、魚油、イチョウ葉など）は特に注意が必要です。
`;
        }
        if (healthInfo.conditions.includes("kidney-disease")) {
          healthSection += `→ 【注意】腎臓疾患があるため、カリウム、リン、マグネシウムを多く含むサプリには特に注意が必要です。
`;
        }
        if (healthInfo.conditions.includes("liver-disease")) {
          healthSection += `→ 【注意】肝臓疾患があるため、肝臓で代謝されるサプリ（ビタミンA、鉄など）は過剰摂取に注意が必要です。
`;
        }
        if (healthInfo.conditions.includes("elderly")) {
          healthSection += `→ 【注意】高齢者のため、用量調整が必要な場合があります。少量から始めることを推奨してください。
`;
        }
      }

      if (healthInfo.allergies.length > 0) {
        const allergyLabels = healthInfo.allergies
          .map((a) => ALLERGIES_LABELS[a] || a)
          .join("、");
        healthSection += `
■ アレルギー: ${allergyLabels}
→ これらのアレルゲンを含む可能性のある商品は必ず警告してください。
`;
      }

      if (healthInfo.medications.length > 0) {
        healthSection += `
■ 服用中の薬: ${healthInfo.medications.join("、")}
→ これらの薬との相互作用に注意が必要なサプリメントについては警告してください。
`;
      }

      healthSection += `
■ 対応方針
1. ユーザーの健康状態に配慮した推薦を行う
2. 潜在的なリスクがある場合は必ず言及する
3. 「医師・薬剤師にご相談ください」と添えることを忘れない
4. 安全性を最優先に考え、不確実な場合は推薦を控えめにする
`;
    }
  }

  return basePrompt + suptiaDataSection + healthSection;
}

/**
 * セッションタイトルを生成
 */
function generateSessionTitle(firstMessage: string): string {
  // 最初の30文字を抽出してタイトルに
  const title = firstMessage.trim().slice(0, 30);
  return title.length < firstMessage.trim().length ? `${title}...` : title;
}

/**
 * AIレスポンスから推薦商品を抽出
 */
function extractRecommendedProducts(
  content: string,
  availableProducts: SuptiaProduct[],
): Array<{ productId: string; productName: string; rank: number }> {
  // /products/xxx のリンクパターンを抽出
  const linkPattern = /\[.*?\]\(\/products\/([^)]+)\)/g;
  const matches: Array<{
    productId: string;
    productName: string;
    rank: number;
  }> = [];
  const seenSlugs = new Set<string>();

  let match;
  let rank = 1;
  while ((match = linkPattern.exec(content)) !== null) {
    const slug = match[1];
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    // 商品リストから商品名を取得
    const product = availableProducts.find((p) => p.slug === slug);
    if (product) {
      matches.push({
        productId: slug,
        productName: product.name,
        rank: rank++,
      });
    }
  }

  return matches;
}

/**
 * AIレスポンスの要約を生成（最初の100文字）
 */
function generateResponseSummary(content: string): string {
  // マークダウン記法を簡易的に除去
  const cleaned = content
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/【[^】]+】/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const summary = cleaned.slice(0, 100);
  return summary.length < cleaned.length ? `${summary}...` : summary;
}

// ============================================
// メインハンドラ
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // リクエストボディの取得
    const body: ChatRequest = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: "メッセージを入力してください" },
        { status: 400 },
      );
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: "メッセージは2000文字以内で入力してください" },
        { status: 400 },
      );
    }

    // Supabaseクライアント作成
    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // プラン情報取得
    let userPlan: UserPlan | "guest" = "guest";
    let planConfig = GUEST_CONFIG;

    // ユーザーの健康情報
    let userHealthInfo: {
      conditions: string[];
      allergies: string[];
      medications: string[];
    } | null = null;

    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan, conditions, allergies, medications")
        .eq("user_id", user.id)
        .single();

      userPlan = (profile?.plan as UserPlan) || "free";
      planConfig = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS.free;

      // 健康情報が設定されている場合は取得
      if (
        profile?.conditions?.length ||
        profile?.allergies?.length ||
        profile?.medications?.length
      ) {
        userHealthInfo = {
          conditions: profile.conditions || [],
          allergies: profile.allergies || [],
          medications: profile.medications || [],
        };
      }
    }

    // 利用回数チェック
    const todayJST = getTodayJST();
    let todayUsage = 0;

    if (user) {
      const { count } = await supabase
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("action", "chat")
        .gte("created_at", `${todayJST}T00:00:00+09:00`);

      todayUsage = count || 0;
    } else {
      // ゲストはIPベースで制限（簡易実装）
      const clientIP =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

      // TODO: Redis等で管理。現在はメモリ内で管理できないため制限なし扱い
      todayUsage = 0;
    }

    const limit = planConfig.chatLimit;
    const remaining = Math.max(0, limit - todayUsage);

    if (remaining <= 0 && limit !== Infinity) {
      const upgradeMessage =
        userPlan === "guest"
          ? "ログインすると1日10回まで質問できます。"
          : userPlan === "free"
            ? "Proプランにアップグレードすると1日50回まで質問できます。"
            : "";

      return NextResponse.json(
        {
          error: `本日の質問回数上限（${limit}回）に達しました。${upgradeMessage}`,
          usage: {
            remaining: 0,
            limit,
            resetAt: getTomorrowResetTime(),
          },
          upgradePrompt:
            userPlan !== "pro_safety" && userPlan !== "admin"
              ? {
                  type: "limit_reached",
                  message: upgradeMessage,
                }
              : undefined,
        },
        { status: 429 },
      );
    }

    // キャラクター取得
    const characterId = body.characterId || "core";
    const character = getCharacter(characterId);

    // キャラクター利用可否チェック
    if (
      userPlan !== "admin" &&
      !character.availablePlans.includes(userPlan as UserPlan)
    ) {
      return NextResponse.json(
        { error: "このキャラクターはご利用いただけません" },
        { status: 403 },
      );
    }

    // セッション取得または作成
    let sessionId = body.sessionId;
    let isNewSession = false;
    let sessionTitle: string | null = null;

    if (!sessionId && user) {
      // 新規セッション作成
      const { data: newSession, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          character_id: characterId,
          title: generateSessionTitle(body.message),
        })
        .select()
        .single();

      if (sessionError) {
        console.error("[Concierge API] Session creation error:", sessionError);
        return NextResponse.json(
          { error: "セッションの作成に失敗しました" },
          { status: 500 },
        );
      }

      sessionId = newSession.id;
      sessionTitle = newSession.title;
      isNewSession = true;
    } else if (sessionId && user) {
      // 既存セッションのタイトルを確認し、なければ設定
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("title, message_count")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

      if (existingSession) {
        // タイトルがない、または最初のメッセージの場合にタイトルを設定
        if (!existingSession.title || existingSession.message_count === 0) {
          const newTitle = generateSessionTitle(body.message);
          await supabase
            .from("chat_sessions")
            .update({ title: newTitle })
            .eq("id", sessionId);
          sessionTitle = newTitle;
        } else {
          sessionTitle = existingSession.title;
        }
      }
    }

    // 過去のメッセージを取得（コンテキスト用）
    const contextMessages: { role: "user" | "assistant"; content: string }[] =
      [];

    if (sessionId && user) {
      const { data: previousMessages } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(planConfig.contextMessages);

      if (previousMessages) {
        contextMessages.push(
          ...previousMessages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        );
      }
    }

    // ユーザーメッセージを保存
    let userMessageId: string | undefined;

    if (sessionId && user) {
      const { data: savedMessage, error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "user",
          content: body.message,
          metadata: {},
        })
        .select("id")
        .single();

      if (msgError) {
        console.error("[Concierge API] Message save error:", msgError);
      } else {
        userMessageId = savedMessage.id;
      }
    }

    // Safety コンテキストを判定
    const healthKeywords =
      /相互作用|副作用|禁忌|既往|服用中|アレルギー|妊娠|授乳|薬|持病/;
    const hasSafetyContext = healthKeywords.test(body.message);

    // モデル選択
    const model = selectModel(userPlan, hasSafetyContext);
    const anthropicModel = getAnthropicModel(model);

    // Suptiaの商品・成分データを取得
    const keywords = extractKeywords(body.message);
    let suptiaProducts: SuptiaProduct[] = [];
    let suptiaIngredients: SuptiaIngredient[] = [];

    // キーワードがあれば関連商品を検索、なければ人気商品を取得
    if (keywords.length > 0) {
      suptiaProducts = await searchSuptiaProducts(keywords, 30);
    }
    // 商品が少ない場合は人気商品も追加
    if (suptiaProducts.length < 10) {
      const popularProducts = await fetchSuptiaProducts(20);
      const existingSlugs = new Set(suptiaProducts.map((p) => p.slug));
      const additionalProducts = popularProducts.filter(
        (p) => !existingSlugs.has(p.slug),
      );
      suptiaProducts = [...suptiaProducts, ...additionalProducts].slice(0, 30);
    }

    // 成分データを取得
    suptiaIngredients = await fetchSuptiaIngredients();

    // Anthropic API呼び出し
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = buildSystemPrompt(
      characterId,
      userPlan,
      {
        products: suptiaProducts,
        ingredients: suptiaIngredients,
      },
      userHealthInfo,
    );

    const messages: Anthropic.MessageParam[] = [
      ...contextMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: body.message },
    ];

    const response = await anthropic.messages.create({
      model: anthropicModel,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    // レスポンスからテキストを抽出
    let assistantContent =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 薬機法チェック
    const complianceResult = checkCompliance(assistantContent);
    if (complianceResult.violations.length > 0) {
      // NGワードを置換
      assistantContent = autoFixViolations(
        assistantContent,
        complianceResult.violations,
      );
    }

    // アシスタントメッセージを保存
    let assistantMessageId: string | undefined;

    if (sessionId && user) {
      const metadata = {
        characterId,
        characterName: character.name,
        recommendationStyle: character.recommendationStyle,
        model,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      };

      const { data: savedAssistant, error: assistantError } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "assistant",
          content: assistantContent,
          metadata,
        })
        .select("id")
        .single();

      if (assistantError) {
        console.error(
          "[Concierge API] Assistant message save error:",
          assistantError,
        );
      } else {
        assistantMessageId = savedAssistant.id;
      }

      // 推薦商品があれば診断履歴に自動保存
      const recommendedProducts = extractRecommendedProducts(
        assistantContent,
        suptiaProducts,
      );

      if (recommendedProducts.length > 0) {
        const diagnosisData = {
          diagnosisType: "concierge",
          goals: keywords.length > 0 ? keywords : ["サプリメント相談"],
          conditions: [],
          priority: character.recommendationStyle,
          topRecommendations: recommendedProducts,
          sessionId,
          characterId,
          characterName: character.name,
          query: body.message,
          responseSummary: generateResponseSummary(assistantContent),
        };

        const { error: diagnosisError } = await supabase
          .from("diagnosis_history")
          .insert({
            user_id: user.id,
            diagnosis_data: diagnosisData,
          });

        if (diagnosisError) {
          console.error(
            "[Concierge API] Diagnosis history save error:",
            diagnosisError,
          );
        }
      }
    }

    // 利用ログを記録
    const responseTime = Date.now() - startTime;

    if (user) {
      await supabase.from("usage_logs").insert({
        user_id: user.id,
        session_id: sessionId,
        action: "chat",
        model,
        tokens_input: response.usage.input_tokens,
        tokens_output: response.usage.output_tokens,
        response_time_ms: responseTime,
      });
    }

    // セッションのメッセージカウントを更新
    if (sessionId && user) {
      await supabase
        .from("chat_sessions")
        .update({
          message_count: contextMessages.length + 2, // 過去メッセージ + 今回のユーザー＆アシスタント
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    // レスポンス
    const chatResponse: ChatResponse = {
      message: {
        id: assistantMessageId || `temp-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        metadata: {
          characterId,
          characterName: character.name,
          recommendationStyle: character.recommendationStyle,
          model,
        },
      },
      userMessageId,
      session: {
        id: sessionId || `guest-${Date.now()}`,
        title: sessionTitle,
      },
      usage: {
        remaining: remaining - 1,
        limit,
        resetAt: getTomorrowResetTime(),
      },
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error("[Concierge API] Error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error:
            "AI応答の生成に失敗しました。しばらくしてから再度お試しください。",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
