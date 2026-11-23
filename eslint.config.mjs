import { defineConfig, globalIgnores } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";
import nextParser from "eslint-config-next/parser";

const clientServerBoundaryPlugin = {
  rules: {
    "no-lib-server-in-client": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow importing lib/server from files marked with 'use client'",
        },
        schema: [],
        messages: {
          forbidden:
            "Client components/modules must not import '@/lib/server/*'. Move data access to server components, actions, or route handlers.",
        },
      },
      create(context) {
        const source = context.sourceCode.getText();
        const isClient = /^\s*["']use client["']/.test(source);
        if (!isClient) return {};
        function check(node, value) {
          if (typeof value !== "string") return;
          if (
            value.startsWith("@/lib/server") ||
            value.startsWith("@lib/server")
          ) {
            context.report({ node, messageId: "forbidden" });
          }
        }
        return {
          ImportDeclaration(node) {
            check(node.source, node.source.value);
          },
          ImportExpression(node) {
            if (node.source?.type === "Literal")
              check(node.source, node.source.value);
          },
          CallExpression(node) {
            if (
              node.callee.type === "Identifier" &&
              node.callee.name === "require" &&
              node.arguments[0]?.type === "Literal"
            ) {
              check(node.arguments[0], node.arguments[0].value);
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  {
    name: "next/core-web-vitals-compat",
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      "react-hooks": reactHooksPlugin,
      import: fixupPluginRules(importPlugin),
      "jsx-a11y": fixupPluginRules(jsxA11yPlugin),
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: nextParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: "module",
        allowImportExportEverywhere: true,
        babelOptions: {
          presets: ["next/babel"],
          caller: { supportsTopLevelAwait: true },
        },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: "detect" },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".mts", ".cts", ".tsx", ".d.ts"],
      },
      "import/resolver": {
        [import.meta.resolve("eslint-import-resolver-node").replace("file:///", "")]: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        [import.meta.resolve("eslint-import-resolver-typescript").replace("file:///", "")]: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/jsx-no-target-blank": "off",
    },
  },
  {
    name: "fms/vendor-layer",
    ignores: ["components/ai-elements/**"],
  },
  {
    name: "fms/generated-primitives",
    files: ["components/ui/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    name: "fms/component-boundaries",
    plugins: {
      fms: clientServerBoundaryPlugin,
    },
    rules: {
      "fms/no-lib-server-in-client": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components/index",
                "@/components/index.ts",
                "@/components",
              ],
              message:
                "Do not import the root components barrel. Import from a specific category or component.",
            },
          ],
        },
      ],
    },
  },
  {
    name: "fms/ui-boundaries",
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components/layout/*",
                "@/components/shell/*",
                "@/components/domain/*",
                "@/components/dashboard/*",
                "@/components/widgets/*",
                "@/lib/server/*",
                "@lib/server/*",
              ],
              message:
                "UI primitives may not import higher-level components or server modules.",
            },
          ],
        },
      ],
    },
  },
  {
    name: "fms/chart-boundaries",
    files: ["components/chart/**/*.{ts,tsx}", "components/charts/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components/domain/*",
                "@/lib/server/*",
                "@lib/server/*",
              ],
              message:
                "Chart components must not import domain or server modules.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
