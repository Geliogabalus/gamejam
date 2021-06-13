module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./src/client/tsconfig.json",
    },
    extends: [
        "airbnb-typescript/base"
    ],
    rules: {
        "import/prefer-default-export": 0,
        "max-len": ["error", { "code": 500 }],
        "class-methods-use-this": 0,
        "no-param-reassign": 0,
        "no-continue": 0
    },
    ignorePatterns: ["webpack.dev.js", "webpack.prod.js", ".eslintrc.js"],
};
