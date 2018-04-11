module.exports = {
    "extends": [
        "eslint:recommended",
        "prettier"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "modules": true
        },
        "experimentalDecorators": true
    },
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest/globals": true
     },
    "rules": {
        "linebreak-style": 0,
        "object-curly-spacing": ["error", "always"],
        "no-trailing-spaces": "error",
        "keyword-spacing": "error",
        "no-extra-semi": "error",
        "semi": ["error", "always"],
        "quotes": ["error", "single", { "allowTemplateLiterals": true }]
    },
    "plugins": ["jest"]
};