/**
 * Sanity CMSクライアント共通設定
 * 全SkillsでSanityとの通信に使用
 */

import { createClient, type SanityClient, type ClientConfig } from '@sanity/client';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// 環境変数の読み込み（.envファイル検索）
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../.env.local')
];

for (const envPath of envPaths) {
  dotenvConfig({ path: envPath });
}

// Sanity設定
export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token?: string;
  useCdn: boolean;
  perspective?: 'published' | 'previewDrafts';
}

// デフォルト設定
export const DEFAULT_SANITY_CONFIG: SanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Skillsではリアルタイムデータが重要なのでCDNは使わない
  perspective: 'published'
};

/**
 * Sanityクライアントのシングルトンインスタンス
 */
class SanityClientManager {
  private static instance: SanityClientManager;
  private client: SanityClient | null = null;
  private config: SanityConfig;

  private constructor() {
    this.config = DEFAULT_SANITY_CONFIG;
    this.validateConfig();
  }

  static getInstance(): SanityClientManager {
    if (!SanityClientManager.instance) {
      SanityClientManager.instance = new SanityClientManager();
    }
    return SanityClientManager.instance;
  }

  /**
   * Sanityクライアントを取得
   */
  getClient(customConfig?: Partial<SanityConfig>): SanityClient {
    if (!this.client || customConfig) {
      const config = { ...this.config, ...customConfig };

      const clientConfig: ClientConfig = {
        projectId: config.projectId,
        dataset: config.dataset,
        apiVersion: config.apiVersion,
        useCdn: config.useCdn,
        token: config.token,
        perspective: config.perspective
      };

      this.client = createClient(clientConfig);
    }

    return this.client;
  }

  /**
   * 設定の検証
   */
  private validateConfig(): void {
    const errors: string[] = [];

    if (!this.config.projectId) {
      errors.push('SANITY_PROJECT_ID が設定されていません');
    }

    if (!this.config.dataset) {
      errors.push('SANITY_DATASET が設定されていません');
    }

    if (errors.length > 0) {
      console.warn('⚠️ Sanity設定の警告:');
      errors.forEach(error => console.warn(`  - ${error}`));
      console.warn('\n環境変数を確認してください。');
    }
  }

  /**
   * データセットのエクスポート
   */
  async exportDataset(outputPath?: string): Promise<string> {
    const client = this.getClient();
    const query = '*[!(_id in path("_.**"))]';

    try {
      const documents = await client.fetch(query);
      const ndjson = documents.map((doc: any) => JSON.stringify(doc)).join('\n');

      if (outputPath) {
        const fs = await import('fs/promises');
        await fs.writeFile(outputPath, ndjson);
        return outputPath;
      }

      return ndjson;
    } catch (error) {
      throw new Error(`データセットのエクスポートに失敗: ${error.message}`);
    }
  }

  /**
   * ドキュメントの一括インポート
   */
  async importDocuments(documents: any[]): Promise<ImportResult> {
    const client = this.getClient();
    const results: ImportResult = {
      success: [],
      failed: [],
      total: documents.length
    };

    for (const doc of documents) {
      try {
        const result = await client.createOrReplace(doc);
        results.success.push({
          id: result._id,
          type: result._type
        });
      } catch (error) {
        results.failed.push({
          document: doc,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * ドキュメントの取得
   */
  async fetchDocument(id: string): Promise<any> {
    const client = this.getClient();
    return await client.getDocument(id);
  }

  /**
   * クエリの実行
   */
  async query<T = any>(groq: string, params?: Record<string, any>): Promise<T> {
    const client = this.getClient();
    return await client.fetch<T>(groq, params || {});
  }

  /**
   * ドキュメントの更新
   */
  async updateDocument(id: string, patches: any): Promise<any> {
    const client = this.getClient();
    return await client.patch(id).set(patches).commit();
  }

  /**
   * ドキュメントの削除
   */
  async deleteDocument(id: string): Promise<void> {
    const client = this.getClient();
    await client.delete(id);
  }

  /**
   * トランザクションの実行
   */
  async transaction(operations: TransactionOperation[]): Promise<any> {
    const client = this.getClient();
    const transaction = client.transaction();

    for (const op of operations) {
      switch (op.type) {
        case 'create':
          transaction.create(op.document);
          break;
        case 'createOrReplace':
          transaction.createOrReplace(op.document);
          break;
        case 'patch':
          transaction.patch(op.id, op.patches);
          break;
        case 'delete':
          transaction.delete(op.id);
          break;
      }
    }

    return await transaction.commit();
  }
}

// 型定義
export interface ImportResult {
  success: Array<{ id: string; type: string }>;
  failed: Array<{ document: any; error: string }>;
  total: number;
}

export interface TransactionOperation {
  type: 'create' | 'createOrReplace' | 'patch' | 'delete';
  id?: string;
  document?: any;
  patches?: any;
}

// クエリヘルパー
export class QueryBuilder {
  private conditions: string[] = [];
  private projections: string[] = [];
  private orderBy: string[] = [];
  private limitValue?: number;
  private offsetValue?: number;

  /**
   * ドキュメントタイプを指定
   */
  type(type: string): this {
    this.conditions.push(`_type == "${type}"`);
    return this;
  }

  /**
   * 条件を追加
   */
  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  /**
   * プロジェクション（返すフィールド）を指定
   */
  select(...fields: string[]): this {
    this.projections.push(...fields);
    return this;
  }

  /**
   * ソート順を指定
   */
  order(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.orderBy.push(`${field} ${direction}`);
    return this;
  }

  /**
   * 取得件数を制限
   */
  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  /**
   * オフセットを指定
   */
  offset(count: number): this {
    this.offsetValue = count;
    return this;
  }

  /**
   * クエリ文字列を生成
   */
  build(): string {
    let query = '*';

    // 条件
    if (this.conditions.length > 0) {
      query += `[${this.conditions.join(' && ')}]`;
    }

    // ソート
    if (this.orderBy.length > 0) {
      query += ` | order(${this.orderBy.join(', ')})`;
    }

    // リミット・オフセット
    if (this.offsetValue !== undefined && this.limitValue !== undefined) {
      query += `[${this.offsetValue}...${this.offsetValue + this.limitValue}]`;
    } else if (this.limitValue !== undefined) {
      query += `[0...${this.limitValue}]`;
    }

    // プロジェクション
    if (this.projections.length > 0) {
      query += ` { ${this.projections.join(', ')} }`;
    }

    return query;
  }
}

// 便利な関数
export async function fetchIngredients(limit?: number): Promise<any[]> {
  const manager = SanityClientManager.getInstance();
  const query = new QueryBuilder()
    .type('ingredient')
    .order('name', 'asc')
    .limit(limit || 100)
    .build();

  return await manager.query(query);
}

export async function fetchIngredientBySlug(slug: string): Promise<any> {
  const manager = SanityClientManager.getInstance();
  const query = new QueryBuilder()
    .type('ingredient')
    .where(`slug.current == "${slug}"`)
    .limit(1)
    .build();

  const results = await manager.query(query);
  return results[0] || null;
}

export async function updateIngredient(id: string, data: any): Promise<any> {
  const manager = SanityClientManager.getInstance();
  return await manager.updateDocument(id, data);
}

// エクスポート
export const sanityClient = SanityClientManager.getInstance();
export default sanityClient;