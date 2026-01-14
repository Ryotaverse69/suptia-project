/**
 * AIコンシェルジュ ページ
 *
 * v2.2.0 - Apple HIG準拠デザイン
 */

import { Metadata } from "next";
import { ConciergeProvider } from "@/contexts/ConciergeContext";
import { ChatUI } from "@/components/concierge";

export const metadata: Metadata = {
  title: "AIコンシェルジュ | サプティア",
  description:
    "サプリメント選びをAIがサポート。安全・コスト・エビデンスの観点から、あなたに合った選択肢をご提案します。",
  openGraph: {
    title: "AIコンシェルジュ | サプティア",
    description:
      "サプリメント選びをAIがサポート。安全・コスト・エビデンスの観点から、あなたに合った選択肢をご提案します。",
  },
};

export default function ConciergePage() {
  return (
    <ConciergeProvider>
      <ChatUI />
    </ConciergeProvider>
  );
}
