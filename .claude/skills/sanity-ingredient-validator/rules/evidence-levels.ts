/**
 * Suptia独自のエビデンスレベル定義（5段階）
 */

export interface EvidenceLevel {
  level: string;
  description: string;
  examples: string[];
  score: number;
}

export const EVIDENCE_LEVELS: Record<string, EvidenceLevel> = {
  S: {
    level: 'S',
    description: '大規模RCTやメタ解析による高い信頼性',
    examples: ['ビタミンDと骨密度改善', 'オメガ3脂肪酸と心血管疾患リスク'],
    score: 5,
  },
  A: {
    level: 'A',
    description: '良質な研究で効果が確認',
    examples: ['EPA/DHAと中性脂肪低下', 'ビタミンCと免疫機能'],
    score: 4,
  },
  B: {
    level: 'B',
    description: '限定的研究・条件付きの効果',
    examples: ['マグネシウムと睡眠改善', 'プロバイオティクスと腸内環境'],
    score: 3,
  },
  C: {
    level: 'C',
    description: '動物実験・小規模試験レベル',
    examples: ['アスタキサンチンと疲労改善', 'L-カルニチンと運動パフォーマンス'],
    score: 2,
  },
  D: {
    level: 'D',
    description: '理論・未検証レベル',
    examples: ['未確認ハーブ抽出物', '新規成分で研究が不足しているもの'],
    score: 1,
  },
};

export const VALID_EVIDENCE_LEVELS = ['S', 'A', 'B', 'C', 'D'];

/**
 * エビデンスレベルの妥当性チェック
 */
export const validateEvidenceLevel = (level: string) => {
  const valid = VALID_EVIDENCE_LEVELS.includes(level);

  return {
    valid,
    score: valid ? EVIDENCE_LEVELS[level].score : 0,
    description: valid ? EVIDENCE_LEVELS[level].description : '',
    suggestion: valid ? null : 'SからDの範囲に修正してください',
  };
};
