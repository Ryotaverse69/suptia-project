// 投稿文生成モジュール（フォロワー増加×ブランディング特化版）
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

// サプティアのブランドボイス（全プロンプト共通）
const BRAND_VOICE = `【サプティアとは】
サプリメントの意思決定エンジン。ただの比較サイトではない。
476商品を独自の5軸（価格・成分量・コスパ¥/mg・エビデンスS〜D・安全性0-100点）で定量分析。
5つのAI専門家（薬剤師AI・管理栄養士AI・臨床研究者AI・薬機法AI・消費者保護AI）が全コンテンツを監修。

【ブランドスローガン】
「AIが答えを出す時代。Suptiaはその根拠を示す。」

【トーン】
- 知的だけど堅くない。カジュアルだけど軽くない
- データと根拠に裏打ちされた自信
- 業界の問題に遠慮なく切り込む
- 「このアカウント面白い、フォローしよう」と思わせる

【絶対ルール】
- 薬機法厳守（「治る」「効く」「予防する」は禁止。「サポート」「可能性」を使用）
- 商品名を出して宣伝しない（ブランドではなくデータで語る）
- 情報の羅列・説明口調は禁止（意見・視点で語る）
- URLは基本入れない（エンゲージメント優先。プロフに導線がある）`;

// Claude APIクライアント
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, using fallback templates');
    return null;
  }
  return new Anthropic({ apiKey });
}

// --- ホットテイク（ingredient データ） ---

export async function generateIngredientPost(ingredient: IngredientData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      return await generateHotTake(client, ingredient);
    } catch (error) {
      console.error('Claude API error, using fallback:', error);
    }
  }

  return hotTakeFallback(ingredient);
}

async function generateHotTake(client: Anthropic, ingredient: IngredientData): Promise<GeneratedPosts> {
  const prompt = `${BRAND_VOICE}

【素材データ】
成分名: ${ingredient.name}（${ingredient.nameEn || ''}）
効果: ${ingredient.benefits?.slice(0, 5).join('、') || '情報なし'}
エビデンスレベル: ${ingredient.evidenceLevel || '不明'}
推奨摂取量: ${ingredient.recommendedDosage || '情報なし'}

【投稿タイプ: 🔥 ホットテイク】
この成分データを踏まえて、サプリ業界の常識を覆す鋭い意見を投稿。
「へぇ、このアカウント面白いな」とフォローしたくなる内容。

以下のパターンからランダムに1つ選んで生成:
1. 業界の矛盾を指摘 → 「エビデンスレベルが低いのに売れてる成分がある。逆にSランクなのに知られてない成分も」
2. 消費者の誤解を正す → 「〇〇mg入ってれば十分？吸収率考えたら話は変わる」
3. 476商品のデータで語る → 「476商品調べたら、同じ成分でも含有量に10倍の差があった」
4. 逆張りの視点 → 「〇〇サプリ、飲む前にまず食事を見直すべき理由」

【出力形式】JSON:
{
  "x": "X用（250文字以内。URLなし。パンチある短文。最後に問いかけかRT誘発の一言）",
  "threads": "Threads用（400文字以内。Xより少し詳しく。意見＋根拠。最後に問いかけ）",
  "instagram": "Instagram用（500文字以内。読み応えある内容。ハッシュタグ5個）"
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to extract JSON');
  return JSON.parse(jsonMatch[0]) as GeneratedPosts;
}

function hotTakeFallback(ingredient: IngredientData): GeneratedPosts {
  const evidence = ingredient.evidenceLevel || '調査中';
  const benefit = ingredient.benefits?.[0] || '健康をサポート';

  const x = `🔥 ${ingredient.name}のエビデンスレベルは「${evidence}」。

${benefit}といわれてるけど、476商品を分析すると含有量の差が激しい。

「入ってればOK」じゃない。量と質で選ぶ時代。

あなたは何を基準にサプリ選んでる？`;

  const threads = `🔥 サプリ業界のリアルな話をします。

${ingredient.name}のエビデンスレベルは「${evidence}」。
${benefit}といわれていますが、476商品を分析すると見えてくることがある。

同じ「${ingredient.name}配合」でも、含有量は商品によって大きく異なります。
パッケージの文字だけで選ぶのは危険。

サプティアでは¥/mg（1mgあたりの価格）で比較してます。
あなたは何を基準にサプリを選んでいますか？`;

  const instagram = `🔥 ${ingredient.name}の真実

エビデンスレベル: ${evidence}
期待される働き: ${benefit}

でも、知ってほしいのはここから。

476商品を分析して分かったのは、
同じ成分名でも中身はまったく違うということ。

含有量、吸収率、コスパ。
パッケージの印象だけで選んでいませんか？

サプティアは5つの軸で定量分析しています。
AIが答えを出す時代。Suptiaはその根拠を示す。

#サプリメント #${ingredient.name} #エビデンス #サプリ選び #サプティア`;

  return { x, threads, instagram };
}

