// 投稿文生成モジュール（Claude API + フォールバックテンプレート）
import Anthropic from '@anthropic-ai/sdk';
import type {
  IngredientData,
  ProductData,
  GeneratedPosts,
  VersusData,
  RankingData,
  CautionData,
  ThemeContent,
} from './types';
import type { ThemeConfig } from './themes';

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
詳しくは @suptia_official のプロフィールから`;

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
詳しくは @suptia_official のプロフィールから`;

  const instagram = `🛒 ${product.name}

${brandName}の人気サプリメントをご紹介。

💰 参考価格: ¥${lowestPrice.toLocaleString()}〜

Suptiaでは複数のECサイトの価格を比較して、
お得に購入できるショップを見つけられます。

#サプリメント #サプリ比較 #健康 #${brandName.replace(/\s/g, '')} #サプティア`;

  return { x, threads, instagram };
}

// --- 曜日別テーマ用投稿生成 ---

// 成分比較（Versus）投稿を生成
export async function generateVersusPost(data: VersusData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      const prompt = `あなたはサプリメント専門家です。以下の2つの成分を比較するSNS投稿を作成してください。

【成分1】
名前: ${data.ingredient1.name}（${data.ingredient1.nameEn || ''}）
効果: ${data.ingredient1.benefits?.slice(0, 3).join('、') || '情報なし'}

【成分2】
名前: ${data.ingredient2.name}（${data.ingredient2.nameEn || ''}）
効果: ${data.ingredient2.benefits?.slice(0, 3).join('、') || '情報なし'}

【ルール】
- 薬機法を厳守（「治る」「予防する」「効果がある」は禁止）
- どちらが優れているという断定は避ける
- 「それぞれの特徴」「用途によって選ぶ」という表現
- 絵文字を適度に使用（2〜3個）
- 🆚 を使って対決感を出す

【出力形式】
以下のJSON形式で出力してください：
{
  "x": "X用投稿（140文字以内）",
  "threads": "Threads用投稿（300文字以内）",
  "instagram": "Instagram用投稿（500文字以内、ハッシュタグ5個含む）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as GeneratedPosts;
        }
      }
    } catch (error) {
      console.error('Claude API error for versus:', error);
    }
  }

  // フォールバック
  const url = `${SITE_URL}/ingredients`;
  const x = `🆚 ${data.ingredient1.name} vs ${data.ingredient2.name}

どっちを選ぶ？それぞれの特徴をチェック👇
${url}`;

  const threads = `🆚 成分バトル！

【${data.ingredient1.name}】
${data.ingredient1.benefits?.[0] || '健康サポート'}

【${data.ingredient2.name}】
${data.ingredient2.benefits?.[0] || '健康サポート'}

目的に合わせて選ぼう💪`;

  const instagram = `🆚 ${data.ingredient1.name} vs ${data.ingredient2.name}

あなたはどっち派？

【${data.ingredient1.name}】
${data.ingredient1.benefits?.slice(0, 2).join('、') || '健康サポート'}

【${data.ingredient2.name}】
${data.ingredient2.benefits?.slice(0, 2).join('、') || '健康サポート'}

目的に合わせて選ぶのがおすすめ✨

#サプリメント #成分比較 #${data.ingredient1.name} #${data.ingredient2.name} #サプティア`;

  return { x, threads, instagram };
}

// ランキング投稿を生成
export async function generateRankingPost(data: RankingData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      const productList = data.products
        .map((p, i) => `${i + 1}位: ${p.name}（${p.brand?.name || ''}）`)
        .join('\n');

      const prompt = `あなたはサプリメント専門家です。以下のランキング情報でSNS投稿を作成してください。

【ランキング】
カテゴリ: ${data.category}
${productList}

【ルール】
- 薬機法を厳守
- 🏆🥈🥉 などのメダル絵文字を使用
- 「注目の」「人気の」という表現OK
- 親しみやすいトーン

【出力形式】
以下のJSON形式で出力してください：
{
  "x": "X用投稿（140文字以内）",
  "threads": "Threads用投稿（300文字以内）",
  "instagram": "Instagram用投稿（500文字以内、ハッシュタグ5個含む）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as GeneratedPosts;
        }
      }
    } catch (error) {
      console.error('Claude API error for ranking:', error);
    }
  }

  // フォールバック
  const x = `🏆 ${data.category}ランキング

🥇 ${data.products[0]?.name || ''}
🥈 ${data.products[1]?.name || ''}
🥉 ${data.products[2]?.name || ''}

詳細は ${SITE_URL}`;

  const threads = `🏆 今週の${data.category}ランキング！

🥇 ${data.products[0]?.name}
🥈 ${data.products[1]?.name}
🥉 ${data.products[2]?.name}

価格比較は @suptia_official から`;

  const instagram = `🏆 ${data.category}ランキングTOP3

🥇 ${data.products[0]?.name}
🥈 ${data.products[1]?.name}
🥉 ${data.products[2]?.name}

Suptiaで価格比較して、お得に購入しよう！

#サプリメント #${data.category.replace(/\s/g, '')} #ランキング #健康 #サプティア`;

  return { x, threads, instagram };
}

