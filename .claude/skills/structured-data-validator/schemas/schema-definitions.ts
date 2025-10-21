/**
 * schema.org 定義
 */

import { SchemaDefinition } from '../types';

export const SCHEMA_DEFINITIONS: Record<string, SchemaDefinition> = {
  Product: {
    type: 'Product',
    required: ['name', 'image', 'description'],
    recommended: ['offers', 'aggregateRating', 'brand', 'sku', 'gtin13'],
    properties: {
      name: {
        type: 'string',
        required: true,
        description: '商品名',
        example: 'NOW Foods ビタミンC 1000mg',
      },
      image: {
        type: ['string', 'array'],
        required: true,
        description: '商品画像URL（1枚以上）',
        example: 'https://example.com/image.jpg',
      },
      description: {
        type: 'string',
        required: true,
        description: '商品説明（50文字以上推奨）',
        example: 'NOW Foods社の高品質ビタミンCサプリメント。',
      },
      offers: {
        type: 'object',
        required: false,
        description: '価格情報（Offerオブジェクト）',
        example: {
          '@type': 'Offer',
          price: '1980',
          priceCurrency: 'JPY',
          availability: 'https://schema.org/InStock',
        },
      },
      aggregateRating: {
        type: 'object',
        required: false,
        description: '評価情報（AggregateRatingオブジェクト）',
        example: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '1234',
        },
      },
      brand: {
        type: ['string', 'object'],
        required: false,
        description: 'ブランド名',
        example: 'NOW Foods',
      },
      sku: {
        type: 'string',
        required: false,
        description: '商品管理番号',
        example: 'NOW-VC-1000-250',
      },
      gtin13: {
        type: 'string',
        required: false,
        description: 'JAN/EANコード（13桁）',
        example: '0123456789012',
      },
    },
  },

  BreadcrumbList: {
    type: 'BreadcrumbList',
    required: ['itemListElement'],
    properties: {
      itemListElement: {
        type: 'array',
        required: true,
        description: 'パンくずリストの要素（ListItemオブジェクトの配列）',
        example: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: 'https://example.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '成分ガイド',
            item: 'https://example.com/ingredients',
          },
        ],
      },
    },
  },

  ItemList: {
    type: 'ItemList',
    required: ['itemListElement'],
    recommended: ['numberOfItems'],
    properties: {
      itemListElement: {
        type: 'array',
        required: true,
        description: 'リスト要素（ListItemオブジェクトの配列）',
        example: [
          {
            '@type': 'ListItem',
            position: 1,
            url: 'https://example.com/product-1',
          },
        ],
      },
      numberOfItems: {
        type: 'number',
        required: false,
        description: 'リスト内のアイテム数',
        example: 10,
      },
    },
  },

  Article: {
    type: 'Article',
    required: ['headline', 'datePublished', 'author'],
    recommended: ['image', 'publisher', 'dateModified'],
    properties: {
      headline: {
        type: 'string',
        required: true,
        description: '記事のタイトル',
        example: 'ビタミンCの効果と摂取方法',
      },
      datePublished: {
        type: 'string',
        required: true,
        description: '公開日（ISO 8601形式）',
        example: '2025-10-21T12:00:00+09:00',
      },
      author: {
        type: ['object', 'string'],
        required: true,
        description: '著者情報',
        example: {
          '@type': 'Person',
          name: 'Suptia編集部',
        },
      },
      image: {
        type: ['string', 'array'],
        required: false,
        description: '記事の画像URL',
        example: 'https://example.com/article-image.jpg',
      },
      publisher: {
        type: 'object',
        required: false,
        description: '出版者情報（Organizationオブジェクト）',
        example: {
          '@type': 'Organization',
          name: 'Suptia',
          logo: {
            '@type': 'ImageObject',
            url: 'https://example.com/logo.png',
          },
        },
      },
      dateModified: {
        type: 'string',
        required: false,
        description: '最終更新日（ISO 8601形式）',
        example: '2025-10-21T15:00:00+09:00',
      },
    },
  },

  Organization: {
    type: 'Organization',
    required: ['name'],
    recommended: ['url', 'logo'],
    properties: {
      name: {
        type: 'string',
        required: true,
        description: '組織名',
        example: 'Suptia',
      },
      url: {
        type: 'string',
        required: false,
        description: '組織のURL',
        example: 'https://suptia.com',
      },
      logo: {
        type: ['string', 'object'],
        required: false,
        description: 'ロゴ画像',
        example: {
          '@type': 'ImageObject',
          url: 'https://suptia.com/logo.png',
        },
      },
    },
  },

  WebPage: {
    type: 'WebPage',
    required: ['name', 'url'],
    recommended: ['description', 'breadcrumb'],
    properties: {
      name: {
        type: 'string',
        required: true,
        description: 'ページタイトル',
        example: 'ビタミンC成分ガイド',
      },
      url: {
        type: 'string',
        required: true,
        description: 'ページURL',
        example: 'https://suptia.com/ingredients/vitamin-c',
      },
      description: {
        type: 'string',
        required: false,
        description: 'ページの説明',
        example: 'ビタミンCの効果、推奨摂取量、副作用などを解説',
      },
      breadcrumb: {
        type: 'object',
        required: false,
        description: 'パンくずリスト（BreadcrumbListオブジェクト）',
      },
    },
  },
};

/**
 * 必須フィールドを取得
 */
export const getRequiredFields = (schemaType: string): string[] => {
  const schema = SCHEMA_DEFINITIONS[schemaType];
  return schema ? schema.required : [];
};

/**
 * 推奨フィールドを取得
 */
export const getRecommendedFields = (schemaType: string): string[] => {
  const schema = SCHEMA_DEFINITIONS[schemaType];
  return schema && schema.recommended ? schema.recommended : [];
};

/**
 * スキーマ定義を取得
 */
export const getSchemaDefinition = (schemaType: string): SchemaDefinition | null => {
  return SCHEMA_DEFINITIONS[schemaType] || null;
};
