// パッチ：主要な5つのルールのみ活用形対応版

export const CRITICAL_RULES_PATCH = [
  {
    pattern: "治[るりますまれすいた]|治療|治癒|完治",
    category: "disease_treatment" as const,
    severity: "critical" as const,
    suggest: "健康維持をサポート",
    description: "疾病の治療効果を標榜する表現は薬機法違反です",
  },
  {
    pattern: "糖尿病[にをがで]",
    category: "disease_treatment" as const,
    severity: "critical" as const,
    suggest: "血糖値の健康維持に",
    description: "糖尿病に関する効能効果は使用不可",
  },
  {
    pattern: "がん[にをがで]|癌[にをがで]|ガン[にをがで]",
    category: "disease_treatment" as const,
    severity: "critical" as const,
    suggest: "健康維持に",
    description: "がんに関する効能効果は絶対に使用不可",
  },
  {
    pattern: "予防[するされしますした]|防[ぐぎぐますぐまぐれた]",
    category: "disease_treatment" as const,
    severity: "critical" as const,
    suggest: "〜のリスクに配慮",
    description: "疾病の予防効果を標榜する表現は薬機法違反です",
  },
  {
    pattern: "改善[するされしますした]",
    category: "disease_treatment" as const,
    severity: "high" as const,
    suggest: "サポートする可能性",
    description: "断定的な改善効果の標榜は避けるべきです",
  },
  {
    pattern:
      "シミ[がを]消[えすしるられますまれた]|シワ[がを]消[えすしるられますまれた]|シワがなく[なるなりますなれた]",
    category: "medical_effect" as const,
    severity: "critical" as const,
    suggest: "肌の健康維持をサポート",
    description: "美容効果を断定する表現は使用不可",
  },
  {
    pattern: "若返[るりますまれた]",
    category: "medical_effect" as const,
    severity: "high" as const,
    suggest: "年齢に応じた健康維持に",
    description: "若返り効果を標榜する表現は避けるべきです",
  },
];
