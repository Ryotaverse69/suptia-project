"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { appleWebColors, typography, appleEase } from "@/lib/design-system";
import { GlassCard } from "./GlassCard";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

interface FAQItemComponentProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function FAQItemComponent({
  item,
  index,
  isOpen,
  onToggle,
  isLast,
}: FAQItemComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={isLast ? "" : "border-b border-black/5"}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: appleEase }}
    >
      <button
        className="w-full flex items-center justify-between py-5 md:py-6 text-left min-h-[56px] group"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span
          className={`${typography.headline} pr-4 transition-colors`}
          style={{ color: appleWebColors.textPrimary }}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: appleEase }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"
          aria-hidden="true"
        >
          <ChevronDown
            className="w-4 h-4"
            style={{ color: appleWebColors.textSecondary }}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: appleEase }}
            style={{ overflow: "hidden" }}
          >
            <p
              className={`${typography.body} pb-6`}
              style={{ color: appleWebColors.textSecondary }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Apple HIG FAQ Accordion Component
 *
 * A collapsible FAQ list with smooth animations.
 * Only one item can be open at a time.
 */
export function FAQAccordion({ items, className = "" }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <GlassCard className={`px-6 md:px-8 ${className}`} hover={false}>
      {items.map((item, index) => (
        <FAQItemComponent
          key={index}
          item={item}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
          isLast={index === items.length - 1}
        />
      ))}
    </GlassCard>
  );
}

export default FAQAccordion;
