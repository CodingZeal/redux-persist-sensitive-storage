module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint", 
    "plugin:prettier/recommended"
  ],
  root: true,
  rules: {
   "@typescript-eslint/explicit-module-boundary-types": "off"
  }
};
