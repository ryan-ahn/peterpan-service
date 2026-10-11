import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { createTV } from "tailwind-variants";

const fontSizes = [
  "1",
  "2",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
];

const steps = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => String(index + 1));

const twMergeConfig = {
  extend: {
    theme: {
      text: fontSizes,
      leading: steps(40),
      tracking: steps(20),
    },
  },
};

const twMerge = extendTailwindMerge(twMergeConfig);

const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

const tv = createTV({ twMergeConfig });

export default cn;
export { tv };
