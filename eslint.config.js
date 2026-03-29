import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['skills/**/*.ts'],
    rules: {
      // Allow bare `_` as an intentional unused placeholder (per project convention)
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_$' }],
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.flow/**'],
  },
)
