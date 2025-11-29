import React, { ReactNode } from "react";

interface IngredientSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}

const variantStyles = {
  default: {
    container: "bg-white border-gray-200",
    title: "text-gray-900",
    iconBg: "bg-gray-100 text-gray-600",
  },
  success: {
    container: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    title: "text-green-900",
    iconBg: "bg-green-100 text-green-600",
  },
  warning: {
    container: "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200",
    title: "text-yellow-900",
    iconBg: "bg-yellow-100 text-yellow-600",
  },
  danger: {
    container: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200",
    title: "text-red-900",
    iconBg: "bg-red-100 text-red-600",
  },
  info: {
    container: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    title: "text-blue-900",
    iconBg: "bg-blue-100 text-blue-600",
  },
};

export function IngredientSection({
  id,
  title,
  icon,
  variant = "default",
  children,
}: IngredientSectionProps) {
  const styles = variantStyles[variant];

  return (
    <section
      id={id}
      className={`rounded-2xl border-2 ${styles.container} overflow-hidden scroll-mt-24`}
    >
      {/* セクションヘッダー */}
      <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-inherit">
        <h2
          className={`flex items-center gap-3 text-lg sm:text-xl font-bold ${styles.title}`}
        >
          {icon && (
            <span
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${styles.iconBg}`}
            >
              {icon}
            </span>
          )}
          {title}
        </h2>
      </div>

      {/* セクションコンテンツ */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

// 効果・効能リスト用コンポーネント
interface BenefitListProps {
  benefits: string[];
}

export function BenefitList({ benefits }: BenefitListProps) {
  return (
    <ul className="space-y-5">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex gap-4">
          <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
            {index + 1}
          </span>
          <div className="flex-1 pt-1">
            <p className="text-gray-800 text-sm sm:text-base leading-[1.8] sm:leading-[1.9]">
              {benefit}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// 警告リスト用コンポーネント
interface WarningListProps {
  items: string[];
  variant?: "danger" | "warning";
}

export function WarningList({ items, variant = "danger" }: WarningListProps) {
  const bgColor = variant === "danger" ? "bg-red-100" : "bg-yellow-100";
  const borderColor =
    variant === "danger" ? "border-red-200" : "border-yellow-200";
  const textColor = variant === "danger" ? "text-red-900" : "text-yellow-900";

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex gap-3 p-4 rounded-xl ${bgColor} border ${borderColor}`}
        >
          <span className="flex-shrink-0 text-lg">⚠️</span>
          <p className={`${textColor} text-sm sm:text-base leading-[1.8]`}>
            {item}
          </p>
        </li>
      ))}
    </ul>
  );
}

// テキストコンテンツ用コンポーネント（長文用）
interface TextContentProps {
  content: string;
}

