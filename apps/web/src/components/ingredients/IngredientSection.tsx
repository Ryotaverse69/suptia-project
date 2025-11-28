import { ReactNode } from "react";

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
        <h2 className={`flex items-center gap-3 text-lg sm:text-xl font-bold ${styles.title}`}>
          {icon && (
            <span className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${styles.iconBg}`}>
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
    <ul className="space-y-4">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex gap-3 sm:gap-4">
          <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm">
            {index + 1}
          </span>
          <span className="text-gray-700 text-sm sm:text-base leading-relaxed pt-0.5">
            {benefit}
          </span>
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
  const iconColor = variant === "danger" ? "text-red-500" : "text-yellow-500";
  const textColor = variant === "danger" ? "text-red-900" : "text-yellow-900";

  return (
    <ul className="space-y-3 sm:space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className={`flex-shrink-0 text-lg sm:text-xl ${iconColor}`}>⚠️</span>
          <span className={`${textColor} text-sm sm:text-base leading-relaxed`}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// テキストコンテンツ用コンポーネント（長文用）
interface TextContentProps {
  content: string;
}

export function TextContent({ content }: TextContentProps) {
  // 改行と段落を処理
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose prose-gray max-w-none">
      {paragraphs.map((paragraph, index) => {
        // 箇条書きの検出
        if (paragraph.includes("・") || paragraph.includes("•")) {
          const lines = paragraph.split(/[・•]/).filter(Boolean);
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4">
              {lines.map((line, i) => (
                <li key={i} className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {line.trim()}
                </li>
              ))}
            </ul>
          );
        }

        // 通常の段落
        return (
          <p
            key={index}
            className="text-gray-700 text-sm sm:text-base leading-relaxed sm:leading-loose mb-4 last:mb-0"
          >
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}
