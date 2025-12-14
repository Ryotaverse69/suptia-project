import { Metadata } from "next";
import { MethodologyClient } from "./MethodologyClient";

export const metadata: Metadata = {
  title: "サプリメントの科学的比較方法とは｜サプティアの評価基準",
  description:
    "サプティアがサプリメントを科学的に比較・評価する方法を解説。PubMed・Cochrane Libraryなどの一次ソースに基づくエビデンス評価、5つの柱による透明な評価基準を公開。",
  keywords: [
    "サプリメント",
    "科学的比較",
    "エビデンス",
    "評価方法",
    "PubMed",
    "Cochrane",
  ],
  openGraph: {
    title: "サプリメントの科学的比較方法とは｜サプティアの評価基準",
    description:
      "PubMed・Cochrane等の一次ソースに基づく科学的なサプリメント評価方法を解説。",
    type: "article",
  },
};

// FAQ data for JSON-LD
const faqData = [
  {
    question: "サプリメントの科学的比較とは何ですか？",
    answer:
      "サプリメントの科学的比較とは、PubMed、Cochrane Library、厚生労働省などの信頼できる一次ソースに基づいて、成分の有効性、安全性、推奨摂取量を客観的に評価・比較する方法です。サプティアでは、この科学的アプローチに基づいてすべてのサプリメントを評価しています。",
  },
  {
    question: "エビデンスレベルS/A/B/C/Dはどのように決まりますか？",
    answer:
      "エビデンスレベルは研究の質と量に基づいて決定されます。Sランクは大規模RCT（ランダム化比較試験）やメタ解析で効果が確認されたもの、Aランクは複数の質の高い研究で効果が示されたもの、Bランクは限定的な研究で効果が示唆されたもの、Cランクは動物実験や小規模試験のみのもの、Dランクは科学的根拠が不十分なものを指します。",
  },
  {
    question: "サプティアはどの情報源を参照していますか？",
    answer:
      "サプティアは主にPubMed（米国国立医学図書館）、Cochrane Library（システマティックレビュー）、厚生労働省の「日本人の食事摂取基準」、NIH Office of Dietary Supplements、EFSA（欧州食品安全機関）の公式文書を参照しています。",
  },
  {
    question: "安全性スコア0-100点はどのように算出されますか？",
    answer:
      "安全性スコアは、既知の副作用の頻度と重篤度、薬物相互作用のリスク、過剰摂取リスク（UL超過の可能性）、妊娠中・授乳中の安全性、添加物の安全性評価を総合的に考慮して算出されます。90点以上がSランク、80-89点がAランク、70-79点がBランク、60-69点がCランク、60点未満がDランクとなります。",
  },
  {
    question: "価格比較はどのように行われていますか？",
    answer:
      "価格比較は、楽天市場、Yahoo!ショッピング、Amazonなど複数のECサイトの価格を毎日自動取得し、JANコード（国際標準の商品識別コード）を使用して同一商品を正確にマッチングしています。また、1日あたりの実効コストと成分量あたりの価格（¥/mg）を計算し、真のコストパフォーマンスを比較できます。",
  },
];

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "サプリメントの科学的比較方法とは",
      description:
        "サプティアがサプリメントを科学的に比較・評価する方法を解説。PubMed・Cochrane Libraryなどの一次ソースに基づくエビデンス評価。",
      author: {
        "@type": "Organization",
        name: "サプティア",
        url: "https://suptia.com",
      },
      publisher: {
        "@type": "Organization",
        name: "サプティア",
        logo: {
          "@type": "ImageObject",
          url: "https://suptia.com/logo.png",
        },
      },
      datePublished: "2025-12-14",
      dateModified: "2025-12-14",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://suptia.com/about/methodology",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqData.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function MethodologyPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MethodologyClient faqData={faqData} />
    </>
  );
}
