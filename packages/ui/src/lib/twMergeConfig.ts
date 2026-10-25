/**
 * constants
 */
const steps = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => String(index + 1));

/**
 * tokens.css에 새로 등록한 이름을 tailwind-merge에 알린다.
 * 등록하지 않으면 `text-14`를 글자색으로 보고 충돌 정리를 못 한다.
 */
const twMergeConfig = {
  extend: {
    theme: {
      text: [...steps(33), "3.5", "4.5"],
      leading: steps(40),
      tracking: [...steps(20), "caps", "caps-wide"],
      radius: [
        "tiny",
        "small",
        "medium",
        "large",
        "xlarge",
        "sheet",
        "2xlarge",
        "3xlarge",
        "full",
      ],
      shadow: ["small", "medium", "large"],
    },
  },
};

export default twMergeConfig;
