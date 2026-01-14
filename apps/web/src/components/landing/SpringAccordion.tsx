"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
  liquidGlassClasses,
} from "@/lib/design-system";

// Mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

interface FAQItem {
  question: string;
  answer: string;
}

interface SpringAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
  isLast,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const isMobile = useIsMobile();

  return (
    <motion.div
      ref={ref}
      className={isLast ? "" : "border-b"}
      style={{ borderColor: appleWebColors.borderSubtle }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: appleEase,
      }}
    >
      {/* Question Button - Apple style 56px touch target */}
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
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
          aria-hidden="true"
        >
          <ChevronDown
            className="w-4 h-4"
            style={{ color: appleWebColors.textSecondary }}
          />
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: appleEase },
                opacity: { duration: 0.3, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: appleEase },
                opacity: { duration: 0.2 },
              },
            }}
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

export function SpringAccordion({
  items,
  title = "よくある質問",
  subtitle = "サプティアについてよくいただくご質問をまとめました",
}: SpringAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32"
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        fontFamily: fontStack,
        contain: "layout paint",
      }}
    >
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: appleEase }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: appleEase }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
              }}
            >
              <HelpCircle className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-[32px] md:text-[48px] font-bold leading-[1.05] tracking-[-0.015em] mb-4"
            style={{ color: appleWebColors.textPrimary }}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: appleEase }}
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className={typography.title3}
            style={{ color: appleWebColors.textSecondary }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: appleEase }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Glass Card Container */}
        <motion.div
          className={`overflow-hidden ${liquidGlassClasses.light}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: appleEase }}
        >
          <div className="px-6 md:px-8">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
        >
          <p
            className={`${typography.subhead} mb-6`}
            style={{ color: appleWebColors.textSecondary }}
          >
            その他のご質問がございましたら、お気軽にお問い合わせください
          </p>
          <Link href="/contact">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold min-h-[56px]"
              style={{ backgroundColor: systemColors.blue }}
              whileHover={
                isMobile ? {} : { backgroundColor: "#0077ED", scale: 1.02 }
              }
              whileTap={isMobile ? {} : { scale: 0.97 }}
              transition={subtleSpring}
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>お問い合わせ</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
