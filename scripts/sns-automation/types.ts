// SNS自動投稿システム 型定義

export interface PostContent {
  text: string;
  platform: 'x' | 'threads' | 'instagram';
}

export interface GeneratedPosts {
  x: string;
  threads: string;
  instagram: string;
}

export interface IngredientData {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  benefits: string[];
  recommendedDosage: string;
  evidenceLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  slug: { current: string };
}

export interface ProductData {
  _id: string;
  name: string;
  brand: { name: string };
  ingredients: Array<{
    ingredient: { name: string };
    amountMgPerServing: number;
  }>;
  prices: Array<{
    source: string;
    amount: number;
    url: string;
  }>;
  slug: { current: string };
}

export interface PostResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
}

export interface OAuthParams {
  oauth_consumer_key: string;
  oauth_token: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_nonce: string;
  oauth_version: string;
  oauth_signature?: string;
}
