import type { Article, Change } from '../types';

export class SchemaGenerator {
  async generate(article: Article): Promise<any> {
    const changes: Change[] = [];
    const schemaArticle = { ...article };

    // 構造化データの生成
    const schema = this.generateSupplementSchema(article);

    schemaArticle.schema = schema;

    changes.push({
      type: 'schema',
      field: 'schema',
      after: schema,
      description: 'JSON-LD構造化データを生成しました'
    });

    return {
      article: schemaArticle,
      changes
    };
  }

  private generateSupplementSchema(article: Article): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: article.name,
      alternateName: article.nameEn,
      description: article.description,
      category: 'Dietary Supplement',
      keywords: article.keywords?.join(', '),
      manufacturer: {
        '@type': 'Organization',
        name: 'Suptia'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '100'
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'JPY',
        lowPrice: '1000',
        highPrice: '5000',
        offerCount: '10'
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'エビデンスレベル',
          value: article.evidenceLevel
        },
        {
          '@type': 'PropertyValue',
          name: 'カテゴリ',
          value: article.category
        }
      ]
    };
  }
}