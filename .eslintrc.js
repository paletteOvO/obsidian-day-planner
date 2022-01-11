module.exports = {
   parser: "@typescript-eslint/parser",
   parserOptions: {
      project: [
         "./tsconfig.json",
      ],
      tsconfigRootDir: __dirname,
      ecmaVersion: 6,
      sourceType: "module",
      ecmaFeatures: {
         modules: true,
      },
   },
   env: {
      browser: true,
      es6: true,
   },
   plugins: ["@typescript-eslint", "prettier"],
   extends: ["eslint:recommended"],
   rules: {
      // 排板
      indent: "off",
      "brace-style": "off",
      camelcase: "off",
      "prettier/prettier": ["warn"],
      "sort-imports": [
         "error",
         {
            ignoreCase: false,
            ignoreDeclarationSort: false,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
         },
      ],
      // 禁止使用 var
      "no-var": "error",
      // 禁止一次宣告多個變量
      "one-var": ["error", "never"],
      // 建議使用 const
      "prefer-const": "warn",
      // 需 先宣告 後使用
      "no-undef": "error",
      "no-use-before-define": [
         "error",
         { functions: true, classes: true, variables: true },
      ],
      // 變量未使用
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
         "warn",
         {
            vars: "all",
            args: "none",
            ignoreRestSiblings: false,
            caughtErrors: "none",
            varsIgnorePattern: "^_",
         },
      ],
      // 對參數賦值
      "no-param-reassign": "error",
      // 循環條件未修改過
      "no-unmodified-loop-condition": "warn",
      // 對自已比較 (沒有意義)
      "no-self-compare": "warn",
      // 禁止亂用this
      "no-invalid-this": "error",
      // 重新賦值函數 (但 (const f = () => {}) 不香嗎 )
      "no-func-assign": "error",
      // 重复导入模块
      "no-duplicate-imports": "error",
      // 空代碼塊
      "no-empty": "warn",

      // 一起來用表達式函數吧 // const f = () => {}
      "func-style": ["warn", "expression", { allowArrowFunctions: true }],
      "prefer-arrow-callback": ["warn"],
      // switch 裡宣告變量
      "no-case-declarations": "warn",
      // 常量重賦值
      "no-const-assign": "error",

      // 註釋空格
      "spaced-comment": [
         "warn",
         "always",
         {
            block: {
               exceptions: ["*"],
               balanced: true,
            },
         },
      ],

      // 所有條件語句都要 {}
      curly: ["error", "multi-line"],

      // for in 裡要有 if
      "guard-for-in": "warn",

      // function override
      "no-dupe-class-members": "off",

      "no-constant-condition": ["error", { checkLoops: false }],

      // annoying false positive
      "no-undef": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",

      // as ASI is always present, and always cause problem if you don't understand it
      semi: "off",
   },
}
