// 記事最適化の型定義

export interface OptimizationOptions {
  mode: 'check' | 'fix' | 'enhance' | 'full';
  targetWordCount: number;
  autoGenerateLinks: boolean;
  expandFAQ: boolean;
  addSchema: boolean;
  complianceLevel: 'strict' | 'standard' | 'lenient';
  backup: boolean;
  output?: string;
}

export interface OptimizationResult {
  file: string;
  originalScore: number;
  optimizedScore: number;
  changes: Change[];
  warnings: Warning[];
  errors: string[];
  backup: string | null;
  duration: number;
}

export interface Change {
  type: 'compliance' | 'content' | 'seo' | 'links' | 'schema';
  field: string;
  before?: any;
  after?: any;
  description: string;
}

export interface Warning {
  type: 'compliance' | 'quality' | 'seo';
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  suggestion?: string;
}

export interface Article {
  name: string;
  nameEn: string;
  slug?: string;
  category: string;
  description: string;
  evidenceLevel: string;
  benefits?: Benefit[];
  recommendedDosage?: string;
  foodSources?: string[];
  sideEffects?: string;
  interactions?: Interaction[];
  faqs?: FAQ[];
  references?: Reference[];
  metaDescription?: string;
  keywords?: string[];
  internalLinks?: InternalLink[];
  schema?: any;
}

export interface Benefit {
  title: string;
  description: string;
  evidence?: string;
}

export interface Interaction {
  substance: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Reference {
  title: string;
  url: string;
  year?: number;
  authors?: string[];
  journal?: string;
}

export interface InternalLink {
  text: string;
  href: string;
  context: string;
}

export interface ComplianceResult {
  article: Article;
  changes: Change[];
  warnings: Warning[];
  errors: string[];
  complianceScore: number;
}

export interface EnhanceResult {
  article: Article;
  changes: Change[];
  addedContent: number;
  totalCharacters: number;
}

export interface SEOResult {
  article: Article;
  changes: Change[];
  seoScore: number;
  suggestions: string[];
}

export interface LinkResult {
  article: Article;
  changes: Change[];
  linksAdded: number;
}

export interface SchemaResult {
  article: Article;
  changes: Change[];
  schemaType: string;
}

export interface BatchReport {
  summary: {
    total: number;
    success: number;
    failed: number;
    averageScoreImprovement: number;
    totalChanges: number;
    totalWarnings: number;
    totalErrors: number;
    duration: number;
  };
  details: OptimizationResult[];
  recommendations: string[];
}