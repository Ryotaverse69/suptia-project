"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // サービスについて
  {
    category: "サービスについて",
    question: "Suptiaとは何ですか？",
    answer:
      "Suptiaは、科学的根拠に基づいてサプリメント製品を比較・検索できるメタサーチサービスです。査読済み論文や臨床試験データに基づき、中立的な製品評価を提供しています。",
  },
  {
    category: "サービスについて",
    question: "Suptiaの利用は無料ですか？",
    answer:
      "はい、Suptiaのすべての機能は無料でご利用いただけます。製品検索、比較、レビュー閲覧など、登録不要でアクセスできます。",
  },
  {
    category: "サービスについて",
    question: "なぜアフィリエイトリンクを使用しているのですか？",
    answer:
      "サービスの運営維持のため、Amazon、楽天、iHerb等のアフィリエイトプログラムに参加しています。ただし、アフィリエイト収益の有無は製品評価に一切影響を与えず、すべての製品を同じ科学的基準で評価しています。",
  },

  // 製品情報について
  {
    category: "製品情報について",
    question: "製品の評価基準は何ですか？",
    answer:
      "以下の基準で製品を評価しています：(1)査読済み科学論文のエビデンス、(2)第三者機関による品質認証、(3)成分の含有量と生物学的利用能、(4)製造プロセスの透明性、(5)ユーザーレビューと評価。詳細は各製品ページの「信頼スコア」セクションをご確認ください。",
  },
  {
    category: "製品情報について",
    question: "価格情報はリアルタイムですか？",
    answer:
      "価格情報は定期的に更新していますが、リアルタイムではない場合があります。最新の価格、在庫状況は必ず各ECサイトでご確認ください。また、送料、税金は別途かかる場合があります。",
  },
  {
    category: "製品情報について",
    question: "製品情報はどのくらいの頻度で更新されますか？",
    answer:
      "新しい重要な研究結果が発表された場合は随時更新し、全製品について年1回の定期レビューを実施しています。最終更新日は各製品ページに表示されています。",
  },

  // 購入について
  {
    category: "購入について",
    question: "Suptiaで直接商品を購入できますか？",
    answer:
      "いいえ、Suptiaは商品の直接販売を行っておりません。製品リンクをクリックすると、Amazon、楽天市場、iHerb等の外部ECサイトに移動し、そちらで購入手続きを行っていただきます。",
  },
  {
    category: "購入について",
    question: "返品・交換はできますか？",
    answer:
      "返品・交換については、各ECサイトの規約に従ってください。Suptiaは購入契約の当事者ではないため、返品・交換の対応は行っておりません。",
  },
  {
    category: "購入について",
    question: "配送にはどのくらいかかりますか？",
    answer:
      "配送期間は購入先のECサイトによって異なります。Amazonプライムなら最短翌日、楽天市場は店舗により異なり、iHerbは海外発送のため1〜2週間程度かかる場合があります。詳細は各ECサイトでご確認ください。",
  },

  // 安全性・健康について
  {
    category: "安全性・健康について",
    question: "どのサプリメントを選べば良いですか？",
    answer:
      "サプリメントの選択は個人の健康状態、目的、既往症によって異なります。新しいサプリメントを開始する前に、必ず医師または専門家にご相談ください。Suptiaは医療アドバイスを提供するものではありません。",
  },
  {
    category: "安全性・健康について",
    question: "妊娠中・授乳中でもサプリメントを使用できますか？",
    answer:
      "妊娠中・授乳中のサプリメント使用については、必ず事前に医師にご相談ください。一部のサプリメントは妊娠中・授乳中の使用が推奨されない場合があります。",
  },
  {
    category: "安全性・健康について",
    question: "処方薬と併用しても大丈夫ですか？",
    answer:
      "サプリメントと処方薬の相互作用がある場合があります。処方薬を服用中の方は、サプリメントの使用前に必ず医師または薬剤師にご相談ください。",
  },
  {
    category: "安全性・健康について",
    question: "副作用はありますか？",
    answer:
      "サプリメントでも副作用が起こる可能性があります。用法用量を守り、異常を感じた場合は直ちに使用を中止し、医師にご相談ください。製品ごとの潜在的な副作用情報は各製品ページに記載しています。",
  },

  // 科学的根拠について
  {
    category: "科学的根拠について",
    question: "エビデンスレベルとは何ですか？",
    answer:
      "エビデンスレベルは科学的根拠の強さを示す指標です。レベルA（強力）：複数のRCTまたはメタアナリシス、レベルB（中程度）：限られたRCTまたは観察研究、レベルC（限定的）：小規模研究・動物実験、レベルD（不足）：専門家意見・予備研究のみ、で評価しています。",
  },
  {
    category: "科学的根拠について",
    question: "参考文献はどこで確認できますか？",
    answer:
      "各製品ページおよび成分ページの下部に、根拠となる研究論文のリストを掲載しています。PubMedへのリンクも提供しており、原著論文を直接確認できます。",
  },
  {
    category: "科学的根拠について",
    question: "監修者は誰ですか？",
    answer:
      "現在、栄養学、薬学、医学分野の専門家を監修者として募集中です。詳細は「研究・監修者情報」ページをご確認ください。",
  },

  // アカウント・データについて
  {
    category: "アカウント・データについて",
    question: "会員登録は必要ですか？",
    answer:
      "基本機能のご利用には会員登録は不要です。ただし、将来的にお気に入り機能やパーソナライズドレコメンドを利用する場合は、登録が必要になる可能性があります。",
  },
  {
    category: "アカウント・データについて",
    question: "個人情報はどのように扱われますか？",
    answer:
      "個人情報の取り扱いについては、プライバシーポリシーをご確認ください。当サイトはSSL暗号化通信を使用し、適切なセキュリティ対策を講じています。",
  },
  {
    category: "アカウント・データについて",
    question: "Cookieは使用されていますか？",
    answer:
      "はい、サイト機能の提供、アクセス解析、広告配信のためにCookieを使用しています。詳細はCookieポリシーをご確認ください。フッターの「Cookie設定を変更する」からいつでも設定を変更できます。",
  },

  // その他
  {
    category: "その他",
    question: "モバイルアプリはありますか？",
    answer:
      "現在、モバイルアプリは提供しておりませんが、ウェブサイトはモバイル端末に最適化されています。将来的にアプリのリリースを検討しています。",
  },
  {
    category: "その他",
    question: "製品の掲載をリクエストできますか？",
    answer:
      "はい、お問い合わせフォームから製品の掲載リクエストを受け付けています。ただし、科学的根拠や品質基準を満たす製品のみを掲載しています。",
  },
  {
    category: "その他",
    question: "ビジネス提携について相談できますか？",
    answer:
      "はい、提携に関するお問い合わせは、お問い合わせフォームの「提携・ビジネス」カテゴリからご連絡ください。",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">よくある質問（FAQ）</h1>
        <p className="text-xl text-muted-foreground">
          Suptiaに関するよくある質問と回答
        </p>
      </div>

      {/* 検索バー */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="質問を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* カテゴリフィルター */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            すべて
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ一覧 */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            該当する質問が見つかりませんでした
          </div>
        ) : (
          filteredFAQs.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="text-xs text-primary mb-1">
                    {item.category}
                  </div>
                  <div className="font-semibold">{item.question}</div>
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/30 border-t">
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* お問い合わせ誘導 */}
      <div className="mt-16 text-center border-t pt-12">
        <h2 className="text-2xl font-bold mb-4">解決しない場合は</h2>
        <p className="text-muted-foreground mb-6">
          上記で解決しない場合は、お問い合わせフォームからご連絡ください
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          お問い合わせフォームへ
        </a>
      </div>
    </div>
  );
}
