/** @type {import("prettier").Config} */
const config = {
  arrowParens: "avoid",
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: "lf",
  printWidth: 80,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^(react|react-dom)$",
    "^next(/.*)?$",
    "<THIRD_PARTY_MODULES>",
    "^@repo/(.*)$",
    "^@(app|assets|components|constants|lib)(/.*)?$",
    "^@/(.*)$",
    "^(\\./|\\.\\./).*$",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindStylesheet: "./apps/peterpan-website/app/globals.css",
  tailwindFunctions: ["tv", "cn"],
};

export default config;