// --- 商品紹介（レガシー、自動では使わないが関数は維持） ---

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

async function generateProductWithClaude(client: Anthropic, product: ProductData): Promise<GeneratedPosts> {
  const ingredientList = product.ingredients
    ?.slice(0, 3)
    .map((i) => i.ingredient?.name)
    .filter(Boolean)
    .join('、') || '各種成分';

  const prompt = `${BRAND_VOICE}

【商品情報】
商品名: ${product.name}
ブランド: ${product.brand?.name || '不明'}
主な成分: ${ingredientList}

【指示】
この商品データを使って、商品名は出さずに「こういう成分構成のサプリ、¥/mgで計算すると面白い結果になる」的な切り口で投稿を作成。宣伝っぽさゼロで。

【出力形式】JSON:
{
  "x": "X用（250文字以内。URLなし）",
  "threads": "Threads用（400文字以内）",
  "instagram": "Instagram用（500文字以内。ハッシュタグ5個）"
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to extract JSON');
  return JSON.parse(jsonMatch[0]) as GeneratedPosts;
}

function generateProductFallback(product: ProductData): GeneratedPosts {
  const brandName = product.brand?.name || '';

  const x = `📊 サプリの価格、パッケージの値段で判断してない？

1日あたり・1mgあたりで計算し直すと、
「高い」と思ってた商品が実はコスパ最強だったりする。

逆も然り。`;

  const threads = `📊 サプリの「本当の価格」を知っていますか？

${brandName}の商品を分析していて気づいたこと。

パッケージの値段だけで「高い」「安い」を判断するのは危険。
1日あたりのコスト、1mgあたりの価格で計算し直すと、
順位がガラッと変わることがある。

サプティアではすべての商品を¥/mgで比較しています。`;

  const instagram = `📊 サプリの「本当の価格」

パッケージに書いてある値段、信じてませんか？

サプティアが476商品を分析して分かったこと：

1日あたりのコストで比較すると、
「安い」と思ってた商品が実は割高。
「高い」と思ってた商品が実はコスパ最強。

¥/mg（1mgあたりの価格）で見ると世界が変わります。

#サプリメント #コスパ #価格比較 #サプリ選び #サプティア`;

  return { x, threads, instagram };
}

// --- どっち派？（versus データ） ---

