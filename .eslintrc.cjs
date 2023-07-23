module.exports = {
    ignorePatterns: [
        "public/js/bootstrap/**/*",
        "public/js/jquery/**/*",
        "public/js/plugins/**/*",
        "public/js/active.js",
    ],
    env: {
        browser: true,
        es2021: true,
        jquery: true,
    },
    extends: ["eslint:recommended", "jquery"],
    parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single']
    },
}
