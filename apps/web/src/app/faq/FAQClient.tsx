"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  typography,
  liquidGlassClasses,
} from "@/lib/design-system";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqData: FAQItem[];
}

export default function FAQClient({ faqData }: FAQClientProps) {
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
    <div
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
        minHeight: "100vh",
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1
            className={`${typography.largeTitle} mb-3`}
            style={{ color: appleWebColors.textPrimary }}
          >
            よくある質問
          </h1>
          <p
            className={typography.body}
            style={{ color: appleWebColors.textSecondary }}
          >
            サプティアに関するよくある質問と回答
          </p>
        </div>

        {/* Search Bar - Glassmorphism */}
        <div className="mb-8">
          <div
            className={`relative rounded-[16px] overflow-hidden ${liquidGlassClasses.light}`}
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: appleWebColors.textSecondary }}
            />
            <input
              type="text"
              placeholder="質問を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none ${typography.body}`}
              style={{
                color: appleWebColors.textPrimary,
                minHeight: "48px",
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 rounded-[20px] transition-all duration-200 ${typography.subhead} font-medium`}
              style={{
                minHeight: "48px",
                backgroundColor:
                  selectedCategory === null
                    ? systemColors.blue
                    : appleWebColors.sectionBackground,
                color:
                  selectedCategory === null
                    ? "#FFFFFF"
                    : appleWebColors.textPrimary,
                border: `1px solid ${selectedCategory === null ? systemColors.blue : appleWebColors.borderSubtle}`,
              }}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 rounded-[20px] transition-all duration-200 ${typography.subhead} font-medium`}
                style={{
                  minHeight: "48px",
                  backgroundColor:
                    selectedCategory === category
                      ? systemColors.blue
                      : appleWebColors.sectionBackground,
                  color:
                    selectedCategory === category
                      ? "#FFFFFF"
                      : appleWebColors.textPrimary,
                  border: `1px solid ${selectedCategory === category ? systemColors.blue : appleWebColors.borderSubtle}`,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div
              className={`text-center py-12 ${typography.body}`}
              style={{ color: appleWebColors.textSecondary }}
            >
              該当する質問が見つかりませんでした
            </div>
          ) : (
            filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="rounded-[16px] overflow-hidden transition-all duration-200"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-4 flex items-center justify-between transition-colors text-left"
                  style={{
                    minHeight: "48px",
                  }}
                >
                  <div className="flex-1">
                    <div
                      className={`${typography.caption1} mb-1 font-medium`}
                      style={{ color: systemColors.blue }}
                    >
                      {item.category}
                    </div>
                    <div
                      className={`${typography.headline}`}
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item.question}
                    </div>
                  </div>
                  <div className="ml-4">
                    {openIndex === index ? (
                      <ChevronUp
                        className="w-5 h-5"
                        style={{ color: appleWebColors.textSecondary }}
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5"
                        style={{ color: appleWebColors.textSecondary }}
                      />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div
                    className="px-5 py-4"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                    }}
                  >
                    <p
                      className={typography.body}
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div
          className="mt-16 text-center pt-12"
          style={{ borderTop: `1px solid ${appleWebColors.borderSubtle}` }}
        >
          <h2
            className={`${typography.title2} mb-3`}
            style={{ color: appleWebColors.textPrimary }}
          >
            解決しない場合は
          </h2>
          <p
            className={`${typography.body} mb-6`}
            style={{ color: appleWebColors.textSecondary }}
          >
            上記で解決しない場合は、お問い合わせフォームからご連絡ください
          </p>
          <a
            href="/contact"
            className={`inline-block px-8 py-3 rounded-[16px] transition-all duration-200 ${typography.headline} font-semibold`}
            style={{
              backgroundColor: systemColors.blue,
              color: "#FFFFFF",
              minHeight: "48px",
            }}
          >
            お問い合わせフォームへ
          </a>
        </div>
      </div>
    </div>
  );
}
