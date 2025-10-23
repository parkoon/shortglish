import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier, // prettier 설정은 항상 마지막에
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import 정렬
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // import 관련 기본 권장 규칙
      'import/order': 'off', // 충돌 방지: 대신 simple-import-sort 사용
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
    },
  },
)
