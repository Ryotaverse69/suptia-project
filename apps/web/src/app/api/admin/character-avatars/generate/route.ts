/**
 * キャラクターアバター生成 API
 *
 * POST /api/admin/character-avatars/generate
 * - Admin専用
 * - Gemini 2.0 Flash で画像生成
 * - Base64画像を返却
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// キャラクター別のデフォルトプロンプト
const CHARACTER_PROMPTS: Record<string, string> = {
  navi: `Create a friendly and professional AI assistant avatar.
Style: Modern, clean, minimalist illustration
Character: A helpful guide with a warm, trustworthy appearance
Colors: Soft green and teal gradient accents
Expression: Friendly smile, approachable
Format: Square avatar icon, simple background, suitable for UI`,

  mint: `Create a cheerful and energetic AI assistant avatar.
Style: Cute anime-inspired illustration
Character: A playful, friendly companion with youthful energy
Colors: Fresh mint green, bright accents
Expression: Happy, enthusiastic smile with sparkling eyes
Format: Square avatar icon, simple background, suitable for UI`,

  doc: `Create a knowledgeable and scholarly AI assistant avatar.
Style: Professional illustration with a touch of sophistication
Character: A wise researcher/scientist type with intellectual aura
Colors: Deep blue, silver accents
Expression: Thoughtful, confident, intelligent gaze
Format: Square avatar icon, simple background, suitable for UI`,

  haru: `Create a gentle and caring AI assistant avatar.
Style: Soft, warm illustration style
Character: A nurturing, supportive companion with calming presence
Colors: Warm orange, soft yellow accents
Expression: Kind, reassuring smile, gentle eyes
Format: Square avatar icon, simple background, suitable for UI`,
};

export async function POST(request: NextRequest) {
  try {
    // Admin認証チェック
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 },
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { characterId, customPrompt } = body;

    if (
      !characterId ||
      !["core", "mint", "repha", "haku"].includes(characterId)
    ) {
      return NextResponse.json(
        { error: "有効なキャラクターIDが必要です" },
        { status: 400 },
      );
    }

    // Gemini API キーチェック
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_AI_API_KEY が設定されていません" },
        { status: 500 },
      );
    }

    // プロンプト構築
    const prompt = customPrompt || CHARACTER_PROMPTS[characterId];

    // Gemini で画像生成
    // 画像生成対応モデル: gemini-3-pro-image-preview
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-pro-image-preview",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      } as any,
    });

    const result = await model.generateContent(
      `Generate an avatar image with the following specifications:\n\n${prompt}\n\nIMPORTANT: The image should be a clean, professional avatar suitable for a chat interface. Square format, 512x512 pixels preferred.`,
    );

    const response = result.response;

    // 画像データを抽出
    let imageData: string | null = null;
    let mimeType = "image/png";

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType || "image/png";
        break;
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "画像の生成に失敗しました。再度お試しください。" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      characterId,
      image: {
        base64: imageData,
        mimeType,
      },
      prompt,
      model: "gemini-3-pro-image-preview",
    });
  } catch (error) {
    console.error("[Character Avatar Generate] Error:", error);
    return NextResponse.json(
      { error: "画像生成中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
