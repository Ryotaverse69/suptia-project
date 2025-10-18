/**
 * Sanity一括インポートツールの型定義
 */

export type ImportMode = 'upsert' | 'create' | 'update';

export type DiffStatus = 'unchanged' | 'modified' | 'new' | 'deleted';

export interface Config {
  sanity: {
    projectId: string;
    dataset: string;
    apiVersion: string;
  };
  import: {
    articleDir: string;
    filePattern: string;
    dryRun: boolean;
    batchSize: number;
    retryCount: number;
    successThreshold: number;
  };
  backup: {
    enabled: boolean;
    s3Bucket?: string;
    s3Region?: string;
    retentionDays: number;
  };
  logging: {
    dir: string;
    format: 'json' | 'pretty';
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  security: {
    tokenEnvVar: string;
    minPermissions: string[];
    encryptBackups: boolean;
  };
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  grade: string;
  issues: {
    critical: number;
    warnings: number;
  };
  report?: any;
}

export interface DiffResult {
  status: DiffStatus;
  slug: string;
  changes: FieldChange[];
  oldDoc?: any;
  newDoc: any;
}

export interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'modified';
}

export interface BackupResult {
  backupFilePath: string;
  s3Url?: string;
  sha256: string;
  timestamp: string;
  size: number;
}

export interface ImportResult {
  file: string;
  slug: string;
  status: 'success' | 'failed' | 'skipped';
  action: 'created' | 'updated' | 'skipped';
  documentId?: string;
  error?: string;
  retries: number;
  duration: number;
}

export interface JobLog {
  jobId: string;
  startTime: string;
  endTime?: string;
  mode: ImportMode;
  dryRun: boolean;
  totalFiles: number;
  results: ImportResult[];
  backup?: BackupResult;
  stats: {
    success: number;
    failed: number;
    skipped: number;
    created: number;
    updated: number;
  };
  successRate: number;
  duration?: number;
  error?: string;
}

export interface ArticleDocument {
  _id?: string;
  _type: string;
  name: string;
  nameEn: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  category: string;
  description: string;
  benefits: string[];
  recommendedDosage: string;
  sideEffects: string;
  interactions: string[];
  foodSources: string[];
  evidenceLevel: string;
  faqs: FAQ[];
  references: Reference[];
  [key: string]: any;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Reference {
  title: string;
  url: string;
  type?: string;
}
