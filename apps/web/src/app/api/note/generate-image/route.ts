import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Gemini画像生成は時間がかかるため、Vercelの関数タイムアウトを延長
export const maxDuration = 120; // 2分

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

/**
 * ログイン済みユーザーを検証（管理者権限は不要）
 */
async function verifyUserToken(authHeader: string | null): Promise<{
  isAuthenticated: boolean;
  userId?: string;
  error?: string;
}> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isAuthenticated: false, error: "認証トークンが必要です" };
  }

  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { isAuthenticated: false, error: "サーバー設定エラー" };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAuthenticated: false, error: "ログインが必要です" };
    }

    return { isAuthenticated: true, userId: user.id };
  } catch {
    return { isAuthenticated: false, error: "認証エラーが発生しました" };
  }
}

// 画像サイズ設定
const IMAGE_SIZES = {
  eyecatch: { width: 1280, height: 670, label: "アイキャッチ (1280×670)" },
  insert: { width: 1200, height: 630, label: "挿入画像 (1200×630)" },
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1回のAPI呼び出しのタイムアウト（90秒）
const PER_ATTEMPT_TIMEOUT_MS = 90_000;

// 1枚の画像を生成（リトライ付き）
async function generateImage(
  prompt: string,
  maxRetries = 2,
): Promise<{ data: string; mimeType: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[note] Image generation attempt ${attempt}/${maxRetries}...`,
      );

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
          signal: AbortSignal.timeout(PER_ATTEMPT_TIMEOUT_MS),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          throw new Error(
            `API error (${response.status}): ${errorText.slice(0, 200)}`,
          );
        }

        // 503 (overloaded) or 429 (rate limit) の場合はリトライ
        if (errorJson.error?.code === 503 || errorJson.error?.code === 429) {
          console.log(
            `[note] Model overloaded/rate-limited (${errorJson.error.code}), waiting before retry...`,
          );
          await sleep(5000 * attempt);
          lastError = new Error(
            `モデルが過負荷状態です (${errorJson.error.code})。リトライ中...`,
          );
          continue;
        }

        throw new Error(
          `API error (${errorJson.error?.code}): ${errorJson.error?.message || errorText.slice(0, 200)}`,
        );
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: { inlineData?: { mimeType: string } }) =>
        p.inlineData?.mimeType?.startsWith("image/"),
      );

      if (!imagePart?.inlineData?.data) {
        // テキストのみ返された場合のエラーメッセージ改善
        const textParts = parts.filter((p: { text?: string }) => p.text);
        const textResponse = textParts
          .map((p: { text: string }) => p.text)
          .join(" ")
          .slice(0, 100);
        throw new Error(
          `画像が生成されませんでした。${textResponse ? `モデル応答: ${textResponse}` : "レスポンスに画像データがありません"}`,
        );
      }

      const mimeType = imagePart.inlineData.mimeType || "image/jpeg";
      console.log(
        `[note] Image generated successfully on attempt ${attempt} (${mimeType})`,
      );
      return { data: imagePart.inlineData.data, mimeType };
    } catch (error) {
      lastError = error as Error;
      const isTimeout =
        lastError.name === "TimeoutError" ||
        lastError.message.includes("timed out");
      if (isTimeout) {
        lastError = new Error(
          `画像生成がタイムアウトしました（${PER_ATTEMPT_TIMEOUT_MS / 1000}秒）。再試行してください。`,
        );
      }
      if (attempt < maxRetries) {
        console.log(
          `[note] Attempt ${attempt} failed (${lastError.message}), retrying in ${5 * attempt}s...`,
        );
        await sleep(5000 * attempt);
      }
    }
  }

  throw lastError || new Error("画像生成に失敗しました");
}

export async function POST(request: NextRequest) {
  // ログイン済みユーザーのみ利用可能
  const authHeader = request.headers.get("authorization");
  const { isAuthenticated, error: authError } =
    await verifyUserToken(authHeader);
  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: authError || "ログインが必要です" },
      { status: 401 },
    );
  }

  if (!GOOGLE_AI_API_KEY) {
    return NextResponse.json(
      { success: false, error: "GOOGLE_AI_API_KEY が設定されていません" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const {
      prompt,
      imageType = "eyecatch", // "eyecatch" | "insert"
      articleTitle = "",
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "プロンプトが必要です" },
        { status: 400 },
      );
    }

    const size =
      IMAGE_SIZES[imageType as keyof typeof IMAGE_SIZES] ||
      IMAGE_SIZES.eyecatch;

    // プロンプトにサイズ情報を追加
    const fullPrompt = `${prompt}

IMPORTANT: Output image at exactly ${size.width}x${size.height} pixels.`;

    console.log(`[note] Generating ${imageType} image for: ${articleTitle}`);
    const { data: imageBase64, mimeType } = await generateImage(fullPrompt);

    // MIMEタイプに合った拡張子を決定
    const ext = mimeType === "image/png" ? "png" : "jpg";

    // ファイル名を生成
    const timestamp = Date.now();
    const sanitizedTitle = articleTitle
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 30);
    const filename = `note_${imageType}_${sanitizedTitle}_${timestamp}.${ext}`;

    // Base64データURLとして返す（実際のMIMEタイプを使用）
    const dataUrl = `data:${mimeType};base64,${imageBase64}`;
    console.log(`[note] ${imageType} generated successfully (${mimeType})`);

    return NextResponse.json({
      success: true,
      image: {
        url: dataUrl,
        filename,
        type: imageType,
        size: size.label,
      },
    });
  } catch (error) {
    console.error("[note] Image generation error:", error);
    const errorMessage = (error as Error).message;

    if (errorMessage.includes("過負荷") || errorMessage.includes("503")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "モデルが過負荷状態です。\n30秒〜1分ほど待ってから再試行してください。",
          retryable: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "画像生成に失敗しました: " + errorMessage,
        retryable: false,
      },
      { status: 500 },
    );
  }
}