export async function generateVersusPost(data: VersusData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      const prompt = `${BRAND_VOICE}

【素材データ】
成分1: ${data.ingredient1.name}（${data.ingredient1.nameEn || ''}）
 効果: ${data.ingredient1.benefits?.slice(0, 3).join('、') || '情報なし'}

成分2: ${data.ingredient2.name}（${data.ingredient2.nameEn || ''}）
 効果: ${data.ingredient2.benefits?.slice(0, 3).join('、') || '情報なし'}

【投稿タイプ: 💬 どっち派？】
2つの成分を比較して、フォロワーが思わず回答したくなる投稿を作成。
どちらが優れているかは断定しない。参加を促す。

パターンからランダムに1つ選んで生成:
1. 二択で煽る → 「朝イチで飲むなら〇〇？△△？ RT vs いいね で教えて」
2. 目的別に分ける → 「免疫なら〇〇、美容なら△△。あなたの優先順位は？」
3. 意外な共通点から入る → 「実は〇〇と△△、似た働きがある。じゃあ何が違う？」
4. 投票形式 → 「〇〇派 → RT / △△派 → いいね / 両方派 → 引用で理由教えて」

【出力形式】JSON:
{
  "x": "X用（200文字以内。RT・いいね・引用で参加できる形式。URLなし）",
  "threads": "Threads用（400文字以内。もう少し詳しく比較。最後に問いかけ）",
  "instagram": "Instagram用（500文字以内。両方の特徴を整理。ハッシュタグ5個）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]) as GeneratedPosts;
      }
    } catch (error) {
      console.error('Claude API error for versus:', error);
    }
  }

  // フォールバック
  const name1 = data.ingredient1.name;
  const name2 = data.ingredient2.name;
  const benefit1 = data.ingredient1.benefits?.[0] || '健康サポート';
  const benefit2 = data.ingredient2.benefits?.[0] || '健康サポート';

  const x = `💬 今日の二択。

${name1} → ${benefit1}
${name2} → ${benefit2}

${name1}派はRT
${name2}派はいいね
両方飲んでる人は引用で教えて👇`;

  const threads = `💬 サプリの二択、あなたはどっち？

【${name1}】
${benefit1}といわれています。

【${name2}】
${benefit2}といわれています。

正解はない。目的で変わる。
だからこそ聞きたい。

あなたはどっち派？`;

  const instagram = `💬 ${name1} vs ${name2}

あなたはどっち派？

【${name1}】
${data.ingredient1.benefits?.slice(0, 2).join('\n') || benefit1}

【${name2}】
${data.ingredient2.benefits?.slice(0, 2).join('\n') || benefit2}

正解はありません。大事なのは自分の目的に合っているかどうか。

サプティアでは成分ごとにエビデンスレベル（S〜D）で評価しています。
「なんとなく」ではなく「根拠」で選ぶ。

#サプリメント #${name1} #${name2} #サプリ選び #サプティア`;

  return { x, threads, instagram };
}

// --- データで暴く（cospa データ） ---

