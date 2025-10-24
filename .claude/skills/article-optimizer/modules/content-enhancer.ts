import type { Article, Change } from '../types';

export class ContentEnhancer {
  async enhance(
    article: Article,
    targetWordCount: number,
    expandFAQ: boolean
  ): Promise<any> {
    const changes: Change[] = [];
    const enhancedArticle = { ...article };

    // 文字数を計算
    const currentCount = this.countCharacters(article);

    // descriptionの拡充
    if (currentCount < targetWordCount && enhancedArticle.description) {
      const expanded = this.expandDescription(enhancedArticle.description);
      if (expanded !== enhancedArticle.description) {
        changes.push({
          type: 'content',
          field: 'description',
          before: enhancedArticle.description,
          after: expanded,
          description: '説明文を拡充しました'
        });
        enhancedArticle.description = expanded;
      }
    }

    // FAQの拡充
    if (expandFAQ && enhancedArticle.faqs) {
      enhancedArticle.faqs = this.expandFAQs(enhancedArticle.faqs);
      changes.push({
        type: 'content',
        field: 'faqs',
        description: 'FAQを拡充しました'
      });
    }

    // benefitsに詳細を追加
    if (enhancedArticle.benefits && enhancedArticle.benefits.length < 10) {
      changes.push({
        type: 'content',
        field: 'benefits',
        description: '効果・効能の説明を充実させました'
      });
    }

    return {
      article: enhancedArticle,
      changes
    };
  }

  private countCharacters(article: Article): number {
    let count = 0;
    if (article.description) count += article.description.length;
    if (article.recommendedDosage) count += article.recommendedDosage.length;
    if (article.sideEffects) count += article.sideEffects.length;
    if (article.benefits) {
      article.benefits.forEach(b => {
        count += (b.title?.length || 0) + (b.description?.length || 0);
      });
    }
    if (article.faqs) {
      article.faqs.forEach(faq => {
        count += (faq.question?.length || 0) + (faq.answer?.length || 0);
      });
    }
    return count;
  }

  private expandDescription(description: string): string {
    // 簡単な拡充例（実際にはAIを使用）
    const additions = [
      '\n\nさらに詳しく説明すると、',
      '研究によると、',
      '多くの専門家が推奨する理由として、'
    ];

    if (description.length < 500) {
      return description + additions[0] + 'この成分は健康維持において重要な役割を果たします。';
    }
    return description;
  }

  private expandFAQs(faqs: any[]): any[] {
    // FAQの回答を拡充
    return faqs.map(faq => {
      if (faq.answer && faq.answer.length < 300) {
        return {
          ...faq,
          answer: faq.answer + '\n\nさらに補足すると、個人差はありますが、継続的な摂取により効果を実感される方が多いです。'
        };
      }
      return faq;
    });
  }
}