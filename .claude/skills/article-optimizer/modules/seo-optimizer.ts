import type { Article, Change } from '../types';

export class SEOOptimizer {
  async optimize(article: Article): Promise<any> {
    const changes: Change[] = [];
    const optimizedArticle = { ...article };

    // メタディスクリプションの生成
    if (!optimizedArticle.metaDescription) {
      optimizedArticle.metaDescription = this.generateMetaDescription(article);
      changes.push({
        type: 'seo',
        field: 'metaDescription',
        after: optimizedArticle.metaDescription,
        description: 'メタディスクリプションを生成しました'
      });
    }

    // キーワードの抽出と設定
    if (!optimizedArticle.keywords || optimizedArticle.keywords.length === 0) {
      optimizedArticle.keywords = this.extractKeywords(article);
      changes.push({
        type: 'seo',
        field: 'keywords',
        after: optimizedArticle.keywords,
        description: 'SEOキーワードを設定しました'
      });
    }

    // slugの最適化
    if (article.name && !article.slug) {
      optimizedArticle.slug = this.generateSlug(article.name);
      changes.push({
        type: 'seo',
        field: 'slug',
        after: optimizedArticle.slug,
        description: 'URLスラッグを生成しました'
      });
    }

    return {
      article: optimizedArticle,
      changes
    };
  }

  private generateMetaDescription(article: Article): string {
    const base = article.description || '';
    const truncated = base.substring(0, 120);
    return `${truncated}... ${article.name}の効果、摂取量、副作用について詳しく解説。`;
  }

  private extractKeywords(article: Article): string[] {
    const keywords: string[] = [];

    if (article.name) {
      keywords.push(article.name);
    }
    if (article.nameEn) {
      keywords.push(article.nameEn);
    }
    if (article.category) {
      keywords.push(article.category);
    }

    // 一般的なキーワードを追加
    keywords.push('サプリメント', '健康食品', '栄養補助食品');

    return keywords;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}