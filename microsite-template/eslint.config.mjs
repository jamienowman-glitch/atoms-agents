import { defineConfig, globalIgnores } from "eslint/config";
// @ts-ignore
import nextVitals from "eslint-config-next/core-web-vitals.js";
// @ts-ignore
import nextTs from "eslint-config-next/typescript.js";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
