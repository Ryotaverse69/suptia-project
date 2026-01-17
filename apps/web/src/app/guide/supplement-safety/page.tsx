import { Metadata } from "next";
import { SupplementSafetyClient } from "./SupplementSafetyClient";

export const metadata: Metadata = {
  title:
    "サプリメント健康被害から身を守る｜紅麹事件が教える「情報の質」の重要性",
  description:
    "2024年の紅麹サプリ健康被害事件（入院240人以上、死亡疑い100件超）から学ぶ、安全なサプリメント選びの方法。AI検索の限界とエビデンス・安全性を明示するサプティアの取り組み。",
  keywords: [
    "サプリメント",
    "健康被害",
    "紅麹",
    "機能性表示食品",
    "安全性",
    "エビデンス",
    "サプティア",
  ],
  openGraph: {
    title: "サプリメント健康被害から身を守る｜紅麹事件の教訓",
    description:
      "2024年の紅麹サプリ事件から学ぶ、安全なサプリメント選びの方法。AI検索の限界とエビデンス重視のサプティア。",
    type: "website",
    images: [
      {
        url: "/og/supplement-safety.png",
        width: 1200,
        height: 630,
        alt: "サプリメント健康被害から身を守る",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "サプリメント健康被害から身を守る｜紅麹事件の教訓",
    description:
      "2024年の紅麹サプリ事件から学ぶ、安全なサプリメント選びの方法。",
  },
};

export default function SupplementSafetyPage() {
  return <SupplementSafetyClient />;
}
