module.exports = {
    ignorePatterns: [
        "public/js/bootstrap",
        "public/js/jquery",
        "public/js/plugins",
    ],
    env: {
        browser: true,
        node: true,
        es2021: true,
        jquery: true,
    },
    extends: ["eslint:recommended"],
    plugins: [ "html", "@html-eslint" ],
    overrides: [
        {
            files: ["*.html"],
            parser: "@html-eslint/parser",
            extends: ["plugin:@html-eslint/recommended"],
            rules: {
                "@html-eslint/indent": ["error", 2],
                "@html-eslint/require-doctype": "off",
            },
        },
    ],
    parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false
        }],
        "no-var": "error",
        "space-in-parens": ["error", "never"],
        "array-bracket-spacing": ["error", "never"],
        "space-before-blocks": ["error", "always"],
        "space-before-function-paren": ["error", "never"]
    },
}
