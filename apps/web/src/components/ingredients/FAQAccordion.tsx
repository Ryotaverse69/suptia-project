"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // 最初のFAQを開いた状態に

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl overflow-hidden bg-white"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-bold">
                Q
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base leading-relaxed">
                {faq.question}
              </span>
            </div>
            <ChevronDown
              size={20}
              className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-[2000px]" : "max-h-0"
            }`}
          >
            <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs sm:text-sm font-bold">
                  A
                </span>
                <div className="flex-1 text-gray-700 text-sm sm:text-base leading-[1.9] sm:leading-[2]">
                  {faq.answer.split("\n").map((line, i) => {
                    const trimmedLine = line.trim();
                    // 空行はスキップ
                    if (!trimmedLine) return null;
                    // 箇条書きの検出
                    if (/^[・•\-※]\s*/.test(trimmedLine)) {
                      return (
                        <div key={i} className="flex gap-2 mt-2 first:mt-0">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                          <span>{trimmedLine.replace(/^[・•\-※]\s*/, '')}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={i} className={i > 0 ? "mt-4" : ""}>
                        {trimmedLine}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
