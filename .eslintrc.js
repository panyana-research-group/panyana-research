module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ["prettier/standard", "plugin:vue/recommended"],
  plugins: ["html", "vue", "import", "promise"],
  rules: {
    "semi": ["warn", "never"],
    "space-before-function-paren": "off",
    "no-unused-vars": "warn",
    "no-debugger": "off",
    "no-unused-expressions": "warn",
    "vue/require-v-for-keys": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": [
      "warn",
      {
        singleline: 5,
        multiline: {
          allowFirstLine: true
        }
      }
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}
