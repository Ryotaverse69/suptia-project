import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

const IMAGE_STYLES: Record<string, string> = {
  "modern-minimal":
    "Modern minimalist style, clean white background, soft shadows, professional aesthetic",
  "natural-wellness":
    "Natural wellness aesthetic, soft natural lighting, botanical elements, earth tones",
  scientific:
    "Scientific and professional, clean laboratory aesthetic, blue and white color scheme",
  lifestyle:
    "Lifestyle photography, morning routine aesthetic, cozy home setting, warm natural light",
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
  const fullPrompt = `Create a high-quality Instagram carousel slide image.

${prompt}

Image specifications:
- Aspect ratio: ${aspectRatio.ratio} (${aspectRatio.width}x${aspectRatio.height} pixels)
- Professional, clean composition
- Suitable for health and wellness brand
- No text, watermarks, or logos in the image
- High resolution, Instagram-ready quality
- Vibrant but natural colors`;

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
          await sleep(3000 * attempt); // 指数バックオフ（少し長め）
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

    if (type === "cover") {
      prompt = `Cover image for Instagram carousel about supplements.
Topic: ${title}
Style: ${selectedStyle}
Make it eye-catching and inviting to swipe through.
Background should be visually appealing with supplement-related imagery.`;
      filename = `carousel_${imageTimestamp}_cover.png`;
      imageType = "cover";
    } else {
      prompt = `Content slide ${(index || 0) + 1} for Instagram carousel about supplements.
Heading: ${slideHeading}
Content theme: ${slideContent}
Style: ${selectedStyle}
Create a clean, informative background that complements text overlay.
Should feel cohesive with other slides in the series.`;
      filename = `carousel_${imageTimestamp}_slide${(index || 0) + 1}.png`;
      imageType = `slide${(index || 0) + 1}`;
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
    });
  } catch (error) {
    console.error("Single image generation error:", error);
    const errorMessage = (error as Error).message;

    // 過負荷エラーの場合は専用メッセージ
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
