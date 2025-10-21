/**
 * 内部リンク自動生成ユーティリティ
 *
 * 成分ガイド間の内部リンクを自動で挿入し、
 * SEOとユーザビリティを向上させます。
 */

/**
 * リンク可能な成分情報
 */
export interface LinkableIngredient {
  name: string;
  nameEn?: string;
  slug: string;
  aliases?: string[]; // 別名・同義語
}

/**
 * リンク生成オプション
 */
export interface LinkGenerationOptions {
  baseUrl?: string; // ベースURL（デフォルト: /ingredients）
  excludeIngredients?: string[]; // リンク化しない成分名（現在表示中の成分など）
  maxLinksPerIngredient?: number; // 同一成分への最大リンク数（デフォルト: 2）
  linkClassName?: string; // リンクに付与するCSSクラス
  openInNewTab?: boolean; // 新しいタブで開くか
}

/**
 * テキスト内の成分名を検出してリンクに変換
 *
 * @param text - 対象テキスト
 * @param ingredients - リンク可能な成分リスト
 * @param options - オプション
 * @returns リンク挿入済みテキスト
 */
export function generateInternalLinks(
  text: string,
  ingredients: LinkableIngredient[],
  options: LinkGenerationOptions = {},
): string {
  const {
    baseUrl = "/ingredients",
    excludeIngredients = [],
    maxLinksPerIngredient = 2,
    linkClassName = "internal-link",
    openInNewTab = false,
  } = options;

  let result = text;
  const linkCounts = new Map<string, number>();

  // 除外成分をセットに変換（高速検索）
  const excludeSet = new Set(excludeIngredients.map((n) => n.toLowerCase()));

  // 成分名の長さで降順ソート（長い成分名を優先してマッチ）
  const sortedIngredients = [...ingredients].sort((a, b) => {
    const aMaxLength = Math.max(
      a.name.length,
      a.nameEn?.length || 0,
      ...(a.aliases?.map((alias) => alias.length) || []),
    );
    const bMaxLength = Math.max(
      b.name.length,
      b.nameEn?.length || 0,
      ...(b.aliases?.map((alias) => alias.length) || []),
    );
    return bMaxLength - aMaxLength;
  });

  for (const ingredient of sortedIngredients) {
    // 除外リストに含まれている場合はスキップ
    if (excludeSet.has(ingredient.name.toLowerCase())) {
      continue;
    }

    // 検索する名前のリスト（本名、英名、別名）
    const searchNames = [
      ingredient.name,
      ingredient.nameEn,
      ...(ingredient.aliases || []),
    ].filter((name): name is string => Boolean(name));

    for (const searchName of searchNames) {
      // すでに最大リンク数に達している場合はスキップ
      const currentCount = linkCounts.get(ingredient.slug) || 0;
      if (currentCount >= maxLinksPerIngredient) {
        break;
      }

      // 正規表現でマッチ（単語境界を考慮）
      // ただし、すでにリンク内に含まれている場合は除外
      const regex = new RegExp(
        `(?<!<a[^>]*>)(?<!<a[^>]*>[^<]*)(${escapeRegex(searchName)})(?![^<]*<\/a>)`,
        "g",
      );

      let matchCount = 0;
      result = result.replace(regex, (match) => {
        // 最大リンク数チェック
        if (matchCount >= maxLinksPerIngredient - currentCount) {
          return match; // そのまま返す（リンク化しない）
        }

        matchCount++;
        linkCounts.set(
          ingredient.slug,
          (linkCounts.get(ingredient.slug) || 0) + 1,
        );

        const url = `${baseUrl}/${ingredient.slug}`;
        const targetAttr = openInNewTab
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        const classAttr = linkClassName ? ` class="${linkClassName}"` : "";

        return `<a href="${url}"${classAttr}${targetAttr}>${match}</a>`;
      });
    }
  }

  return result;
}

/**
 * 正規表現の特殊文字をエスケープ
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Markdown内の成分名をリンクに変換
 * （コードブロックやリンク内は除外）
 */
