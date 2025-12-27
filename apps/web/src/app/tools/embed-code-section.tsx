"use client";

/**
 * 埋め込みコードセクション - コピーボタン付き
 */

import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";

const EMBED_CODE = `<iframe src="https://suptia.com/tools/embed/mg-calculator" width="260" height="420" frameborder="0"></iframe>`;

export function EmbedCodeSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMBED_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[#f5f5f7] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-[28px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1d1d1f] mb-4"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            あなたのサイトにも。
          </h2>
          <p className="text-[17px] md:text-[19px] text-[#515154] leading-[1.47]">
            Suptiaのツールは、ブログやWebサイトに無料で埋め込めます。
          </p>
        </div>

        {/* Embed Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.04] rounded-[20px] p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-sm">
                <Code2 size={20} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                  コスパ計算機の埋め込みコード
                </h3>
                <p className="text-[13px] text-[#86868b]">
                  iframe形式で簡単に設置できます
                </p>
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`
              w-full flex items-center justify-center gap-2
              px-6 py-4
              rounded-[14px]
              font-medium text-[17px]
              transition-all duration-200
              ${
                copied
                  ? "bg-[#34C759] text-white"
                  : "bg-[#007AFF] text-white hover:bg-[#0071e3] active:scale-[0.98] shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
              }
            `}
          >
            {copied ? (
              <>
                <Check size={20} strokeWidth={2} />
                コピーしました
              </>
            ) : (
              <>
                <Copy size={20} strokeWidth={2} />
                埋め込みコードをコピー
              </>
            )}
          </button>

          {/* Preview Info */}
          <div className="mt-6 p-4 bg-[#f5f5f7] rounded-[12px]">
            <p className="text-[13px] text-[#86868b] leading-relaxed">
              <span className="font-medium text-[#1d1d1f]">サイズ:</span> 260 x
              420px（コンパクト設計）
              <br />
              <span className="font-medium text-[#1d1d1f]">対応:</span>{" "}
              WordPress、Wix、Note、はてなブログなど
            </p>
          </div>
        </div>

        <p className="text-center text-[15px] text-[#515154] mt-6">
          健康・美容系のコンテンツと組み合わせてご活用ください。
        </p>
      </div>
    </section>
  );
}
