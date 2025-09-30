import js from "@eslint/js";
import mochaPlugin from "eslint-plugin-mocha";
import prettierPlugin from "eslint-plugin-prettier";
import nodePlugin from "eslint-plugin-node";

export default [
  {
    ignores: [
        "node_modules/**", 
        "mochawesome-report/**", 
        ".vscode/**",
        "eslint.config.js",
        "*.log"]
  },
  {
    languageOptions: {
    globals: {
      global: "readonly"
    }
  }
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "mochawesome-report/**", ".vscode/**", "*.log", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        global: "readonly"
      }
    },
    plugins: {
      mocha: mochaPlugin,
      prettier: prettierPlugin,
      node: nodePlugin
    },
    rules: {
      "no-unused-vars": ["warn"],
      "no-console": "off",
      "mocha/no-exclusive-tests": "error",
      "node/no-unsupported-features/es-syntax": [
        "error",
        { ignores: ["modules"] }
      ],
      "prettier/prettier": "warn",
    }
  },
  {
    files: ["tests/specs/**/*.js"],
    rules: {
      "func-names": "off"
    }
  }
];
