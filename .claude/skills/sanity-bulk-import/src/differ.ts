/**
 * 差分検出モジュール
 * 既存ドキュメントと新規ドキュメントを比較してDiffResultを生成
 */

import type { DiffResult, DiffStatus, FieldChange, ArticleDocument } from './types.js';

/**
 * 2つのドキュメントを比較して差分を検出
 */
export function diffDocuments(
  existing: ArticleDocument | null,
  incoming: Partial<ArticleDocument>
): DiffResult {
  const slug = incoming.slug?.current || '';

  // 新規ドキュメント
  if (!existing) {
    return {
      status: 'new',
      slug,
      changes: [],
      newDoc: incoming,
    };
  }

  // 削除されたドキュメント（実際には incoming が null の場合だが、この実装では扱わない）
  // deleted は手動削除の場合のみ検出する

  // フィールドごとの変更を検出
  const changes = detectFieldChanges(existing, incoming);

  // 変更がない場合
  if (changes.length === 0) {
    return {
      status: 'unchanged',
      slug,
      changes: [],
      oldDoc: existing,
      newDoc: incoming,
    };
  }

  // 変更あり
  return {
    status: 'modified',
    slug,
    changes,
    oldDoc: existing,
    newDoc: incoming,
  };
}

/**
 * フィールドごとの変更を検出
 */
function detectFieldChanges(
  existing: ArticleDocument,
  incoming: Partial<ArticleDocument>
): FieldChange[] {
  const changes: FieldChange[] = [];
  const allKeys = new Set([
    ...Object.keys(existing),
    ...Object.keys(incoming),
  ]);

  // Sanity内部フィールドは除外
  const excludeFields = ['_id', '_createdAt', '_updatedAt', '_rev', '_type'];

  for (const key of allKeys) {
    if (excludeFields.includes(key)) continue;

    const oldValue = (existing as any)[key];
    const newValue = (incoming as any)[key];

    // 値が同じ場合はスキップ
    if (isEqual(oldValue, newValue)) continue;

    // 追加
    if (oldValue === undefined && newValue !== undefined) {
      changes.push({
        field: key,
        oldValue: null,
        newValue,
        type: 'added',
      });
      continue;
    }

    // 削除
    if (oldValue !== undefined && newValue === undefined) {
      changes.push({
        field: key,
        oldValue,
        newValue: null,
        type: 'removed',
      });
      continue;
    }

    // 変更
    changes.push({
      field: key,
      oldValue,
      newValue,
      type: 'modified',
    });
  }

  return changes;
}

/**
 * 深い等価性チェック
 * シンプルな実装（JSON.stringify比較）
 */
function isEqual(a: any, b: any): boolean {
  // プリミティブ型の比較
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // 配列の比較
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // オブジェクトの比較
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * 差分サマリーを生成（ログ用）
 */
export function generateDiffSummary(diff: DiffResult): string {
  if (diff.status === 'new') {
    return `新規作成: ${diff.slug}`;
  }

  if (diff.status === 'unchanged') {
    return `変更なし: ${diff.slug}`;
  }

  if (diff.status === 'deleted') {
    return `削除検出: ${diff.slug}`;
  }

  // modified
  const addedCount = diff.changes.filter((c) => c.type === 'added').length;
  const removedCount = diff.changes.filter((c) => c.type === 'removed').length;
  const modifiedCount = diff.changes.filter((c) => c.type === 'modified').length;

  const parts: string[] = [];
  if (addedCount > 0) parts.push(`追加${addedCount}件`);
  if (removedCount > 0) parts.push(`削除${removedCount}件`);
  if (modifiedCount > 0) parts.push(`変更${modifiedCount}件`);

  return `更新: ${diff.slug} (${parts.join(', ')})`;
}

/**
 * 変更されたフィールド名の一覧を取得
 */
export function getChangedFields(diff: DiffResult): string[] {
  return diff.changes.map((c) => c.field);
}

/**
 * 重要なフィールドが変更されたかチェック
 */
export function hasCriticalChanges(diff: DiffResult): boolean {
  const criticalFields = ['name', 'slug', 'category', 'description'];
  const changedFields = getChangedFields(diff);

  return changedFields.some((field) => criticalFields.includes(field));
}
