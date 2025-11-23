"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  useState,
  ReactNode,
  useEffect,
  createContext,
  useContext,
} from "react";

interface SeamlessModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  layoutId: string;
}

const SeamlessModalContext = createContext<
  SeamlessModalContextType | undefined
>(undefined);

export function useSeamlessModal() {
  const context = useContext(SeamlessModalContext);
  if (!context) {
    throw new Error("useSeamlessModal must be used within a SeamlessModal");
  }
  return context;
}

interface SeamlessModalProps {
  children: ReactNode;
  layoutId: string;
  className?: string;
}

export function SeamlessModal({
  children,
  layoutId,
  className = "",
}: SeamlessModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <SeamlessModalContext.Provider value={{ isOpen, open, close, layoutId }}>
      <div className={className}>{children}</div>
    </SeamlessModalContext.Provider>
  );
}

interface SeamlessModalTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SeamlessModalTrigger({
  children,
  className = "",
}: SeamlessModalTriggerProps) {
  const { open, layoutId } = useSeamlessModal();

  return (
    <motion.div
      layoutId={layoutId}
      onClick={open}
      className={`cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

interface SeamlessModalContentProps {
  children: ReactNode;
  className?: string;
}

export function SeamlessModalContent({
  children,
  className = "",
}: SeamlessModalContentProps) {
  const { isOpen, close, layoutId } = useSeamlessModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Expanded Content */}
          <motion.div
            layoutId={layoutId}
            className={`bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col ${className}`}
          >
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {/* Close Button (Floating) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 hover:bg-white transition-colors z-50 shadow-sm border border-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
