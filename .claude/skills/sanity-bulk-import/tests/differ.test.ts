/**
 * differ.tsのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import { diffDocuments, generateDiffSummary, getChangedFields, hasCriticalChanges } from '../src/differ.js';
import type { ArticleDocument } from '../src/types.js';

describe('diffDocuments', () => {
  const baseDoc: ArticleDocument = {
    _type: 'ingredient',
    name: 'ビタミンC',
    nameEn: 'Vitamin C',
    slug: {
      _type: 'slug',
      current: 'vitamin-c',
    },
    category: 'ビタミン',
    description: 'ビタミンCの説明',
    benefits: ['免疫強化', '抗酸化'],
    recommendedDosage: '1日1000mg',
    sideEffects: '特になし',
    interactions: [],
    foodSources: ['レモン', 'オレンジ'],
    evidenceLevel: 'A',
    faqs: [],
    references: [],
  };

  it('新規ドキュメントを検出', () => {
    const result = diffDocuments(null, baseDoc);

    expect(result.status).toBe('new');
    expect(result.slug).toBe('vitamin-c');
    expect(result.changes).toHaveLength(0);
  });

  it('変更なしを検出', () => {
    const result = diffDocuments(baseDoc, baseDoc);

    expect(result.status).toBe('unchanged');
    expect(result.slug).toBe('vitamin-c');
    expect(result.changes).toHaveLength(0);
  });

  it('フィールド変更を検出', () => {
    const modified = {
      ...baseDoc,
      description: '新しい説明',
      benefits: ['免疫強化', '抗酸化', '美肌'],
    };

    const result = diffDocuments(baseDoc, modified);

    expect(result.status).toBe('modified');
    expect(result.changes.length).toBeGreaterThan(0);

    const descChange = result.changes.find((c) => c.field === 'description');
    expect(descChange).toBeDefined();
    expect(descChange?.type).toBe('modified');
    expect(descChange?.oldValue).toBe('ビタミンCの説明');
    expect(descChange?.newValue).toBe('新しい説明');
  });

  it('フィールド追加を検出', () => {
    const modified = {
      ...baseDoc,
      newField: '新しいフィールド',
    };

    const result = diffDocuments(baseDoc, modified);

    expect(result.status).toBe('modified');

    const addedChange = result.changes.find((c) => c.field === 'newField');
    expect(addedChange).toBeDefined();
    expect(addedChange?.type).toBe('added');
  });

  it('フィールド削除を検出', () => {
    const modified = { ...baseDoc };
    delete (modified as any).description;

    const result = diffDocuments(baseDoc, modified);

    expect(result.status).toBe('modified');

    const removedChange = result.changes.find((c) => c.field === 'description');
    expect(removedChange).toBeDefined();
    expect(removedChange?.type).toBe('removed');
  });
});

describe('generateDiffSummary', () => {
  it('新規作成のサマリーを生成', () => {
    const diff = {
      status: 'new' as const,
      slug: 'vitamin-c',
      changes: [],
      newDoc: {},
    };

    const summary = generateDiffSummary(diff);
    expect(summary).toContain('新規作成');
    expect(summary).toContain('vitamin-c');
  });

  it('変更なしのサマリーを生成', () => {
    const diff = {
      status: 'unchanged' as const,
      slug: 'vitamin-c',
      changes: [],
      oldDoc: {},
      newDoc: {},
    };

    const summary = generateDiffSummary(diff);
    expect(summary).toContain('変更なし');
  });

  it('変更ありのサマリーを生成', () => {
    const diff = {
      status: 'modified' as const,
      slug: 'vitamin-c',
      changes: [
        { field: 'name', oldValue: 'A', newValue: 'B', type: 'modified' as const },
        { field: 'desc', oldValue: null, newValue: 'X', type: 'added' as const },
      ],
      oldDoc: {},
      newDoc: {},
    };

    const summary = generateDiffSummary(diff);
    expect(summary).toContain('更新');
    expect(summary).toContain('追加1件');
    expect(summary).toContain('変更1件');
  });
});

describe('getChangedFields', () => {
  it('変更されたフィールド名を取得', () => {
    const diff = {
      status: 'modified' as const,
      slug: 'vitamin-c',
      changes: [
        { field: 'name', oldValue: 'A', newValue: 'B', type: 'modified' as const },
        { field: 'description', oldValue: 'X', newValue: 'Y', type: 'modified' as const },
      ],
      oldDoc: {},
      newDoc: {},
    };

    const fields = getChangedFields(diff);
    expect(fields).toEqual(['name', 'description']);
  });
});

describe('hasCriticalChanges', () => {
  it('重要フィールドの変更を検出', () => {
    const diff = {
      status: 'modified' as const,
      slug: 'vitamin-c',
      changes: [
        { field: 'name', oldValue: 'A', newValue: 'B', type: 'modified' as const },
      ],
      oldDoc: {},
      newDoc: {},
    };

    expect(hasCriticalChanges(diff)).toBe(true);
  });

  it('非重要フィールドの変更は検出しない', () => {
    const diff = {
      status: 'modified' as const,
      slug: 'vitamin-c',
      changes: [
        { field: 'sideEffects', oldValue: 'A', newValue: 'B', type: 'modified' as const },
      ],
      oldDoc: {},
      newDoc: {},
    };

    expect(hasCriticalChanges(diff)).toBe(false);
  });
});
