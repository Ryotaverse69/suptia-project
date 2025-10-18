/**
 * 文字数拡張ツール
 * GPT APIを使用して文字数不足のフィールドを自動補完
 */

/**
 * 文字数カウント（日本語文字数）
 */
const countChars = (text: string): number => {
  if (!text) return 0;
  const matches = text.match(/\p{L}/gu);
  return matches ? matches.length : 0;
};

/**
 * フィールドごとの目標文字数
 */
const TARGET_LENGTHS: Record<string, { min: number; max: number }> = {
  description: { min: 500, max: 800 },
  recommendedDosage: { min: 500, max: 800 },
  sideEffects: { min: 300, max: 500 },
  'faqs.answer': { min: 500, max: 1000 },
};

/**
 * Claude/GPT用のプロンプト生成
 */
const generateExpansionPrompt = (
  fieldName: string,
  currentText: string,
  targetMin: number,
  targetMax: number,
  context: any
): string => {
  const ingredientName = context.name || '成分';

  const prompts: Record<string, string> = {
    description: `
以下は「${ingredientName}」の説明文です。現在${countChars(currentText)}文字ですが、${targetMin}〜${targetMax}文字に拡張してください。

【現在の説明文】
${currentText}

【拡張の指示】
- 科学的な正確性を保つこと
- 薬機法に違反しない表現を使用（「治る」「予防」「効く」などNG）
- 「〜をサポート」「〜に役立つ可能性」などの表現を使用
- 具体的な研究結果や栄養学的な背景を追加
- 自然な日本語で読みやすく

【拡張後の説明文を出力してください】
`,

    recommendedDosage: `
以下は「${ingredientName}」の推奨摂取量に関する説明です。現在${countChars(currentText)}文字ですが、${targetMin}〜${targetMax}文字に拡張してください。

【現在の説明】
${currentText}

【拡張の指示】
- 一般的な推奨量の詳細
- 目的別の摂取量（例：免疫強化、美肌、運動後回復）
- 摂取タイミング（朝・昼・夜、食前・食後）
- 他の栄養素との組み合わせ
- 厚生労働省の推奨量があれば引用
- 過剰摂取のリスクについても言及

【拡張後の説明文を出力してください】
`,

    sideEffects: `
以下は「${ingredientName}」の副作用・注意事項に関する説明です。現在${countChars(currentText)}文字ですが、${targetMin}〜${targetMax}文字に拡張してください。

【現在の説明】
${currentText}

【拡張の指示】
- 一般的な副作用の詳細
- 特定の人（妊婦、授乳婦、病気治療中の方）への注意
- 過剰摂取時の症状
- アレルギーの可能性
- 安全に摂取するためのアドバイス

【拡張後の説明文を出力してください】
`,

    'faqs.answer': `
以下は「${ingredientName}」に関するFAQの回答です。現在${countChars(currentText)}文字ですが、${targetMin}〜${targetMax}文字に拡張してください。

【現在の回答】
${currentText}

【拡張の指示】
- より詳細で実用的な情報を追加
- 具体例を含める
- 科学的根拠を示す
- 読者が次にとるべきアクションを提案
- 薬機法に違反しない表現を使用

【拡張後の回答を出力してください】
`,
  };

  return prompts[fieldName] || prompts['description'];
};

/**
 * 文字数拡張が必要かチェック
 */
export const needsExpansion = (fieldName: string, text: string): boolean => {
  const target = TARGET_LENGTHS[fieldName];
  if (!target) return false;

  const currentLength = countChars(text);
  return currentLength < target.min;
};

/**
 * GPT/Claude APIで文字数を拡張
 * 注: 実際のAPI呼び出しは実装時に追加
 */
export const expandContent = async (
  fieldName: string,
  currentText: string,
  context: any,
  apiKey?: string
): Promise<string> => {
  const target = TARGET_LENGTHS[fieldName];
  if (!target) return currentText;

  const currentLength = countChars(currentText);
  if (currentLength >= target.min) {
    return currentText; // すでに十分な文字数
  }

  // GPT/Claude API呼び出し（プレースホルダー）
  // 実際の実装ではここでAPI呼び出しを行う
  console.log(`[content-expander] ${fieldName}: ${currentLength}文字 → ${target.min}〜${target.max}文字に拡張が必要`);

  // TODO: 実際のAPI統合
  // const prompt = generateExpansionPrompt(fieldName, currentText, target.min, target.max, context);
  // const expandedText = await callGPTAPI(prompt, apiKey);
  // return expandedText;

  return currentText; // 一旦現在のテキストを返す
};

/**
 * 記事全体の文字数拡張
 */
export const expandArticleContent = async (data: any, apiKey?: string): Promise<any> => {
  const expanded = { ...data };

  // description拡張
  if (needsExpansion('description', expanded.description)) {
    console.log(`📝 description拡張が必要: ${countChars(expanded.description)}文字`);
    expanded.description = await expandContent('description', expanded.description, data, apiKey);
  }

  // recommendedDosage拡張
  if (needsExpansion('recommendedDosage', expanded.recommendedDosage)) {
    console.log(`📝 recommendedDosage拡張が必要: ${countChars(expanded.recommendedDosage)}文字`);
    expanded.recommendedDosage = await expandContent('recommendedDosage', expanded.recommendedDosage, data, apiKey);
  }

  // sideEffects拡張
  if (needsExpansion('sideEffects', expanded.sideEffects)) {
    console.log(`📝 sideEffects拡張が必要: ${countChars(expanded.sideEffects)}文字`);
    expanded.sideEffects = await expandContent('sideEffects', expanded.sideEffects, data, apiKey);
  }

  // FAQs拡張
  if (expanded.faqs && Array.isArray(expanded.faqs)) {
    for (let i = 0; i < expanded.faqs.length; i++) {
      const faq = expanded.faqs[i];
      if (needsExpansion('faqs.answer', faq.answer)) {
        console.log(`📝 faqs[${i}].answer拡張が必要: ${countChars(faq.answer)}文字`);
        expanded.faqs[i].answer = await expandContent('faqs.answer', faq.answer, data, apiKey);
      }
    }
  }

  return expanded;
};

/**
 * プロンプトを取得（手動拡張用）
 */
export const getExpansionPrompt = (fieldName: string, currentText: string, context: any): string => {
  const target = TARGET_LENGTHS[fieldName];
  if (!target) return '';

  return generateExpansionPrompt(fieldName, currentText, target.min, target.max, context);
};
