"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

/**
 * 目次コンポーネント
 * ページ内の主要セクションへのアンカーリンク
 */
export function TableOfContents({
  items,
  className = "",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

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
        rootMargin: "-100px 0px -80% 0px",
      },
    );

    // すべてのセクションを監視
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // ヘッダーの高さ分のオフセット
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`bg-white border border-primary-200 rounded-lg p-6 sticky top-24 ${className}`}
    >
      <h2 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
        <List size={20} className="text-primary" />
        目次
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                activeId === item.id
                  ? "bg-primary text-white font-medium"
                  : "text-primary-700 hover:bg-primary-50"
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