export async function generateCospaPost(product: ProductData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();
  const lowestPrice = product.prices?.reduce((min, p) => (p.amount < min ? p.amount : min), Infinity) || 0;

  if (client) {
    try {
      const ingredientList = product.ingredients
        ?.slice(0, 3)
        .map((i) => `${i.ingredient?.name}（${i.amountMgPerServing || '?'}mg）`)
        .filter(Boolean)
        .join('、') || '各種成分';

      const prompt = `${BRAND_VOICE}

【素材データ】
ある商品の分析結果:
主な成分: ${ingredientList}
最安値: ¥${lowestPrice.toLocaleString()}

【投稿タイプ: 📊 データで暴く】
コスパデータから、消費者が知らない衝撃的な事実を暴露。
商品名は出さない。データと数字で語る。
「このデータ、他のサイトでは見たことない」と思わせる。

パターンからランダムに1つ選んで生成:
1. 価格差の真実 → 「同じ成分量で最安¥○○、最高¥△△。中身は同じ。なぜ？」
2. コスパの罠 → 「安いサプリ、1日あたりで計算したら実は高かった話」
3. 数字のマジック → 「476商品中、¥/mgで見るとTOP10とワースト10で○倍の差」
4. 業界の闇 → 「含有量を大きく見せるテクニック、知ってる？」

【出力形式】JSON:
{
  "x": "X用（250文字以内。具体的な数字を入れる。URLなし。最後に問いかけ）",
  "threads": "Threads用（400文字以内。データを少し詳しく。¥/mgの概念を自然に紹介）",
  "instagram": "Instagram用（500文字以内。データビジュアル的な内容。ハッシュタグ5個）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]) as GeneratedPosts;
      }
    } catch (error) {
      console.error('Claude API error for cospa:', error);
    }
  }

  // フォールバック
  const x = `📊 476商品を¥/mg（1mgあたりの価格）で並べ替えた。

結果、パッケージ価格が安い＝コスパが良い、ではなかった。

「安いから」で選んでる人、
1日あたりのコストも見てる？`;

  const threads = `📊 サプリの「本当のコスパ」を暴きます。

サプティアでは476商品を¥/mg（1mgあたりの価格）で比較しています。

これで並べ替えると、驚くことが起きる。
パッケージ価格が一番安い商品が、コスパでは最下位だったりする。

理由は単純。「含有量が少ない」から。

安い × 少ない = 実質高い。
高い × 多い = 実質安い。

¥/mgで比較する習慣、つけてみてください。`;

  const instagram = `📊 サプリのコスパ、本当に理解してる？

476商品を分析して見えた事実。

パッケージ価格だけで判断すると損をする。

サプティアが使う指標「¥/mg」とは、
有効成分1mgあたりの価格のこと。

この指標で並べ替えると、
「安い」と思ってた商品が実は割高。
「高い」と思ってた商品が実はコスパ最強。

見た目の価格に騙されない選び方を。

#サプリメント #コスパ #サプリ比較 #賢い買い物 #サプティア`;

  return { x, threads, instagram };
}

// --- 知らないとヤバい（caution データ） ---

export async function generateCautionPost(data: CautionData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      const prompt = `${BRAND_VOICE}

【素材データ】
成分名: ${data.ingredient.name}
注意点: ${data.cautions.join('、')}
相互作用: ${data.interactions.join('、') || 'なし'}

【投稿タイプ: ⚠️ 知らないとヤバい】
副作用・相互作用の情報を「業界が積極的には言わない真実」として共有。
煽りすぎず、でも「これは知っておかないと」と思わせるトーン。
「天然=安全」という思い込みを壊す。

パターンからランダムに1つ選んで生成:
1. 飲み合わせ → 「〇〇と△△、一緒に飲んでる人多いけどそれ大丈夫？」
2. 過剰摂取 → 「〇〇、多く飲めば効くと思ってない？上限量知ってる？」
3. 天然信仰を壊す → 「天然成分だから安全？その思い込みが一番危ない」
4. 薬との相互作用 → 「〇〇サプリ × △△薬。この組み合わせ、知らない人が多すぎる」

必ず「気になる方は医師・薬剤師に相談を」を含める。

【出力形式】JSON:
{
  "x": "X用（250文字以内。URLなし。保存・RTしたくなる有益情報）",
  "threads": "Threads用（400文字以内。具体的な注意点。最後に相談推奨）",
  "instagram": "Instagram用（500文字以内。保存推奨コンテンツ。ハッシュタグ5個）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]) as GeneratedPosts;
      }
    } catch (error) {
      console.error('Claude API error for caution:', error);
    }
  }

  // フォールバック
  const cautionText = data.cautions[0] || '過剰摂取に注意';
  const interactionText = data.interactions[0] || '';

  const x = `⚠️ ${data.ingredient.name}を飲んでる人へ。

${cautionText}。
${interactionText ? `特に${interactionText}との組み合わせは要注意。` : ''}

「天然だから安全」は思い込み。
気になる方は医師・薬剤師に相談を。

保存しておいて損はない情報。`;

  const threads = `⚠️ これ、知らない人が多すぎる。

${data.ingredient.name}の注意点。

${data.cautions.map((c) => `・${c}`).join('\n')}
${data.interactions.length > 0 ? `\n相互作用:\n${data.interactions.map((i) => `・${i}`).join('\n')}` : ''}

サプリメントは「天然だから安全」ではありません。
量・組み合わせ・体質で結果は変わる。

不安がある方は、必ず医師・薬剤師に相談してください。

サプティアでは安全性を0-100点で評価しています。`;

  const instagram = `⚠️ ${data.ingredient.name}、飲む前に知っておくべきこと

「天然成分だから安全」
その思い込みが一番危険かもしれません。

${data.cautions.map((c) => `- ${c}`).join('\n')}
${data.interactions.length > 0 ? `\n飲み合わせ注意:\n${data.interactions.map((i) => `- ${i}`).join('\n')}` : ''}

サプリメントは正しく使ってこそ。
気になる方は医師・薬剤師に相談を。

この投稿、保存しておくと役立ちます。

#サプリメント #${data.ingredient.name} #飲み合わせ #安全性 #サプティア`;

  return { x, threads, instagram };
}

// --- サプティアの裏側（ranking データ） ---

export async function generateRankingPost(data: RankingData): Promise<GeneratedPosts> {
  const client = getAnthropicClient();

  if (client) {
    try {
      const productList = data.products
        .slice(0, 3)
        .map((p, i) => `${i + 1}位: ${p.name}（${p.brand?.name || ''}）`)
        .join('\n');

      const prompt = `${BRAND_VOICE}

【素材データ】
カテゴリ: ${data.category}
ランキングTOP3:
${productList}

【投稿タイプ: 🔬 サプティアの裏側】
ランキングデータを題材に、サプティアの分析手法やAIの仕組みを紹介。
「ただの比較サイトじゃないな」と思わせる。商品名は出さなくてOK。

パターンからランダムに1つ選んで生成:
1. 評価の裏側 → 「このランキング、価格だけで作ってない。5つの軸×AI監修」
2. AI専門家の話 → 「薬剤師AI、管理栄養士AI、臨床研究者AI…5つの視点でチェックしてる」
3. 独自指標 → 「¥/mgって指標、うちが作った。1mgあたりの価格で比較すると世界が変わる」
4. 分析プロセス → 「476商品、毎日自動で価格チェックしてる。人力じゃ無理」

【出力形式】JSON:
{
  "x": "X用（250文字以内。URLなし。サプティアの技術力や独自性をさりげなくアピール）",
  "threads": "Threads用（400文字以内。分析手法を少し詳しく）",
  "instagram": "Instagram用（500文字以内。技術的な裏側を分かりやすく。ハッシュタグ5個）"
}`;

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]) as GeneratedPosts;
      }
    } catch (error) {
      console.error('Claude API error for ranking:', error);
    }
  }

  // フォールバック
  const x = `🔬 サプティアの裏側。

476商品の価格を毎日自動チェック。
5つのAI専門家が全コンテンツを監修。
¥/mgという独自指標でコスパを定量化。

「比較サイト」じゃない。
サプリの意思決定エンジン。`;

  const threads = `🔬 サプティアの分析、裏側を少しだけ。

よくある比較サイトは「おすすめ10選！」で終わる。
うちは違う。

476商品に対して:
・価格を毎日自動チェック
・有効成分量を1mgまで正規化
・¥/mg（1mgあたりの価格）を算出
・エビデンスレベルをS〜Dで評価
・安全性を0-100点でスコアリング

さらに5つのAI専門家（薬剤師・管理栄養士・臨床研究者・薬機法・消費者保護）が監修。

「AIが答えを出す時代。Suptiaはその根拠を示す。」`;

  const instagram = `🔬 サプティアの裏側

「ただの比較サイトでしょ？」

よく言われます。でも全然違います。

サプティアがやっていること：

1. 476商品の価格を毎日自動チェック
2. 有効成分量を1mgまで正規化
3. ¥/mg（1mgあたりの価格）を算出
4. エビデンスレベルをS〜Dの5段階で評価
5. 安全性を0-100点でスコアリング

さらに5つのAI専門家が全コンテンツを監修：
薬剤師AI / 管理栄養士AI / 臨床研究者AI / 薬機法AI / 消費者保護AI

AIが答えを出す時代。
Suptiaはその根拠を示す。

#サプティア #AI #サプリメント #データ分析 #Suptia`;

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
