# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## eslint + prettier 설정

### 패키지 설치

```
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-import eslint-plugin-simple-import-sort

```

### ESLint 설정 (eslint.config.js 예시)

```
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

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
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Import 정렬
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // import 관련 기본 권장 규칙
      'import/order': 'off', // 충돌 방지: 대신 simple-import-sort 사용
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
    },
  },
);
```

### 3. Prettier 설정 (.prettierrc 예시)

```
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 100,
  "trailingComma": "all",
  "arrowParens": "avoid"
}
```

### 4. 실행 스크립트 추가

```
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write ."
  }
}
```

### 5. VSCode 추천 설정 (선택)

```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.organizeImports": "never"
  }
}

```
