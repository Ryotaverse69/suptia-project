"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  icon?: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  variant?: "mobile" | "desktop";
}

export function TableOfContents({ items, variant = "desktop" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // ヘッダーの高さ分オフセット
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsExpanded(false);
    }
  };

  if (items.length === 0) return null;

  // モバイル版: 折りたたみ式目次
  if (variant === "mobile") {
    return (
      <nav className="sticky top-16 z-40 bg-white border-b border-gray-200 -mx-4 px-4 py-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
          aria-expanded={isExpanded}
          aria-controls="mobile-toc"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <List size={18} className="text-primary" />
            <span>目次</span>
            <span className="text-gray-400">({items.length}セクション)</span>
          </div>
          {isExpanded ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <ul id="mobile-toc" className="mt-3 space-y-1 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeId === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    );
  }

  // デスクトップ版: サイドバー固定目次
  return (
    <nav className="sticky top-24 h-fit">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          <List size={18} className="text-primary" />
          目次
        </h2>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  activeId === item.id
                    ? "bg-primary text-white font-medium shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                }`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
