import { extractText, getDocumentProxy } from "unpdf";

import { type BylawOutline, parseBylawOutline } from "./bylawOutline";

/**
 * 정관 PDF의 글자 층을 읽어 목차로 바꾼다. 글자 층이 없는 스캔 PDF는 null.
 */
export const extractBylawOutline = async (
  bytes: Uint8Array,
): Promise<BylawOutline | null> => {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: true });
  return parseBylawOutline(text);
};
