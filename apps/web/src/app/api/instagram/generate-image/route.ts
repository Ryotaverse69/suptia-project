import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// Instagram投稿用の画像スタイル
const IMAGE_STYLES = [
  {
    id: "modern-minimal",
    name: "モダンミニマル",
    style:
      "Modern minimalist style, clean white background, soft shadows, professional aesthetic",
  },
  {
    id: "natural-wellness",
    name: "ナチュラルウェルネス",
    style:
      "Natural wellness aesthetic, soft natural lighting, botanical elements, earth tones",
  },
  {
    id: "scientific",
    name: "サイエンティフィック",
    style:
      "Scientific and professional, clean laboratory aesthetic, blue and white color scheme",
  },
  {
    id: "lifestyle",
    name: "ライフスタイル",
    style:
      "Lifestyle photography, morning routine aesthetic, cozy home setting, warm natural light",
  },
];

// Instagramに最適化されたアスペクト比
const ASPECT_RATIOS = {
  square: { ratio: "1:1", width: 1080, height: 1080 },
  portrait: { ratio: "4:5", width: 1080, height: 1350 },
  story: { ratio: "9:16", width: 1080, height: 1920 },
};

interface SlideContent {
  heading: string;
  content: string;
}

// リトライ付き単一画像生成
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
        const errorJson = JSON.parse(errorText);

        // 503 (overloaded) の場合はリトライ
        if (errorJson.error?.code === 503) {
          console.log(`Model overloaded, waiting before retry...`);
          await sleep(2000 * attempt); // 指数バックオフ
          lastError = new Error("モデルが過負荷状態です");
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
        console.log(`Attempt ${attempt} failed, retrying...`);
        await sleep(2000 * attempt);
      }
    }
  }

  throw lastError || new Error("画像生成に失敗しました");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      style,
      aspectRatio = "square",
      title,
      slides = [],
      generateCover = true,
    } = body;

    const selectedStyle =
      IMAGE_STYLES.find((s) => s.id === style) ||
      IMAGE_STYLES[Math.floor(Math.random() * IMAGE_STYLES.length)];

    const selectedAspectRatio =
      ASPECT_RATIOS[aspectRatio as keyof typeof ASPECT_RATIOS] ||
      ASPECT_RATIOS.square;

    const timestamp = Date.now();
    const publicDir = path.join(process.cwd(), "public", "instagram");
    await mkdir(publicDir, { recursive: true });

    const generatedImages: { type: string; url: string; filename: string }[] =
      [];
    const errors: string[] = [];

    // 表紙を生成
    if (generateCover && title) {
      try {
        console.log("Generating cover image...");
        const coverPrompt = `Cover image for Instagram carousel about supplements.
Topic: ${title}
Style: ${selectedStyle.style}
Make it eye-catching and inviting to swipe through.
Background should be visually appealing with supplement-related imagery.`;

        const coverBase64 = await generateSingleImage(
          coverPrompt,
          selectedAspectRatio,
        );
        const coverFilename = `carousel_${timestamp}_cover.png`;
        await writeFile(
          path.join(publicDir, coverFilename),
          Buffer.from(coverBase64, "base64"),
        );
        generatedImages.push({
          type: "cover",
          url: `/instagram/${coverFilename}`,
          filename: coverFilename,
        });
        console.log("Cover image saved:", coverFilename);
      } catch (error) {
        const errMsg = (error as Error).message;
        console.error("Cover generation failed:", errMsg);
        errors.push(`表紙: ${errMsg}`);
      }
    }

    // 各スライドの画像を生成（1枚ずつ、間隔を空けて）
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as SlideContent;
      try {
        console.log(`Generating slide ${i + 1}...`);

        // リクエスト間に少し間隔を空ける（過負荷対策）
        if (i > 0) {
          await sleep(1000);
        }

        const slidePrompt = `Content slide ${i + 1} for Instagram carousel about supplements.
Heading: ${slide.heading}
Content theme: ${slide.content}
Style: ${selectedStyle.style}
Create a clean, informative background that complements text overlay.
Should feel cohesive with other slides in the series.`;

        const slideBase64 = await generateSingleImage(
          slidePrompt,
          selectedAspectRatio,
        );
        const slideFilename = `carousel_${timestamp}_slide${i + 1}.png`;
        await writeFile(
          path.join(publicDir, slideFilename),
          Buffer.from(slideBase64, "base64"),
        );
        generatedImages.push({
          type: `slide${i + 1}`,
          url: `/instagram/${slideFilename}`,
          filename: slideFilename,
        });
        console.log(`Slide ${i + 1} saved:`, slideFilename);
      } catch (error) {
        const errMsg = (error as Error).message;
        console.error(`Slide ${i + 1} generation failed:`, errMsg);
        errors.push(`スライド${i + 1}: ${errMsg}`);
      }
    }

    // スライドがない場合は単一画像を生成
    if (slides.length === 0 && generatedImages.length === 0) {
      try {
        const singlePrompt = `Instagram post image for supplement comparison website.
Style: ${selectedStyle.style}
Subject: Health and wellness supplements arranged professionally.`;

        const imageBase64 = await generateSingleImage(
          singlePrompt,
          selectedAspectRatio,
        );
        const filename = `instagram_${timestamp}.png`;
        await writeFile(
          path.join(publicDir, filename),
          Buffer.from(imageBase64, "base64"),
        );
        generatedImages.push({
          type: "single",
          url: `/instagram/${filename}`,
          filename,
        });
      } catch (error) {
        errors.push(`画像: ${(error as Error).message}`);
      }
    }

    // 結果を返す
    if (generatedImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `画像を生成できませんでした。モデルが過負荷状態の可能性があります。\n\nしばらく待ってから再試行してください。\n\nエラー詳細:\n${errors.join("\n")}`,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      style: selectedStyle.name,
      aspectRatio: `${selectedAspectRatio.ratio} (${selectedAspectRatio.width}x${selectedAspectRatio.height})`,
      images: generatedImages,
      totalCount: generatedImages.length,
      errors: errors.length > 0 ? errors : undefined,
      message:
        errors.length > 0
          ? `${generatedImages.length}枚生成成功、${errors.length}枚失敗`
          : `${generatedImages.length}枚すべて生成成功`,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "画像生成に失敗しました。詳細: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
