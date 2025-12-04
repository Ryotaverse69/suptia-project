"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { HelpCircle, Plus, MessageCircle } from "lucide-react";
import Link from "next/link";

// Apple式：モバイル検出
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
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={ref}
      className="relative will-change-transform"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 will-change-transform ${
          isOpen
            ? "bg-slate-50 border-primary/20"
            : "bg-white border-slate-200 hover:border-primary/20"
        }`}
        animate={{
          boxShadow: isOpen
            ? "0 20px 25px -5px rgba(59, 102, 224, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            : isHovered
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
        layout
        style={{ transform: "translateZ(0)" }}
      >
        {/* Question Button - Apple式：モバイルではホバー効果無効 */}
        <motion.button
          className="w-full flex items-center justify-between p-6 text-left will-change-transform"
          onClick={onToggle}
          whileHover={isMobile ? {} : { x: 4 }}
          transition={{ duration: 0.2 }}
          style={{ transform: "translateZ(0)" }}
        >
          <span className="flex items-center gap-4">
            <motion.span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              }`}
              animate={
                isMobile
                  ? { rotate: isOpen ? 180 : 0 }
                  : {
                      rotate: isOpen ? 180 : 0,
                      scale: isHovered && !isOpen ? 1.1 : 1,
                    }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <motion.span
              className="text-base sm:text-lg font-medium text-slate-800 pr-4"
              animate={{ color: isOpen ? "#3b66e0" : "#1e293b" }}
              transition={{ duration: 0.3 }}
            >
              {item.question}
            </motion.span>
          </span>

          <motion.div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
            }`}
            animate={
              isMobile
                ? { rotate: isOpen ? 45 : 0 }
                : {
                    rotate: isOpen ? 45 : 0,
                    scale: isHovered && !isOpen ? 1.1 : 1,
                  }
            }
            transition={
              isMobile
                ? { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.3, type: "spring", stiffness: 200 }
            }
          >
            <Plus className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Answer - 強化版アニメーション */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.3, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2 },
                },
              }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                className="px-6 pb-6 pt-2 will-change-transform"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transform: "translateZ(0)" }}
              >
                <div className="pl-12 border-l-2 border-primary/30">
                  <p className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-[#7a98ec]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.div>
  );
}

export function SpringAccordion({
  items,
  title = "よくある質問",
  subtitle = "Suptiaについてよくいただくご質問をまとめました",
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
      className="relative py-24 bg-slate-50"
      style={{ contain: "layout paint" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3b66e0 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header - 強化版 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center justify-center gap-3 mb-6"
            initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={
              isMobile
                ? { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }
            }
          >
            {/* Apple式：モバイル・reduced-motionでは連続アニメーション無効 */}
            {isMobile || prefersReducedMotion ? (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
            ) : (
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-lg will-change-transform"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                style={{ transform: "translateZ(0)" }}
              >
                <HelpCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-light text-slate-800 mb-3"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Accordion Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Contact CTA - Apple式モバイル最適化 */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-slate-400 text-sm mb-4">
            その他のご質問がございましたら、お気軽にお問い合わせください
          </p>
          <Link href="/contact">
            <motion.button
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow will-change-transform"
              whileHover={isMobile ? {} : { scale: 1.02 }}
              whileTap={isMobile ? {} : { scale: 0.98 }}
              style={{ transform: "translateZ(0)" }}
            >
              {/* Background - モバイルでは連続アニメーション無効 */}
              {isMobile || prefersReducedMotion ? (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#5a7fe6]" />
              ) : (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-[#5a7fe6] to-primary bg-[length:200%_100%]"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Shine Effect - デスクトップのみ */}
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              )}

              <MessageCircle className="relative z-10 w-5 h-5 text-white" />
              <span className="relative z-10 font-semibold text-white">
                お問い合わせ
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
