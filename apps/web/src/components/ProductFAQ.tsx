"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { appleWebColors, liquidGlassClasses } from "@/lib/design-system";
import {
  generateProductFAQs,
  type ProductFAQProps,
  type FAQItem,
} from "@/lib/product-faq";

// Re-export types for convenience
export type { ProductFAQProps, FAQItem };

/**
 * 商品ページ用FAQコンポーネント
 * SEO・AI検索最適化のためのFAQセクション
 */
export function ProductFAQ(props: ProductFAQProps) {
  const faqs = generateProductFAQs(props);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className={`p-6 rounded-xl border border-slate-200 ${liquidGlassClasses.light}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-indigo-500" />
        <h3
          className="font-bold text-lg"
          style={{ color: appleWebColors.textPrimary }}
        >
          よくある質問
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-100 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span
                className="font-medium text-sm pr-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                style={{ color: appleWebColors.textSecondary }}
              />
            </button>
            {openIndex === index && (
              <div
                className="px-4 pb-4 text-sm leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
