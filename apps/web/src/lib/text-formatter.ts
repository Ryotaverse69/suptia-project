/**
 * テキストフォーマット用のヘルパー関数
 * 成分ガイドなどの長文を読みやすく整形
 */

/**
 * マークダウンをHTMLに変換（段落処理あり）
 */
export function formatTextWithParagraphs(
  text: string | string[] | undefined | null,
): string {
  if (!text) return "";

  // 配列の場合は結合
  if (Array.isArray(text)) {
    text = text.join("\n\n");
  }

  // 文字列でない場合は文字列に変換
  if (typeof text !== "string") {
    text = String(text);
  }

  // 句読点の修正（よくある間違いを自動修正）
  text = text
    .replace(/([。、])\1+/g, "$1") // 重複した句読点を削除
    .replace(/([^。])$/gm, "$1。") // 文末に句点がない場合は追加
    .replace(/、\s*。/g, "。") // 「、。」を「。」に修正
    .replace(/。、/g, "。") // 「。、」を「。」に修正
    .replace(/([。！？])\s*([^」』）\s])/g, "$1\n\n$2"); // 文末の後に改行を追加

  // 段落を分割（2つ以上の改行で区切る）
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // 各段落をHTMLに変換
  const formattedParagraphs = paragraphs.map((paragraph) => {
    // 長い段落は句点で適度に分割
    if (paragraph.length > 200) {
      const sentences = paragraph.split(/([。！？])/);
      let formattedText = "";
      let currentLength = 0;

      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i] + (sentences[i + 1] || "");
        formattedText += sentence;
        currentLength += sentence.length;

        // 150文字を超えたら改行を追加
        if (currentLength > 150 && i < sentences.length - 2) {
          formattedText += "<br /><br />";
          currentLength = 0;
        }
      }

      paragraph = formattedText;
    }

    // マークダウン記法の変換
    return paragraph
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br />");
  });

  // 段落をdivタグで囲む
  return formattedParagraphs
    .map((p) => `<div class="mb-4 leading-relaxed">${p}</div>`)
    .join("");
}

/**
 * 箇条書きリストを整形
 */
export function formatList(
  items: string[] | undefined | null,
  type: "bullet" | "numbered" = "bullet",
): string {
  if (!items || items.length === 0) return "";

  const formattedItems = items.map((item, index) => {
    // 各項目のマークダウンを処理
    const formattedItem = item
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

    const marker =
      type === "numbered" ? `<span>${index + 1}.</span>` : `<span>•</span>`;

    return `
      <li class="flex gap-3 mb-3">
        <span class="text-primary-600 mt-0.5 flex-shrink-0">${marker}</span>
        <div class="flex-1">${formattedItem}</div>
      </li>
    `;
  });

  return `<ul class="space-y-2">${formattedItems.join("")}</ul>`;
}

/**
 * モバイル用に最適化されたテキスト処理
 */
export function optimizeForMobile(text: string): string {
  // スマホでは1段落を短めに
  const maxCharsPerParagraph = 120;

  const paragraphs = text.split("</div>");

  return paragraphs
    .map((p) => {
      if (p.length > maxCharsPerParagraph) {
        // 長い段落はさらに分割
        const midPoint = p.lastIndexOf("。", maxCharsPerParagraph);
        if (midPoint > 0 && midPoint < p.length - 1) {
          const firstPart = p.substring(0, midPoint + 1);
          const secondPart = p.substring(midPoint + 1);
          return `${firstPart}</div><div class="mb-4 leading-relaxed">${secondPart}`;
        }
      }
      return p;
    })
    .join("</div>");
}
