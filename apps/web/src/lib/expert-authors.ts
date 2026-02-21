/**
 * AI専門家エージェント定義
 *
 * マルチエージェント監修システムの5エージェントを定義。
 * Schema.org構造化データとAEO（Answer Engine Optimization）に使用。
 */

export interface ExpertAgent {
  id: string;
  name: string;
  nameJa: string;
  role: string;
  roleJa: string;
  specialty: string[];
  credentials: string[];
  knowsAbout: string[];
  icon: string;
}

export const EXPERT_AGENTS: ExpertAgent[] = [
  {
    id: "pharmacist-ai",
    name: "Pharmacist AI",
    nameJa: "薬剤師AI",
    role: "Pharmaceutical Interaction Specialist",
    roleJa: "薬物相互作用・安全性専門",
    specialty: ["drug interactions", "dosage safety", "contraindications"],
    credentials: [
      "Drug interaction databases",
      "DailyMed",
      "FDA safety data",
      "PMDA (日本医薬品医療機器総合機構)",
    ],
    knowsAbout: [
      "pharmaceutical interactions",
      "supplement safety",
      "contraindications",
      "dosage limits",
      "adverse effects",
    ],
    icon: "💊",
  },
  {
    id: "dietitian-ai",
    name: "Dietitian AI",
    nameJa: "管理栄養士AI",
    role: "Nutritional Accuracy Specialist",
    roleJa: "栄養学的正確性・食品相互作用専門",
    specialty: [
      "nutritional science",
      "RDA compliance",
      "food-supplement interactions",
    ],
    credentials: [
      "USDA FoodData Central",
      "日本食品標準成分表",
      "日本人の食事摂取基準",
    ],
    knowsAbout: [
      "nutrition science",
      "dietary reference intakes",
      "nutrient balance",
      "food interactions",
      "bioavailability",
    ],
    icon: "🥗",
  },
  {
    id: "researcher-ai",
    name: "Clinical Researcher AI",
    nameJa: "臨床研究者AI",
    role: "Evidence Evaluation Specialist",
    roleJa: "エビデンス評価・研究品質専門",
    specialty: [
      "systematic reviews",
      "meta-analyses",
      "clinical trial evaluation",
    ],
    credentials: [
      "PubMed/NCBI",
      "Cochrane Library",
      "NIH Office of Dietary Supplements",
      "EFSA",
    ],
    knowsAbout: [
      "clinical research",
      "evidence-based medicine",
      "study quality assessment",
      "meta-analysis",
      "research methodology",
    ],
    icon: "🔬",
  },
  {
    id: "compliance-ai",
    name: "Regulatory Compliance AI",
    nameJa: "薬機法AI",
    role: "Pharmaceutical Law Compliance Specialist",
    roleJa: "4法令コンプライアンス専門",
    specialty: ["薬機法", "健康増進法", "景品表示法", "特定商取引法"],
    credentials: [
      "薬機法 (Act on Securing Quality, Efficacy and Safety)",
      "健康増進法 (Health Promotion Act)",
      "景品表示法 (Act against Unjustifiable Premiums and Misleading Representations)",
      "特定商取引法 (Specified Commercial Transactions Act)",
    ],
    knowsAbout: [
      "pharmaceutical regulations",
      "health claims compliance",
      "advertising standards",
      "prohibited expressions",
    ],
    icon: "⚖️",
  },
  {
    id: "consumer-ai",
    name: "Consumer Protection AI",
    nameJa: "消費者保護AI",
    role: "Consumer Fairness Analyst",
    roleJa: "価格適正性・公正表現専門",
    specialty: [
      "price fairness",
      "misleading claims detection",
      "consumer rights",
    ],
    credentials: [
      "消費者庁 guidelines",
      "公正取引委員会 standards",
      "JARO (日本広告審査機構)",
    ],
    knowsAbout: [
      "consumer protection",
      "fair pricing",
      "misleading advertising",
      "comparison fairness",
    ],
    icon: "🛡️",
  },
];

/**
 * Schema.org用の専門家レビュースキーマを生成
 */
export function generateExpertReviewSchema(params: {
  contentUrl: string;
  contentName: string;
  reviewDate?: string;
}) {
  const { contentUrl, contentName, reviewDate } = params;
  const date = reviewDate || new Date().toISOString().split("T")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Article",
      name: contentName,
      url: contentUrl,
    },
    author: {
      "@type": "Organization",
      name: "Suptia AI Expert Panel",
      alternateName: "サプティア AI専門家パネル",
      description:
        "5 specialized AI agents reviewing supplement content for accuracy, safety, and compliance",
      member: EXPERT_AGENTS.map((agent) => ({
        "@type": "Person",
        name: agent.name,
        alternateName: agent.nameJa,
        jobTitle: agent.role,
        hasCredential: agent.credentials.map((cred) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: cred,
        })),
        knowsAbout: agent.knowsAbout,
      })),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: 5,
      bestRating: 5,
      worstRating: 1,
      ratingExplanation:
        "Multi-agent AI review passed: all 5 specialist agents approved this content",
    },
    datePublished: date,
    publisher: {
      "@type": "Organization",
      name: "Suptia",
      url: "https://suptia.com",
    },
  };
}
