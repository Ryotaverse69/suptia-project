import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAdminToken } from "@/lib/supabase/admin-auth";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// OGP画像サイズ (Twitter/Facebook最適)
const OGP_SIZE = { width: 1200, height: 630, ratio: "1.91:1" };

// スタイル定義
const OGP_STYLES = {
  "flat-minimal": {
    style: "Flat design illustration, minimal 2D vector art style",
    colorPalette:
      "Soft pastel colors with mint green (#98D8C8), light blue (#7EC8E3), cream white (#FFF8E7), and subtle coral (#FFB5A7)",
    elements:
      "Simple geometric shapes, clean icons, subtle gradients, rounded corners",
  },
  "modern-health": {
    style: "Modern health/wellness illustration, clean and professional",
    colorPalette:
      "Professional teal (#20B2AA), soft blue (#87CEEB), white (#FFFFFF), light gray (#F5F5F5)",
    elements: "Medical/health icons, abstract shapes, clean typography space",
  },
};

// Cloudinary設定
function configureCloudinary(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 画像生成
async function generateOGPImage(
  prompt: string,
  maxRetries = 3,
): Promise<string> {
  const fullPrompt = `${prompt}

CRITICAL STYLE REQUIREMENTS:
- MUST be a flat illustration style (NOT a photograph)
- MUST be 2D vector art style with clean edges
- NO photorealistic elements, NO 3D renders, NO photographs
- Clean, minimal design suitable for OGP/social media preview
- Aspect ratio: ${OGP_SIZE.ratio} (${OGP_SIZE.width}x${OGP_SIZE.height} pixels)
- Professional quality, social media ready
- Leave space on the left or bottom for text overlay
- Brand colors: mint green, light blue, cream white`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OGP image generation attempt ${attempt}/${maxRetries}...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GOOGLE_AI_API_KEY}`,
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

        if (errorJson.error?.code === 503) {
          console.log(`Model overloaded, waiting before retry...`);
          await sleep(3000 * attempt);
          lastError = new Error("Model overloaded");
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
        throw new Error("No image generated");
      }

      console.log(`OGP image generated successfully on attempt ${attempt}`);
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

  throw lastError || new Error("Image generation failed");
}

// Cloudinaryにアップロード
async function uploadToCloudinary(
  imageBase64: string,
  folder: string,
  publicId: string,
): Promise<{ url: string; publicId: string }> {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary not configured");
  }

  const dataUri = `data:image/png;base64,${imageBase64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `suptia-og/${folder}`,
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
    transformation: [
      { width: OGP_SIZE.width, height: OGP_SIZE.height, crop: "fill" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

// プロンプト生成
function createPrompt(
  type: "ingredient" | "article" | "tool",
  data: {
    name: string;
    nameEn?: string;
    category?: string;
    description?: string;
  },
  style: keyof typeof OGP_STYLES = "flat-minimal",
): string {
  const styleConfig = OGP_STYLES[style];

  const baseStyle = `
Art Style: ${styleConfig.style}
Color Palette: ${styleConfig.colorPalette}
Visual Elements: ${styleConfig.elements}`;

  switch (type) {
    case "ingredient":
      return `Create an OGP image for a supplement ingredient guide page.

Topic: ${data.name} (${data.nameEn || ""})
Category: ${data.category || "Supplement"}

${baseStyle}

Requirements:
- Central visual element representing ${data.nameEn || data.name}
- Abstract/symbolic representation (not literal pills/capsules)
- Space at bottom-left for text overlay with title
- Clean, professional health/wellness aesthetic
- No text in the image itself
- Suptia brand feel (modern, trustworthy, scientific)`;

    case "article":
      return `Create an OGP image for a supplement comparison article.

Topic: ${data.name}
${data.description ? `Description: ${data.description}` : ""}

${baseStyle}

Requirements:
- Visual elements suggesting comparison/ranking
- Abstract representation of supplements being compared
- Space for text overlay
- Professional, editorial feel
- No text in the image itself`;

    case "tool":
      return `Create an OGP image for a free online tool.

Tool Name: ${data.name}
${data.description ? `Purpose: ${data.description}` : ""}

${baseStyle}

Requirements:
- Visual elements suggesting calculation/analysis
- Abstract icons representing the tool's function
- Space for text overlay
- Modern, utility-focused design
- No text in the image itself`;

    default:
      return `Create an OGP image.
${baseStyle}
Topic: ${data.name}`;
  }
}

export async function POST(request: NextRequest) {
  // 管理者認証
  const authHeader = request.headers.get("authorization");
  const { isAdmin, error: authError } = await verifyAdminToken(authHeader);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: authError || "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const {
      type, // "ingredient" | "article" | "tool"
      slug,
      name,
      nameEn,
      category,
      description,
      style = "flat-minimal",
    } = body;

    if (!type || !slug || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, slug, name" },
        { status: 400 },
      );
    }

    // プロンプト生成
    const prompt = createPrompt(
      type,
      { name, nameEn, category, description },
      style,
    );

    console.log(`Generating OGP for ${type}: ${name}...`);

    // 画像生成
    const imageBase64 = await generateOGPImage(prompt);

    // Cloudinaryにアップロード
    const folderMap: Record<string, string> = {
      ingredient: "ingredients",
      article: "articles",
      tool: "tools",
    };
    const folder = folderMap[type] || "misc";

    const { url, publicId } = await uploadToCloudinary(
      imageBase64,
      folder,
      slug,
    );

    console.log(`OGP uploaded: ${url}`);

    return NextResponse.json({
      success: true,
      ogImage: {
        url,
        publicId,
        type,
        slug,
        width: OGP_SIZE.width,
        height: OGP_SIZE.height,
      },
    });
  } catch (error) {
    console.error("OGP generation error:", error);
    const errorMessage = (error as Error).message;

    if (errorMessage.includes("overloaded") || errorMessage.includes("503")) {
      return NextResponse.json(
        {
          success: false,
          error: "Model overloaded. Please try again in 30-60 seconds.",
          retryable: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

// 一括生成用エンドポイント（GET: ステータス確認用）
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/og/generate",
    methods: ["POST"],
    description: "Generate OGP images for ingredients, articles, and tools",
    requiredFields: ["type", "slug", "name"],
    optionalFields: ["nameEn", "category", "description", "style"],
    types: ["ingredient", "article", "tool"],
    styles: Object.keys(OGP_STYLES),
    outputSize: OGP_SIZE,
  });
}
