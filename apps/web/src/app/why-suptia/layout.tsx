import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI検索との違い - なぜサプティアを選ぶべきか | サプティア",
  description:
    "ChatGPTやPerplexityなどのAI検索は便利ですが、サプリメント選びには限界があります。薬機法準拠、相互作用チェック、価格履歴など、AIには提供できない価値をサプティアは提供します。",
  keywords: [
    "AI検索",
    "ChatGPT",
    "Perplexity",
    "サプリメント比較",
    "サプティア",
    "薬機法",
  ],
};

export default function WhySuptiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
