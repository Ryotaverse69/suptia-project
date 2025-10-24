import type { Article, Change } from '../types';

export class InternalLinker {
  async generateLinks(article: Article): Promise<any> {
    const changes: Change[] = [];
    const linkedArticle = { ...article };

    // 内部リンクの生成
    const internalLinks = this.findLinkOpportunities(article);

    if (!linkedArticle.internalLinks) {
      linkedArticle.internalLinks = [];
    }

    internalLinks.forEach(link => {
      linkedArticle.internalLinks?.push(link);
    });

    if (internalLinks.length > 0) {
      changes.push({
        type: 'links',
        field: 'internalLinks',
        after: linkedArticle.internalLinks,
        description: `${internalLinks.length}件の内部リンクを追加しました`
      });
    }

    return {
      article: linkedArticle,
      changes
    };
  }

  private findLinkOpportunities(article: Article): any[] {
    const links = [];

    // カテゴリに基づくリンク
    if (article.category === 'ビタミン') {
      links.push({
        text: 'ビタミンの総合ガイド',
        href: '/guides/vitamins',
        context: '関連ガイド'
      });
    }

    // 相互作用に基づくリンク
    if (article.interactions) {
      article.interactions.forEach(interaction => {
        links.push({
          text: `${interaction.substance}との相互作用`,
          href: `/ingredients/${this.slugify(interaction.substance)}`,
          context: '相互作用情報'
        });
      });
    }

    return links;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}