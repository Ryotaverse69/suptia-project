import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdminToken } from "@/lib/supabase/admin-auth";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// イラスト/図解スタイル（統一感重視）
const IMAGE_STYLES: Record<
  string,
  { style: string; colorPalette: string; elements: string }
> = {
  "flat-minimal": {
    style: "Flat design illustration, minimal 2D vector art style",
    colorPalette:
      "Soft pastel colors with mint green, light blue, and cream white",
    elements: "Simple geometric shapes, clean icons, subtle gradients",
  },
  "modern-infographic": {
    style: "Modern infographic illustration, clean data visualization style",
    colorPalette: "Professional blue, teal, and white color scheme",
    elements:
      "Charts, icons, connecting lines, organized layout with visual hierarchy",
  },
  "organic-wellness": {
    style: "Organic hand-drawn illustration style, soft and friendly",
    colorPalette: "Earth tones with sage green, warm beige, and soft coral",
    elements: "Botanical elements, leaves, natural shapes, gentle curved lines",
  },
  "gradient-modern": {
    style: "Modern gradient illustration, smooth colorful transitions",
    colorPalette:
      "Vibrant gradient from purple to pink to orange, with white accents",
    elements:
      "Abstract shapes, floating elements, glass morphism effects, soft shadows",
  },
};

const ASPECT_RATIOS = {
  square: { ratio: "1:1", width: 1080, height: 1080 },
  portrait: { ratio: "4:5", width: 1080, height: 1350 },
  story: { ratio: "9:16", width: 1080, height: 1920 },
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1枚の画像を生成（リトライ付き）
async function generateSingleImage(
  prompt: string,
  aspectRatio: { ratio: string; width: number; height: number },
  maxRetries = 3,
): Promise<string> {
  const fullPrompt = `${prompt}

CRITICAL STYLE REQUIREMENTS:
- MUST be a flat illustration or infographic style (NOT a photograph)
- MUST be 2D vector art style with clean edges
- NO photorealistic elements, NO 3D renders, NO photographs
- Clean, minimal design suitable for Instagram carousel
- Aspect ratio: ${aspectRatio.ratio} (${aspectRatio.width}x${aspectRatio.height} pixels)
- Professional quality, Instagram-ready
- Text must be in JAPANESE (日本語)
- Text should be clearly readable with good contrast`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Image generation attempt ${attempt}/${maxRetries}...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          throw new Error(`API error: ${errorText}`);
        }

        // 503 (overloaded) の場合はリトライ
        if (errorJson.error?.code === 503) {
          console.log(`Model overloaded, waiting before retry...`);
          await sleep(3000 * attempt);
          lastError = new Error("モデルが過負荷状態です。リトライ中...");
          continue;
        }

        throw new Error(`API error: ${errorText}`);
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: { inlineData?: { mimeType: string } }) =>
        p.inlineData?.mimeType?.startsWith("image/"),
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error("画像が生成されませんでした");
      }

      console.log(`Image generated successfully on attempt ${attempt}`);
      return imagePart.inlineData.data;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        console.log(
          `Attempt ${attempt} failed, retrying in ${3 * attempt}s...`,
        );
        await sleep(3000 * attempt);
      }
    }
  }

  throw lastError || new Error("画像生成に失敗しました");
}

export async function POST(request: NextRequest) {
  // 管理者認証チェック（トークンベース）
  const authHeader = request.headers.get("authorization");
  const { isAdmin, error: authError } = await verifyAdminToken(authHeader);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: authError || "認証エラー" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const {
      type, // "cover" | "slide"
      index, // スライドのインデックス（0始まり）
      title, // 表紙用タイトル
      slideHeading, // スライド用見出し
      slideContent, // スライド用内容
      style,
      aspectRatio = "square",
      timestamp, // 同一セッションの画像をまとめるため
    } = body;

    // スタイルを選択（ランダムまたは指定）
    const styleKeys = Object.keys(IMAGE_STYLES);
    const selectedStyleKey =
      style && IMAGE_STYLES[style]
        ? style
        : styleKeys[Math.floor(Math.random() * styleKeys.length)];
    const selectedStyle = IMAGE_STYLES[selectedStyleKey];

    const selectedAspectRatio =
      ASPECT_RATIOS[aspectRatio as keyof typeof ASPECT_RATIOS] ||
      ASPECT_RATIOS.square;

    const imageTimestamp = timestamp || Date.now();
    const publicDir = path.join(process.cwd(), "public", "instagram");
    await mkdir(publicDir, { recursive: true });

    let prompt: string;
    let filename: string;
    let imageType: string;

    // 共通のスタイル指定
    const styleSpec = `
Art Style: ${selectedStyle.style}
Color Palette: ${selectedStyle.colorPalette}
Visual Elements: ${selectedStyle.elements}
Design: Flat 2D illustration, vector art style, clean and modern`;

    if (type === "cover") {
      prompt = `Create an eye-catching COVER illustration for an Instagram carousel about supplements.

MAIN TITLE TEXT TO DISPLAY: "${title}"

${styleSpec}

Cover-specific requirements:
- Display the MAIN TITLE prominently in Japanese: "${title}"
- Title should be large, bold, and easy to read
- Central visual element representing the topic with relevant icons/illustrations
- Eye-catching composition that invites viewers to swipe
- Supplement/health/wellness themed iconography around the title
- Add visual hint to swipe (arrow or dots at bottom)`;
      filename = `carousel_${imageTimestamp}_cover.png`;
      imageType = "cover";
    } else {
      const slideNum = (index || 0) + 1;
      prompt = `Create a content SLIDE illustration for an Instagram carousel about supplements.

HEADING TEXT TO DISPLAY: "${slideHeading}"
CONTENT TO ILLUSTRATE: "${slideContent}"

${styleSpec}

Slide-specific requirements:
- Display the HEADING prominently in Japanese: "${slideHeading}"
- Create infographic/diagram that visually explains: "${slideContent}"
- Use icons, simple diagrams, and visual elements to illustrate the content
- Heading at top, infographic/diagram in the center/bottom
- Consistent style with other slides in the series
- Make the information visually understandable at a glance`;
      filename = `carousel_${imageTimestamp}_slide${slideNum}.png`;
      imageType = `slide${slideNum}`;
    }

    console.log(`Generating ${imageType}...`);
    const imageBase64 = await generateSingleImage(prompt, selectedAspectRatio);

    await writeFile(
      path.join(publicDir, filename),
      Buffer.from(imageBase64, "base64"),
    );
    console.log(`${imageType} saved:`, filename);

    return NextResponse.json({
      success: true,
      image: {
        type: imageType,
        url: `/instagram/${filename}`,
        filename,
      },
      timestamp: imageTimestamp,
      style: selectedStyleKey,
    });
  } catch (error) {
    console.error("Single image generation error:", error);
    const errorMessage = (error as Error).message;

    if (errorMessage.includes("過負荷") || errorMessage.includes("503")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "モデルが過負荷状態です。\n\n30秒〜1分ほど待ってから再試行してください。",
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
