import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unknown-property': ['error', {
        ignore: ['object', 'position', 'intensity', 'castShadow', 'args', 'attach'],
      }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'object-curly-spacing': ['error', 'always'],
      'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],
      'comma-dangle': ['error', 'only-multiline'],
      'indent': ['error', 2, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] }],
      'arrow-parens': ['error', 'as-needed'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  }
);
