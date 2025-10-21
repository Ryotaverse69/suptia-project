/**
 * Schema.org バリデーター
 */

import {
  StructuredData,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SchemaType,
} from '../types';
import {
  getRequiredFields,
  getRecommendedFields,
  getSchemaDefinition,
} from '../schemas/schema-definitions';

/**
 * 構造化データを検証
 */
export const validateStructuredData = (
  data: StructuredData,
  path?: string
): ValidationResult => {
  const schemaType = data['@type'] as SchemaType;
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // @context と @type のチェック
  if (!data['@context']) {
    errors.push({
      schemaType,
      field: '@context',
      message: '@context が存在しません',
      severity: 'error',
      suggestion: '"@context": "https://schema.org" を追加してください',
      path,
    });
  } else if (!data['@context'].includes('schema.org')) {
    errors.push({
      schemaType,
      field: '@context',
      message: '@context が schema.org を参照していません',
      severity: 'error',
      suggestion: '"@context": "https://schema.org" に修正してください',
      path,
    });
  }

  if (!data['@type']) {
    errors.push({
      schemaType,
      field: '@type',
      message: '@type が存在しません',
      severity: 'error',
      suggestion: 'スキーマタイプ（Product, Article など）を指定してください',
      path,
    });
    // @typeがないと以降の検証ができないため、ここで終了
    return {
      schemaType,
      data,
      errors,
      warnings,
      score: 0,
      passed: false,
      path,
    };
  }

  // 必須フィールドのチェック
  const requiredFields = getRequiredFields(schemaType);
  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push({
        schemaType,
        field,
        message: `必須フィールド "${field}" が存在しません`,
        severity: 'error',
        suggestion: getFieldSuggestion(schemaType, field),
        path,
      });
    } else {
      // 値の検証
      const fieldError = validateFieldValue(schemaType, field, data[field], path);
      if (fieldError) {
        errors.push(fieldError);
      }
    }
  });

  // 推奨フィールドのチェック
  const recommendedFields = getRecommendedFields(schemaType);
  recommendedFields.forEach((field) => {
    if (!data[field]) {
      warnings.push({
        schemaType,
        field,
        message: `推奨フィールド "${field}" が存在しません`,
        severity: 'warning',
        suggestion: getFieldSuggestion(schemaType, field),
        path,
      });
    }
  });

  // スコア計算
  const score = calculateScore(schemaType, data, errors.length, warnings.length);
  const passed = score >= 70 && errors.length === 0;

  return {
    schemaType,
    data,
    errors,
    warnings,
    score,
    passed,
    path,
  };
};

/**
 * フィールド値を検証
 */
const validateFieldValue = (
  schemaType: SchemaType,
  field: string,
  value: any,
  path?: string
): ValidationError | null => {
  const schema = getSchemaDefinition(schemaType);
  if (!schema || !schema.properties || !schema.properties[field]) {
    return null;
  }

  const property = schema.properties[field];

  // 型チェック
  if (property.type) {
    const expectedTypes = Array.isArray(property.type) ? property.type : [property.type];
    const actualType = Array.isArray(value) ? 'array' : typeof value;

    if (!expectedTypes.includes(actualType)) {
      return {
        schemaType,
        field,
        message: `フィールド "${field}" の型が不正です（期待: ${expectedTypes.join(' or ')}、実際: ${actualType}）`,
        severity: 'error',
        suggestion: `${field} の値を ${expectedTypes[0]} 型に修正してください`,
        path,
      };
    }
  }

  // 文字列の長さチェック（description, headline など）
  if (field === 'description' && typeof value === 'string' && value.length < 50) {
    return {
      schemaType,
      field,
      message: `フィールド "${field}" が短すぎます（${value.length}文字）`,
      severity: 'error',
      suggestion: '50文字以上の詳細な説明を記載してください',
      path,
    };
  }

  // 画像URLチェック
  if (field === 'image') {
    const images = Array.isArray(value) ? value : [value];
    const invalidImages = images.filter((img: any) => {
      return typeof img !== 'string' || !img.startsWith('http');
    });

    if (invalidImages.length > 0) {
      return {
        schemaType,
        field,
        message: `フィールド "${field}" に無効なURLが含まれています`,
        severity: 'error',
        suggestion: '画像URLは https:// で始まる完全なURLを指定してください',
        path,
      };
    }
  }

  return null;
};

/**
 * フィールドの修正提案を生成
 */
const getFieldSuggestion = (schemaType: SchemaType, field: string): string => {
  const schema = getSchemaDefinition(schemaType);
  if (!schema || !schema.properties || !schema.properties[field]) {
    return `${field} フィールドを追加してください`;
  }

  const property = schema.properties[field];
  return `${property.description || field} を追加してください。例: ${JSON.stringify(property.example || '')}`;
};

/**
 * スコアを計算（0-100点）
 */
const calculateScore = (
  schemaType: SchemaType,
  data: StructuredData,
  errorCount: number,
  warningCount: number
): number => {
  let score = 100;

  // 必須フィールドスコア（50点）
  const requiredFields = getRequiredFields(schemaType);
  const missingRequired = requiredFields.filter((field) => !data[field]).length;
  const requiredScore = requiredFields.length > 0
    ? ((requiredFields.length - missingRequired) / requiredFields.length) * 50
    : 50;

  // 推奨フィールドスコア（30点）
  const recommendedFields = getRecommendedFields(schemaType);
  const missingRecommended = recommendedFields.filter((field) => !data[field]).length;
  const recommendedScore = recommendedFields.length > 0
    ? ((recommendedFields.length - missingRecommended) / recommendedFields.length) * 30
    : 30;

  // スキーマ準拠スコア（20点）
  const complianceScore = errorCount === 0 ? 20 : Math.max(0, 20 - errorCount * 5);

  score = requiredScore + recommendedScore + complianceScore;

  return Math.max(0, Math.min(100, score));
};
