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
    text = text.join(" ");
  }

  // 文字列でない場合は文字列に変換
  if (typeof text !== "string") {
    text = String(text);
  }

  // 箇条書きマーカーを削除（◦、•、・など）
  text = text
    .replace(/^[•◦・]\s*/gm, "") // 行頭の箇条書きマーカーを削除
    .replace(/\s*[•◦・]\s*/g, " "); // 文中の箇条書きマーカーをスペースに

  // 不要な定型文を削除
  text = text
    .replace(/[:：]\s*優れた供給源として知られています\.?/gi, "")
    .replace(/[:：]\s*豊富に含まれています\.?/gi, "")
    .replace(/[:：]\s*良い供給源です\.?/gi, "")
    .replace(/[:：]\s*ビタミンAが豊富です\.?/gi, "")
    .replace(/優れた供給源として知られています\.?/gi, "")
    .replace(/豊富に含まれています\.?/gi, "")
    .replace(/良い供給源です\.?/gi, "")
    .replace(/ビタミンAが豊富です\.?/gi, "");

  // 改行文字の正規化
  text = text
    .replace(/\r\n/g, "\n") // Windows改行を統一
    .replace(/\r/g, "\n"); // Mac改行を統一

  // 句読点の重複を削除
  text = text
    .replace(/。+/g, "。") // 連続した句点を1つに
    .replace(/、+/g, "、") // 連続した読点を1つに
    .replace(/！+/g, "！") // 連続した感嘆符を1つに
    .replace(/？+/g, "？"); // 連続した疑問符を1つに

  // 接続詞や特定のパターンで改行を追加（読みやすさ向上）
  text = text
    .replace(
      /。\s*(また、|さらに、|ただし、|なお、|一方、|そのため、|したがって、)/g,
      "。\n\n$1",
    )
    .replace(/。\s*(\d+(?:mg|μg|g|mL|IU))/g, "。\n\n$1") // 数値の前で改行
    .replace(/。\s*(妊娠|授乳|子供|高齢)/g, "。\n\n$1"); // 重要な注意喚起の前で改行

  // 句点で文を区切る（適度な長さで段落を作成）
  const sentences = text.split(/([。！？])/);
  const paragraphs: string[] = [];
  let currentParagraph = "";

  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] + (sentences[i + 1] || "");

    if (!sentence.trim()) continue;

    currentParagraph += sentence;

    // 100文字を超えたら新しい段落にする（読みやすさ重視）
    if (currentParagraph.length > 100 && sentence.match(/[。！？]$/)) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = "";
    }
  }

  // 最後の段落を追加
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  // 段落がない場合は全体を1段落として扱う
  if (paragraphs.length === 0 && text.trim()) {
    paragraphs.push(text.trim());
  }

  // 各段落をHTMLに変換
  const formattedParagraphs = paragraphs.map((paragraph) => {
    // マークダウン記法の変換
    return paragraph
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+?)\*/g, "<em>$1</em>")
      .replace(/_([^_]+?)_/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  });

  // 段落をdivタグで囲む（段落が1つしかない場合は分割しない）
  if (formattedParagraphs.length === 1) {
    return `<div class="leading-relaxed">${formattedParagraphs[0]}</div>`;
  }

  return formattedParagraphs
    .map((p) => `<p class="mb-4 leading-relaxed">${p}</p>`)
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
    // 箇条書きマーカーを削除
    let cleanedItem = item
      .replace(/^[•◦・]\s*/gm, "") // 行頭のマーカーを削除
      .replace(/\s*[•◦・]\s*/g, " ") // 文中のマーカーをスペースに
      .trim();

    // 不要な定型文を削除
    cleanedItem = cleanedItem
      .replace(/^研究により有効性が確認されており、?\s*/g, "") // 文頭の定型文を削除
      .replace(/、?研究により有効性が確認されており、?\s*/g, "") // 文中の定型文を削除
      .replace(/^一般的に、?\s*/g, "") // 「一般的に、」を削除
      .replace(/^報告されており、?\s*/g, "") // 「報告されており、」を削除
      .replace(/[:：]\s*優れた供給源として知られています\.?/gi, "")
      .replace(/[:：]\s*豊富に含まれています\.?/gi, "")
      .replace(/[:：]\s*良い供給源です\.?/gi, "")
      .replace(/優れた供給源として知られています\.?/gi, "")
      .replace(/豊富に含まれています\.?/gi, "")
      .replace(/良い供給源です\.?/gi, "");

    // 読みやすさのための改行を追加
    cleanedItem = cleanedItem
      .replace(/。\s*(また、|さらに、|ただし、|なお、)/g, "。<br /><br />$1")
      .replace(/。\s*(併用|注意|禁忌|避け)/g, "。<br /><br />$1");

    // 句読点の重複を削除
    cleanedItem = cleanedItem.replace(/。+/g, "。").replace(/、+/g, "、");

    // マークダウン記法を処理
    const formattedItem = cleanedItem
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+?)\*/g, "<em>$1</em>")
      .replace(/_([^_]+?)_/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

    const marker =
      type === "numbered" ? `<span>${index + 1}.</span>` : `<span>•</span>`;

    return `
      <li class="flex gap-3 mb-5 last:mb-0">
        <span class="text-primary-600 mt-0.5 flex-shrink-0">${marker}</span>
        <div class="flex-1 leading-relaxed" style="line-height: 1.85;">${formattedItem}</div>
      </li>
    `;
  });

  return `<ul class="space-y-3">${formattedItems.join("")}</ul>`;
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