// 注意喚起投稿を生成
export async function generateCautionPost(data: CautionData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      const prompt = `あなたはサプリメント専門家です。以下の成分の注意事項についてSNS投稿を作成してください。

【成分】
名前: ${data.ingredient.name}
注意点: ${data.cautions.join('、')}
相互作用: ${data.interactions.join('、') || 'なし'}

【ルール】
- 薬機法を厳守
- ⚠️ を使って注意を促す
- 「医師・薬剤師に相談を」を必ず含める
- 脅しすぎず、適度な注意喚起

【出力形式】
以下のJSON形式で出力してください：
{
  "x": "X用投稿（140文字以内）",
  "threads": "Threads用投稿（300文字以内）",
  "instagram": "Instagram用投稿（500文字以内、ハッシュタグ5個含む）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as GeneratedPosts;
        }
      }
    } catch (error) {
      console.error('Claude API error for caution:', error);
    }
  }

  // フォールバック
  const x = `⚠️ ${data.ingredient.name}を飲む前に

${data.cautions[0] || '過剰摂取に注意'}

気になる方は医師・薬剤師に相談を🏥`;

  const threads = `⚠️ ${data.ingredient.name}の注意点

${data.cautions.map((c) => `・${c}`).join('\n')}

サプリメントは正しく使ってこそ効果的。
不安な方は医師・薬剤師に相談しましょう🏥`;

  const instagram = `⚠️ ${data.ingredient.name}を始める前に知っておきたいこと

${data.cautions.map((c) => `✅ ${c}`).join('\n')}

サプリメントは正しく使ってこそ。
気になる方は医師・薬剤師に相談を🏥

#サプリメント #${data.ingredient.name} #健康管理 #注意点 #サプティア`;

  return { x, threads, instagram };
}

// コスパ投稿を生成（商品投稿の派生）
export async function generateCospaPost(product: ProductData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();
  const lowestPrice = product.prices?.reduce((min, p) => (p.amount < min ? p.amount : min), Infinity) || 0;

  if (client) {
    try {
      const prompt = `あなたはサプリメント専門家です。以下の商品をコスパの観点でSNS投稿を作成してください。

【商品情報】
商品名: ${product.name}
ブランド: ${product.brand?.name || '不明'}
最安値: ¥${lowestPrice.toLocaleString()}

【ルール】
- 薬機法を厳守
- 💰 を使ってお得感を演出
- 「コスパ」「お得」をキーワードに
- 親しみやすいトーン

【出力形式】
以下のJSON形式で出力してください：
{
  "x": "X用投稿（140文字以内）",
  "threads": "Threads用投稿（300文字以内）",
  "instagram": "Instagram用投稿（500文字以内、ハッシュタグ5個含む）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as GeneratedPosts;
        }
      }
    } catch (error) {
      console.error('Claude API error for cospa:', error);
    }
  }

  // フォールバック
  const url = `${SITE_URL}/products/${product.slug?.current || ''}`;
  const x = `💰 コスパ最強！${product.name}

¥${lowestPrice.toLocaleString()}〜で購入可能！

価格比較はこちら👇
${url}`;

  const threads = `💰 今日のコスパ最強サプリ

${product.name}
${product.brand?.name || ''}

¥${lowestPrice.toLocaleString()}〜

複数のECサイトで価格比較できます✨`;

  const instagram = `💰 コスパ重視ならこれ！

${product.name}

¥${lowestPrice.toLocaleString()}〜で購入可能！

Suptiaで複数のECサイトを比較して
最安値をチェックしよう✨

#サプリメント #コスパ #お得 #健康 #サプティア`;

  return { x, threads, instagram };
}

// テーマに応じた投稿を生成
export async function generatePostByTheme(
  content: ThemeContent,
  theme: ThemeConfig
): Promise<GeneratedPosts> {
  console.log(`📝 テーマ「${theme.label}」の投稿を生成中...`);

  switch (content.type) {
    case 'ingredient':
      return generateIngredientPost(content.data);
    case 'product':
      return generateProductPost(content.data);
    case 'cospa':
      return generateCospaPost(content.data);
    case 'versus':
      return generateVersusPost(content.data);
    case 'ranking':
      return generateRankingPost(content.data);
    case 'caution':
      return generateCautionPost(content.data);
  }
}
