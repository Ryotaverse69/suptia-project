"use client";

import { trackProductClick, trackOutboundLink } from "@/lib/analytics";

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  productId?: string;
  source?: string;
  price?: number;
  className?: string;
  target?: string;
  rel?: string;
}

/**
 * トラッキング付きリンクコンポーネント
 *
 * 外部リンククリック時にGA4イベントを送信します。
 * 商品リンクの場合は、productId、source、priceを指定してください。
 */
export function TrackedLink({
  href,
  children,
  productId,
  source,
  price,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
}: TrackedLinkProps) {
  const handleClick = () => {
    // 商品リンクの場合
    if (productId && source && price !== undefined) {
      trackProductClick(productId, source, price);
    } else {
      // 一般的な外部リンク
      trackOutboundLink(
        href,
        typeof children === "string" ? children : undefined,
      );
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}
