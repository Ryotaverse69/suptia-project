// 投稿文生成モジュール（Claude API + フォールバックテンプレート）
import Anthropic from '@anthropic-ai/sdk';
import type { IngredientData, ProductData, GeneratedPosts } from './types';

const SITE_URL = 'https://suptia.com';

// Claude APIクライアント
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, using fallback templates');
    return null;
  }
  return new Anthropic({ apiKey });
}

// 成分情報から投稿文を生成
export async function generateIngredientPost(ingredient: IngredientData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      return await generateWithClaude(client, ingredient);
    } catch (error) {
      console.error('Claude API error, using fallback:', error);
    }
  }

  return generateIngredientFallback(ingredient);
}

// 商品情報から投稿文を生成
export async function generateProductPost(product: ProductData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      return await generateProductWithClaude(client, product);
    } catch (error) {
      console.error('Claude API error, using fallback:', error);
    }
  }

  return generateProductFallback(product);
}

// Claude APIで成分投稿を生成
async function generateWithClaude(client: Anthropic, ingredient: IngredientData): Promise<GeneratedPosts> {
  const prompt = `あなたはサプリメント専門家です。以下の成分情報を元に、SNS投稿を作成してください。

【成分情報】
名前: ${ingredient.name}（${ingredient.nameEn || ''}）
効果: ${ingredient.benefits?.slice(0, 5).join('、') || '情報なし'}
推奨摂取量: ${ingredient.recommendedDosage || '情報なし'}
エビデンスレベル: ${ingredient.evidenceLevel || '不明'}

【ルール】
- 薬機法を厳守（「治る」「予防する」「効果がある」は禁止）
- 「サポート」「役立つ可能性」「といわれています」などの表現を使用
- 親しみやすいトーンで
- 絵文字を適度に使用（2〜3個）
- サイトURL: ${SITE_URL}/ingredients/${ingredient.slug?.current || ''}

【出力形式】
以下のJSON形式で出力してください：
{
  "x": "X用投稿（140文字以内、URL含む）",
  "threads": "Threads用投稿（300文字以内）",
  "instagram": "Instagram用投稿（500文字以内、ハッシュタグ5個含む）"
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // JSONを抽出してパース
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from response');
  }

  return JSON.parse(jsonMatch[0]) as GeneratedPosts;
}

// Claude APIで商品投稿を生成
async function generateProductWithClaude(client: Anthropic, product: ProductData): Promise<GeneratedPosts> {
  const ingredientList = product.ingredients
    ?.slice(0, 3)
    .map((i) => i.ingredient?.name)
    .filter(Boolean)
    .join('、') || '各種成分';

  const lowestPrice = product.prices?.reduce((min, p) => (p.amount < min ? p.amount : min), Infinity) || 0;

  const prompt = `あなたはサプリメント専門家です。以下の商品情報を元に、SNS投稿を作成してください。

【商品情報】
商品名: ${product.name}
ブランド: ${product.brand?.name || '不明'}
主な成分: ${ingredientList}
最安値: ¥${lowestPrice.toLocaleString()}

【ルール】
- 薬機法を厳守（「治る」「予防する」「効果がある」は禁止）
- 「サポート」「役立つ可能性」などの表現を使用
- 価格情報は参考として記載
- 親しみやすいトーンで
- 絵文字を適度に使用（2〜3個）
- サイトURL: ${SITE_URL}/products/${product.slug?.current || ''}

【出力形式】
以下のJSON形式で出力してください：
{
  "x": "X用投稿（140文字以内、URL含む）",
  "threads": "Threads用投稿（300文字以内）",
  "instagram": "Instagram用投稿（500文字以内、ハッシュタグ5個含む）"
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from response');
  }

  return JSON.parse(jsonMatch[0]) as GeneratedPosts;
}

// フォールバック: 成分テンプレート
function generateIngredientFallback(ingredient: IngredientData): GeneratedPosts {
  const url = `${SITE_URL}/ingredients/${ingredient.slug?.current || ''}`;
  const benefit = ingredient.benefits?.[0] || '健康をサポート';

  const x = `💊 ${ingredient.name}って知ってる？

${benefit}といわれています。

詳しくはこちら👇
${url}`;

  const threads = `💊 今日のサプリ豆知識【${ingredient.name}】

${benefit}といわれています。

エビデンスレベル: ${ingredient.evidenceLevel || '調査中'}

※効果には個人差があります
詳しくは @suptia_jp のプロフィールから`;

  const instagram = `💊 ${ingredient.name}（${ingredient.nameEn || ''}）について

${ingredient.description?.slice(0, 200) || benefit}

✅ ${benefit}

※効果には個人差があります
※医師・薬剤師にご相談ください

#サプリメント #${ingredient.name} #健康 #栄養 #サプティア`;

  return { x, threads, instagram };
}

// フォールバック: 商品テンプレート
function generateProductFallback(product: ProductData): GeneratedPosts {
  const url = `${SITE_URL}/products/${product.slug?.current || ''}`;
  const brandName = product.brand?.name || '';
  const lowestPrice = product.prices?.reduce((min, p) => (p.amount < min ? p.amount : min), Infinity) || 0;

  const x = `🛒 ${product.name}

${brandName}の人気サプリ
参考価格: ¥${lowestPrice.toLocaleString()}〜

詳細・価格比較はこちら👇
${url}`;

  const threads = `🛒 商品紹介【${product.name}】

${brandName}の人気サプリメントです。

💰 参考価格: ¥${lowestPrice.toLocaleString()}〜

複数のECサイトで価格比較できます。
詳しくは @suptia_jp のプロフィールから`;

  const instagram = `🛒 ${product.name}

${brandName}の人気サプリメントをご紹介。

💰 参考価格: ¥${lowestPrice.toLocaleString()}〜

Suptiaでは複数のECサイトの価格を比較して、
お得に購入できるショップを見つけられます。

#サプリメント #サプリ比較 #健康 #${brandName.replace(/\s/g, '')} #サプティア`;

  return { x, threads, instagram };
}
