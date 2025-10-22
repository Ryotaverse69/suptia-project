import { checkCompliance } from './compliance';

export function validateImprovedArticle(article: any): {
  score: number;
  grade: string;
  improvements: string[];
  issues: string[];
} {
  let score = 0;
  const improvements = [];
  const issues = [];

  // 1. 構造チェック（25点）
  let structureScore = 25;
  const requiredFields = ['name', 'nameEn', 'description', 'benefits', 'recommendedDosage', 'faqs', 'references'];

  for (const field of requiredFields) {
    if (!article[field]) {
      structureScore -= 3;
      issues.push(`Missing field: ${field}`);
    }
  }

  if (Array.isArray(article.benefits) && article.benefits.length >= 10) {
    improvements.push('Benefits: 10項目以上');
  } else if (Array.isArray(article.benefits)) {
    structureScore -= 5;
    issues.push(`Benefits: ${article.benefits.length}項目（10項目以上推奨）`);
  }

  if (Array.isArray(article.faqs) && article.faqs.length >= 5) {
    improvements.push('FAQs: 5項目以上');
  } else if (Array.isArray(article.faqs)) {
    structureScore -= 5;
    issues.push(`FAQs: ${article.faqs.length}項目（5項目以上推奨）`);
  }

  score += Math.max(0, structureScore);

  // 2. 薬機法コンプライアンス（30点）
  let complianceScore = 30;
  const textsToCheck = [
    article.description,
    ...(article.benefits || []),
    article.recommendedDosage,
    article.scientificBackground,
    article.interactions,
    ...(article.faqs || []).map((f: any) => f.answer)
  ].filter(t => t);

  let violations = 0;
  for (const text of textsToCheck) {
    if (typeof text === 'string') {
      const check = checkCompliance(text);
      if (!check.isCompliant) {
        violations += check.violations.filter(v => v.includes('Critical')).length * 5;
        violations += check.violations.filter(v => v.includes('Warning')).length * 2;
      }
    }
  }

  complianceScore = Math.max(0, complianceScore - violations);
  if (violations === 0) {
    improvements.push('薬機法完全準拠');
  } else {
    issues.push(`薬機法違反の可能性: ${violations}件`);
  }

  score += complianceScore;

  // 3. 文字数チェック（20点）
  let wordCountScore = 20;

  if (article.description && article.description.length >= 500) {
    wordCountScore += 0;
    improvements.push('Description: 500文字以上');
  } else {
    wordCountScore -= 5;
    issues.push('Description: 500文字未満');
  }

  if (article.recommendedDosage && article.recommendedDosage.length >= 400) {
    improvements.push('推奨摂取量: 400文字以上');
  } else {
    wordCountScore -= 5;
    issues.push('推奨摂取量: 400文字未満');
  }

  // FAQ文字数
  if (Array.isArray(article.faqs)) {
    const shortFAQs = article.faqs.filter((f: any) => f.answer && f.answer.length < 200).length;
    if (shortFAQs === 0) {
      improvements.push('全FAQ: 200文字以上');
    } else {
      wordCountScore -= shortFAQs * 2;
      issues.push(`短いFAQ: ${shortFAQs}件`);
    }
  }

  score += Math.max(0, wordCountScore);

  // 4. 参考文献（15点）
  let referenceScore = 0;
  if (Array.isArray(article.references)) {
    if (article.references.length >= 10) {
      referenceScore = 15;
      improvements.push('参考文献: 10件以上');
    } else if (article.references.length >= 5) {
      referenceScore = 10;
      improvements.push('参考文献: 5件以上');
    } else {
      referenceScore = 5;
      issues.push(`参考文献: ${article.references.length}件（10件以上推奨）`);
    }
  }

  score += referenceScore;

  // 5. エビデンスレベル（5点）
  if (article.evidenceLevel && ['S', 'A', 'B'].includes(article.evidenceLevel)) {
    score += 5;
    improvements.push(`エビデンスレベル: ${article.evidenceLevel}`);
  } else {
    issues.push('エビデンスレベル: 低い');
  }

  // 6. SEO対策（5点）
  if (article.seoTitle && article.seoDescription && article.seoKeywords) {
    score += 5;
    improvements.push('SEOメタデータ: 完備');
  } else {
    issues.push('SEOメタデータ: 不完全');
  }

  // グレード判定
  let grade = 'D';
  if (score >= 90) grade = 'S';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';

  return {
    score,
    grade,
    improvements,
    issues
  };
}