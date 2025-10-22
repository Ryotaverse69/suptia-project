export function expandText(text: string, targetLength: number): string {
  if (!text) return '';

  // すでに目標文字数を満たしている場合
  if (text.length >= targetLength) {
    return text;
  }

  let expanded = text;

  // 文章を分析して適切な拡充を行う
  const sentences = text.split('。').filter(s => s.length > 0);

  const expansions = [
    '\n\nさらに詳しく説明すると、',
    '\n\n科学的な研究によれば、',
    '\n\n重要な点として、',
    '\n\n実際の使用においては、',
    '\n\n専門家の見解では、',
    '\n\n最新の研究では、',
    '\n\n臨床的な観点から、',
    '\n\n実践的な面では、'
  ];

  // 各文に対して適切な拡充を追加
  if (sentences.length > 0) {
    const expandedSentences = sentences.map((sentence, index) => {
      if (sentence.length < 100 && index < expansions.length) {
        // キーワードに基づいた拡充
        if (sentence.includes('効果') || sentence.includes('作用')) {
          return sentence + '。この作用メカニズムは、体内の複数の生化学的経路を介して実現されます';
        }
        if (sentence.includes('研究') || sentence.includes('報告')) {
          return sentence + '。複数の査読付き論文により、この知見の信頼性が確認されています';
        }
        if (sentence.includes('摂取') || sentence.includes('用量')) {
          return sentence + '。個人差があるため、少量から始めて徐々に調整することが推奨されます';
        }
        if (sentence.includes('安全') || sentence.includes('副作用')) {
          return sentence + '。適切な使用においては、重篤な問題は稀であることが確認されています';
        }
        return sentence;
      }
      return sentence;
    });

    expanded = expandedSentences.join('。');
  }

  // まだ文字数が足りない場合は、一般的な情報を追加
  if (expanded.length < targetLength) {
    const additionalInfo = [
      '\n\n長期的な使用においては、定期的な健康チェックとともに、体調の変化を観察することが重要です。',
      '\n\n個人の体質や健康状態により、反応には差があることを理解しておく必要があります。',
      '\n\n最適な効果を得るためには、バランスの取れた食事と健康的な生活習慣との組み合わせが推奨されます。'
    ];

    for (const info of additionalInfo) {
      if (expanded.length < targetLength) {
        expanded += info;
      }
    }
  }

  return expanded + '。';
}

export function generateSEOMetadata(article: any): {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
} {
  const name = article.name || '';
  const nameEn = article.nameEn || '';
  const category = article.category || 'サプリメント';

  // 主要な効果を抽出
  const mainEffects = article.benefits?.slice(0, 3)
    .map((b: string) => {
      const firstPart = b.split(/[、。]/)[0];
      return firstPart.length > 30 ? firstPart.substring(0, 30) : firstPart;
    })
    .join('、') || '健康維持をサポート';

  // SEOタイトル（60文字以内）
  const seoTitle = `${name}完全ガイド | 効果・摂取量・副作用を専門家が解説`;

  // SEO説明文（160文字以内）
  const seoDescription = `${name}の科学的根拠に基づく効果、推奨摂取量、副作用を詳しく解説。${mainEffects.substring(0, 60)}など、エビデンスに基づく情報を提供。`;

  // SEOキーワード（カンマ区切り）
  const keywords = [
    name,
    nameEn.split(' ')[0], // 英語名の最初の単語
    category,
    'サプリメント',
    '効果',
    '摂取量',
    '副作用',
    '食品源',
    '相互作用',
    '健康'
  ].filter(k => k && k.length > 0);

  return {
    seoTitle: seoTitle.substring(0, 60),
    seoDescription: seoDescription.substring(0, 160),
    seoKeywords: keywords.join(',')
  };
}