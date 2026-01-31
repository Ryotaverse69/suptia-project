/**
 * 商品FAQ生成ユーティリティ
 * サーバーコンポーネントから使用可能
 */

export interface ProductFAQProps {
  productName: string;
  brandName?: string;
  mainIngredient?: string;
  servingsPerDay?: number;
  priceJPY?: number;
  evidenceLevel?: string;
  sideEffects?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * 商品に基づいて動的にFAQを生成
 */
export function generateProductFAQs(props: ProductFAQProps): FAQItem[] {
  const {
    productName,
    brandName,
    mainIngredient,
    servingsPerDay = 1,
    priceJPY,
    evidenceLevel,
    sideEffects,
  } = props;

  const faqs: FAQItem[] = [];

  // 基本的な質問
  faqs.push({
    question: `${productName}の飲み方・摂取タイミングは？`,
    answer: `${productName}は1日${servingsPerDay}回の摂取が推奨されています。食事と一緒に摂取すると吸収率が向上する場合があります。水またはぬるま湯でお召し上がりください。`,
  });

  // 主成分に関する質問
  if (mainIngredient) {
    faqs.push({
      question: `${mainIngredient}にはどんな効果が期待できますか？`,
      answer: `${mainIngredient}はサプリメントの有効成分として広く研究されています。詳しい効果については、当サイトの成分ガイドで科学的エビデンスに基づいた情報をご確認いただけます。`,
    });
  }

  // 安全性に関する質問
  faqs.push({
    question: `${productName}の副作用や注意点はありますか？`,
    answer: sideEffects
      ? `${sideEffects} 妊娠中・授乳中の方、持病のある方、医薬品を服用中の方は、使用前に医師にご相談ください。`
      : `一般的に推奨摂取量を守れば安全とされていますが、体質によっては合わない場合があります。妊娠中・授乳中の方、持病のある方、医薬品を服用中の方は、使用前に医師にご相談ください。`,
  });

  // エビデンスに関する質問
  if (evidenceLevel) {
    const evidenceDescriptions: Record<string, string> = {
      S: "大規模な臨床試験やメタ解析により、高い信頼性で効果が確認されています。",
      A: "良質な研究により効果が確認されており、多くの専門家が推奨しています。",
      B: "限定的な研究で効果が示唆されていますが、さらなる検証が必要です。",
      C: "動物実験や小規模試験のデータがありますが、ヒトでの大規模研究は限られています。",
      D: "理論的な効果は期待されますが、科学的検証は十分ではありません。",
    };
    faqs.push({
      question: `${productName}のエビデンスレベルとは何ですか？`,
      answer: `サプティアでは、科学的根拠の信頼性をS〜Dの5段階で評価しています。この商品はエビデンスレベル${evidenceLevel}です。${evidenceDescriptions[evidenceLevel] || ""}`,
    });
  }

  // 価格に関する質問
  if (priceJPY) {
    faqs.push({
      question: `${productName}の最安値はどこで買えますか？`,
      answer: `サプティアでは楽天市場、Yahoo!ショッピング、Amazonなど複数のECサイトの価格を比較しています。上記の価格比較セクションで最新の最安値をご確認いただけます。`,
    });
  }

  // ブランドに関する質問
  if (brandName) {
    faqs.push({
      question: `${brandName}は信頼できるメーカーですか？`,
      answer: `${brandName}は${productName}を製造・販売しているブランドです。サプティアでは製品の成分含有量、価格、エビデンス、安全性を客観的に評価しています。ブランドの信頼性は、これらの評価スコアを参考にご判断ください。`,
    });
  }

  return faqs;
}
