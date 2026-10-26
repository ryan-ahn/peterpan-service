/**
 * 정관 글에서 장·조 목차와 조문을 뽑는다. 장·조를 못 찾으면 null.
 * PDF 읽기는 `./bylawPdf`에 있다 (웹사이트 번들에 PDF 라이브러리를 넣지 않으려고).
 */

/**
 * constants
 */
const CHAPTER_PATTERN = /^제\s*(\d+)\s*장\s+(.+)$/;

const ADDENDA_PATTERN = /^부\s*칙$/;

const ARTICLE_PATTERN =
  /^제\s*(\d+)\s*조(?:\s*의\s*(\d+))?\s*\(([^)]+)\)\s*(.*)$/;

const PARAGRAPH_START_PATTERN = /^([①-⑳]|\d+\.\s)/;

const SIGNATURE_PATTERN = /^\d{4}\s*년\s*\d{1,2}\s*월\s*\d{1,2}\s*일$/;

/**
 * types
 */
export type BylawArticle = {
  number: string;
  title: string;
  paragraphs: string[];
};

export type BylawChapter = {
  title: string;
  articles: BylawArticle[];
};

export type BylawOutline = {
  chapters: BylawChapter[];
};

/**
 * utils
 */
export const parseBylawOutline = (text: string): BylawOutline | null => {
  const chapters: BylawChapter[] = [];
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
  for (const line of lines) {
    if (SIGNATURE_PATTERN.test(line)) {
      break;
    }
    const chapter = line.match(CHAPTER_PATTERN);
    if (chapter) {
      chapters.push({
        title: `제${chapter[1]}장 ${tidy(chapter[2] ?? "")}`,
        articles: [],
      });
      continue;
    }
    if (ADDENDA_PATTERN.test(line)) {
      chapters.push({ title: "부칙", articles: [] });
      continue;
    }
    const current = chapters.at(-1);
    if (!current) {
      continue;
    }
    const article = line.match(ARTICLE_PATTERN);
    if (article) {
      const [, number, branch, title, rest] = article;
      current.articles.push({
        number: branch ? `제${number}조의${branch}` : `제${number}조`,
        title: tidy(title ?? ""),
        paragraphs: rest ? [tidy(rest)] : [],
      });
      continue;
    }
    const target = current.articles.at(-1);
    if (!target) {
      continue;
    }
    const last = target.paragraphs.length - 1;
    if (last < 0 || PARAGRAPH_START_PATTERN.test(line)) {
      target.paragraphs.push(tidy(line));
      continue;
    }
    target.paragraphs[last] = `${target.paragraphs[last]} ${tidy(line)}`;
  }
  const filled = chapters.filter(chapter => chapter.articles.length > 0);
  return filled.length > 0 ? { chapters: filled } : null;
};

export const readBylawOutline = (value: unknown): BylawOutline | null => {
  if (!value || typeof value !== "object" || !("chapters" in value)) {
    return null;
  }
  const { chapters } = value as { chapters: unknown };
  return Array.isArray(chapters) && chapters.length > 0
    ? (value as BylawOutline)
    : null;
};

const tidy = (value: string) =>
  value
    .replace(/제 (\d)/g, "제$1")
    .replace(/(\d) (?=[가-힣])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