// 数字や単位をハイライト
function highlightNumbers(text: string): React.ReactNode[] {
  // 数値+単位のパターン（例: 1000mg, 200〜400mg, 500mg/日）
  const pattern =
    /(\d+(?:,\d{3})*(?:\.\d+)?(?:\s*[〜～\-]\s*\d+(?:,\d{3})*(?:\.\d+)?)?)\s*(mg|g|μg|mcg|IU|%|ml|mL|日|回|週|ヶ月|カ月)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // マッチ前のテキスト
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // マッチした数値+単位をハイライト
    parts.push(
      <span key={match.index} className="font-semibold text-primary">
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  // 残りのテキスト
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// テキストをパースしてフォーマットを適用（エクスポート）
export function parseFormattedText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];

  // すべてのフォーマットパターンを統合
  // 優先順位: 太字(**text**) → カギ括弧 → 墨付きカッコ → 数値ハイライト
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, type: "bold" as const },
    { regex: /「([^」]+)」/g, type: "bracket" as const },
    { regex: /【([^】]+)】/g, type: "square" as const },
  ];

  interface Match {
    start: number;
    end: number;
    content: string;
    innerContent: string;
    type: "bold" | "bracket" | "square";
  }

  const allMatches: Match[] = [];

  for (const { regex, type } of patterns) {
    let match;
    // 正規表現のlastIndexをリセット
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[0],
        innerContent: match[1],
        type,
      });
    }
  }

  if (allMatches.length === 0) {
    return highlightNumbers(text);
  }

  // 開始位置でソート
  allMatches.sort((a, b) => a.start - b.start);

  // 重複を除去（先にマッチしたものを優先）
  const filteredMatches: Match[] = [];
  let lastEnd = 0;
  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  }

  let lastIndex = 0;

  filteredMatches.forEach((m, i) => {
    // マッチ前のテキストを数値ハイライト処理
    if (m.start > lastIndex) {
      parts.push(...highlightNumbers(text.slice(lastIndex, m.start)));
    }

    // マッチ部分をタイプに応じてレンダリング
    if (m.type === "bold") {
      parts.push(
        <strong key={`bold-${i}`} className="font-bold text-gray-900">
          {m.innerContent}
        </strong>,
      );
    } else if (m.type === "bracket") {
      parts.push(
        <span
          key={`bracket-${i}`}
          className="font-medium text-gray-900 bg-yellow-50 px-1 rounded"
        >
          「{m.innerContent}」
        </span>,
      );
    } else if (m.type === "square") {
      parts.push(
        <span
          key={`square-${i}`}
          className="font-medium text-gray-900 bg-yellow-50 px-1 rounded"
        >
          【{m.innerContent}】
        </span>,
      );
    }

    lastIndex = m.end;
  });

  // 残りのテキストを数値ハイライト処理
  if (lastIndex < text.length) {
    parts.push(...highlightNumbers(text.slice(lastIndex)));
  }

  return parts;
}

// 後方互換性のためのエイリアス
function highlightKeywords(text: string): React.ReactNode[] {
  return parseFormattedText(text);
}

export function TextContent({ content }: TextContentProps) {
  // 改行と段落を処理（単一改行も段落区切りとして扱う）
  // ただし、箇条書きの場合は別処理
  const lines = content.split(/\n/).filter(Boolean);

  // 連続する箇条書き行をグループ化
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      elements.push(
        <p
          key={`p-${elements.length}`}
          className="text-gray-700 text-sm sm:text-base leading-[1.9] sm:leading-[2] mb-5 last:mb-0"
        >
          {highlightKeywords(text)}
        </p>,
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-3 my-5 pl-1">
          {currentList.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
              <span className="text-gray-700 text-sm sm:text-base leading-[1.8]">
                {highlightKeywords(item.trim())}
              </span>
            </li>
          ))}
        </ul>,
      );
      currentList = [];
    }
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // 見出しの検出（■、●、◆、【】で始まる行）
    if (/^[■●◆▼▶]/.test(trimmedLine) || /^【[^】]+】/.test(trimmedLine)) {
      flushParagraph();
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="font-bold text-gray-900 text-base sm:text-lg mt-6 mb-3 first:mt-0 flex items-center gap-2"
        >
          <span className="w-1 h-5 bg-primary rounded-full" />
          {trimmedLine
            .replace(/^[■●◆▼▶]\s*/, "")
            .replace(/^【([^】]+)】/, "$1")}
        </h3>,
      );
      return;
    }

    // 箇条書きの検出（・、•、-、※で始まる行）
    if (/^[・•\-※]\s*/.test(trimmedLine)) {
      flushParagraph();
      currentList.push(trimmedLine.replace(/^[・•\-※]\s*/, ""));
      return;
    }

    // 数字付きリストの検出（1. 2. など）
    if (/^\d+[.．)）]\s*/.test(trimmedLine)) {
      flushParagraph();
      currentList.push(trimmedLine.replace(/^\d+[.．)）]\s*/, ""));
      return;
    }

    // 空行または短い行は段落区切り
    if (trimmedLine === "" || trimmedLine.length < 3) {
      flushList();
      flushParagraph();
      return;
    }

    // 通常のテキスト行
    flushList();
    currentParagraph.push(trimmedLine);
  });

  // 残りをフラッシュ
  flushList();
  flushParagraph();

  return <div className="text-content">{elements}</div>;
}
