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
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
};

export default config;
