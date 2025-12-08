// Google AI (Imagen 3) 画像生成モジュール
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IngredientData, ProductData } from './types';

interface ImageGenerationResult {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

// Google AI クライアント取得
function getGoogleAIClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_AI_API_KEY not set');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

// 成分用の画像プロンプトを生成
function createIngredientImagePrompt(ingredient: IngredientData): string {
  const benefits = ingredient.benefits?.slice(0, 3).join(', ') || 'health support';

  return `Create a clean, modern, professional social media image for a supplement ingredient.
Theme: ${ingredient.name} (${ingredient.nameEn || 'supplement ingredient'})
Style: Minimalist, medical/health aesthetic, soft gradients
Elements to include:
- Abstract representation of ${ingredient.nameEn || ingredient.name}
- Soft blue, green, or purple tones (calming, health-related)
- Clean typography space at bottom for text overlay
- No text in the image
- Professional, trustworthy appearance
- Light background
Format: Square (1:1 ratio), Instagram-ready`;
}

// 商品用の画像プロンプトを生成
function createProductImagePrompt(product: ProductData): string {
  const brandName = product.brand?.name || 'supplement brand';

  return `Create a clean, modern, professional social media image for a supplement product.
Theme: ${product.name} by ${brandName}
Style: Minimalist, premium product showcase aesthetic
Elements to include:
- Abstract supplement/vitamin visual elements
- Clean, professional appearance
- Soft gradient background (health-related colors: blue, green, white)
- Space at bottom for text overlay
- No text in the image
- Premium, trustworthy look
Format: Square (1:1 ratio), Instagram-ready`;
}

// Imagen 3 で画像を生成
export async function generateImage(
  content: IngredientData | ProductData,
  type: 'ingredient' | 'product'
): Promise<ImageGenerationResult> {
  const client = getGoogleAIClient();

  if (!client) {
    return {
      success: false,
      error: 'Google AI client not configured',
    };
  }

  try {
    const prompt = type === 'ingredient'
      ? createIngredientImagePrompt(content as IngredientData)
      : createProductImagePrompt(content as ProductData);

    console.log('🎨 画像生成プロンプト:', prompt.slice(0, 100) + '...');

    // Imagen 3 モデルを使用
    const model = client.getGenerativeModel({ model: 'imagen-3.0-generate-002' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Imagen specific config
        responseModalities: ['image'],
        responseMimeType: 'image/png',
      },
    });

    const response = result.response;
    const candidate = response.candidates?.[0];

    if (!candidate?.content?.parts?.[0]) {
      throw new Error('No image generated');
    }

    const part = candidate.content.parts[0];

    // @ts-expect-error - Imagen returns inlineData for images
    if (part.inlineData) {
      // @ts-expect-error
      const { data, mimeType } = part.inlineData;
      return {
        success: true,
        imageBase64: data,
        mimeType: mimeType || 'image/png',
      };
    }

    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 認証情報チェック
export function checkGoogleAICredentials(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY;
}
