import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * 管理者認証を検証
 */
async function verifyAdminAuth(): Promise<{
  isAdmin: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { isAdmin: false, error: "認証が必要です" };
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    if (!profile?.is_admin) {
      return { isAdmin: false, error: "管理者権限が必要です" };
    }

    return { isAdmin: true };
  } catch {
    return { isAdmin: false, error: "認証エラーが発生しました" };
  }
}

const CATEGORIES = [
  {
    id: "ingredient",
    name: "成分紹介",
    prompt: `サプリメントの成分について紹介するカルーセル投稿を作成してください。
以下の成分からランダムに1つ選んでください：
ビタミンD、ビタミンC、ビタミンB12、マグネシウム、亜鉛、鉄分、オメガ3、コエンザイムQ10、プロバイオティクス、コラーゲン`,
  },
  {
    id: "comparison",
    name: "商品比較",
    prompt: `サプリメントを選ぶ際のポイントについてカルーセル投稿を作成してください。
以下のテーマからランダムに1つ選んでください：
- 国産vs海外サプリの違い
- カプセルvsタブレットの選び方
- 単体成分vsマルチビタミン
- コスパ重視vs品質重視
- 初心者向けサプリの選び方`,
  },
  {
    id: "tips",
    name: "健康Tips",
    prompt: `サプリメントや健康に関するTipsをカルーセル投稿で紹介してください。
以下のテーマからランダムに1つ選んでください：
- サプリを飲む最適なタイミング
- サプリの保存方法
- サプリと食事の相性
- 季節別おすすめサプリ
- サプリの効果を最大化するコツ`,
  },
];

export async function POST(request: NextRequest) {
  // 管理者認証チェック
  const { isAdmin, error: authError } = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: authError || "認証エラー" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { category, customTopic, slideCount = 5 } = body;

    // カテゴリ選択（指定なしならランダム）
    let selectedCategory;
    if (category && category !== "random") {
      selectedCategory = CATEGORIES.find((c) => c.id === category);
    }
    if (!selectedCategory) {
      selectedCategory =
        CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    }

    const topicInstruction = customTopic
      ? `\n\n特にこのトピックについて書いてください: ${customTopic}`
      : "";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `あなたはSuptia（サプティア）というサプリメント比較サイトのSNSマーケティング担当です。
Instagramのカルーセル投稿（複数画像投稿）用のコンテンツを作成してください。

【投稿構成】
- 表紙（1枚目）: キャッチーなタイトル
- 内容スライド（${slideCount}枚）: 各スライドのテキスト内容
- 最終スライド: まとめ＋CTA

【出力フォーマット】
以下のJSON形式で出力してください：

{
  "title": "投稿のタイトル（表紙用）",
  "slides": [
    {
      "heading": "スライドの見出し",
      "content": "スライドの本文（2-3行）"
    }
  ],
  "caption": "投稿キャプション（3行以内の要約）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", ...]
}

【ガイドライン】
- 各スライドは簡潔に（読みやすく）
- 専門用語は避け、分かりやすく
- ハッシュタグは10-15個

【禁止ワード（絶対に使用しないこと）】
- 薬機法NG: 「治る」「治療」「予防」「防ぐ」「効く」「改善」「治す」
- 権威訴求NG: 「専門家」「医師」「医者」「ドクター」「研究者」「プロ」「推奨」「認定」「監修」「お墨付き」
- 誇大表現NG: 「絶対」「確実」「必ず」「100%」「最強」「奇跡」「驚異」

【OK表現の例】
- 「〜をサポート」「〜に役立つ可能性」「〜が期待できる」
- 「研究では〜という報告があります」「〜と言われています」

${selectedCategory.prompt}${topicInstruction}

---
上記を踏まえて、カルーセル投稿用のJSONを生成してください。JSONのみを出力し、説明は不要です。`,
        },
      ],
    });

    const content = message.content[0];
    const responseText = content.type === "text" ? content.text : "";

    // JSONをパース
    let parsedContent;
    try {
      // JSONブロックを抽出
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON not found in response");
      }
    } catch {
      console.error("Failed to parse JSON:", responseText);
      // フォールバック: プレーンテキストとして返す
      return NextResponse.json({
        success: true,
        category: selectedCategory.name,
        title: "カルーセル投稿",
        slides: [{ heading: "内容", content: responseText }],
        caption: "",
        hashtags: [],
        raw: responseText,
      });
    }

    return NextResponse.json({
      success: true,
      category: selectedCategory.name,
      title: parsedContent.title,
      slides: parsedContent.slides,
      caption: parsedContent.caption,
      hashtags: parsedContent.hashtags || [],
    });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { success: false, error: "キャプション生成に失敗しました" },
      { status: 500 },
    );
  }
}