export function generateInternalLinksInMarkdown(
  markdown: string,
  ingredients: LinkableIngredient[],
  options: LinkGenerationOptions = {},
): string {
  // コードブロック、インラインコード、既存リンクを一時的に置換
  const placeholders: { placeholder: string; original: string }[] = [];
  let counter = 0;

  // コードブロック（```）を保護
  let result = markdown.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${counter++}__`;
    placeholders.push({ placeholder, original: match });
    return placeholder;
  });

  // インラインコード（`）を保護
  result = result.replace(/`[^`]+`/g, (match) => {
    const placeholder = `__INLINE_CODE_${counter++}__`;
    placeholders.push({ placeholder, original: match });
    return placeholder;
  });

  // 既存のリンク（[text](url)）を保護
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `__LINK_${counter++}__`;
    placeholders.push({ placeholder, original: match });
    return placeholder;
  });

  // 内部リンク生成（Markdown形式）
  result = generateInternalLinksMarkdownFormat(result, ingredients, options);

  // プレースホルダーを元に戻す
  for (const { placeholder, original } of placeholders.reverse()) {
    result = result.replace(placeholder, original);
  }

  return result;
}

/**
 * Markdown形式でリンクを生成
 */
function generateInternalLinksMarkdownFormat(
  text: string,
  ingredients: LinkableIngredient[],
  options: LinkGenerationOptions = {},
): string {
  const {
    baseUrl = "/ingredients",
    excludeIngredients = [],
    maxLinksPerIngredient = 2,
  } = options;

  let result = text;
  const linkCounts = new Map<string, number>();

  const excludeSet = new Set(excludeIngredients.map((n) => n.toLowerCase()));

  const sortedIngredients = [...ingredients].sort((a, b) => {
    const aMaxLength = Math.max(
      a.name.length,
      a.nameEn?.length || 0,
      ...(a.aliases?.map((alias) => alias.length) || []),
    );
    const bMaxLength = Math.max(
      b.name.length,
      b.nameEn?.length || 0,
      ...(b.aliases?.map((alias) => alias.length) || []),
    );
    return bMaxLength - aMaxLength;
  });

  for (const ingredient of sortedIngredients) {
    if (excludeSet.has(ingredient.name.toLowerCase())) {
      continue;
    }

    const searchNames = [
      ingredient.name,
      ingredient.nameEn,
      ...(ingredient.aliases || []),
    ].filter((name): name is string => Boolean(name));

    for (const searchName of searchNames) {
      const currentCount = linkCounts.get(ingredient.slug) || 0;
      if (currentCount >= maxLinksPerIngredient) {
        break;
      }

      // 日本語対応のため単語境界を使わない
      const regex = new RegExp(`(${escapeRegex(searchName)})`, "g");

      let matchCount = 0;
      result = result.replace(regex, (match) => {
        if (matchCount >= maxLinksPerIngredient - currentCount) {
          return match;
        }

        matchCount++;
        linkCounts.set(
          ingredient.slug,
          (linkCounts.get(ingredient.slug) || 0) + 1,
        );

        const url = `${baseUrl}/${ingredient.slug}`;
        return `[${match}](${url})`;
      });
    }
  }

  return result;
}

/**
 * 関連成分を提案
 * テキスト内に出現する成分を検出し、リンク候補として返す
 */
export function suggestRelatedIngredients(
  text: string,
  allIngredients: LinkableIngredient[],
  currentIngredient?: string,
): LinkableIngredient[] {
  const mentioned: LinkableIngredient[] = [];

  for (const ingredient of allIngredients) {
    // 現在の成分は除外
    if (currentIngredient && ingredient.name === currentIngredient) {
      continue;
    }

    const searchNames = [
      ingredient.name,
      ingredient.nameEn,
      ...(ingredient.aliases || []),
    ].filter((name): name is string => Boolean(name));

    for (const searchName of searchNames) {
      if (text.includes(searchName)) {
        mentioned.push(ingredient);
        break; // 1つでもマッチしたらこの成分は追加済み
      }
    }
  }

  return mentioned;
}

/**
 * テキスト内のリンク数をカウント
 */
export function countLinks(text: string): number {
  // HTMLリンク
  const htmlLinks = (text.match(/<a\s+[^>]*href=/gi) || []).length;
  // Markdownリンク
  const markdownLinks = (text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;

  return htmlLinks + markdownLinks;
}

/**
 * リンク密度を計算（SEO指標）
 * リンク数 / 総単語数
 */
export function calculateLinkDensity(text: string): number {
  const linkCount = countLinks(text);
  const wordCount = text.split(/\s+/).length;

  if (wordCount === 0) return 0;

  return linkCount / wordCount;
}
