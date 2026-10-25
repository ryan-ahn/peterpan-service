import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import twMergeConfig from "./twMergeConfig";

/**
 * constants
 */
const twMerge = extendTailwindMerge(twMergeConfig);

/**
 * 클래스 조합. 뒤에 온 Tailwind 클래스가 같은 속성의 앞 클래스를 이긴다.
 */
const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export default cn;
