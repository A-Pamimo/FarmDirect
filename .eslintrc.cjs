module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  env: {
    es2021: true,
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
    },
    {
      files: ['apps/api/**/*.ts'],
      env: {
        node: true,
      },
    },
  ],
};
