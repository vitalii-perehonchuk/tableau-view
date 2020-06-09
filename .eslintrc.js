module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:unicorn/recommended',
    'plugin:array-func/all',
    'plugin:eslint-comments/recommended',
    'plugin:jest/all',
    'plugin:lodash/recommended',
    '@vue/prettier',
  ],
  overrides: [
    {
      env: {
        jest: true,
      },
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
    parser: 'babel-eslint',
  },
  plugins: [
    'import',
    'unicorn',
    'array-func',
    'eslint-comments',
    'jest',
    'lodash',
  ],
  root: true,
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'unicorn/filename-case': [
      'warn',
      {
        cases: {
          camelCase: true,
          kebabCase: true,
          pascalCase: true,
        },
      },
    ],
    'unicorn/prefer-spread': 'off',
    'unicorn/no-useless-undefined': 'off',
  },
};
