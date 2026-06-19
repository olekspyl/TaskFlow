import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import eslint from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    ignores: ['**/*.d.ts', '**/coverage', '**/dist', '*.config.ts', '*.config.mjs', '*.config.js'],
  },
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      style: stylistic,
      import: importPlugin,
    },
    rules: {
      // Stylistic rules for formatting
      'style/max-len': [
        'error',
        {
          code: 100,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],
      'style/indent': ['error', 2, { SwitchCase: 1 }],
      'style/semi': ['error', 'always'],
      'style/semi-style': ['error', 'last'],
      'style/quotes': ['error', 'double', { allowTemplateLiterals: 'always', avoidEscape: true }],
      'style/quote-props': ['error', 'as-needed'],
      'style/comma-dangle': ['error', 'always-multiline'],
      'style/comma-style': ['error', 'last'],
      'style/comma-spacing': ['error', { before: false, after: true }],

      // Object and array formatting with equal spacing
      'style/object-curly-spacing': ['error', 'always'],
      'style/object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true, consistent: true },
          ImportDeclaration: { multiline: true, consistent: true },
          ExportDeclaration: { multiline: true, consistent: true },
        },
      ],
      'style/array-bracket-spacing': ['error', 'never'],
      'style/array-bracket-newline': ['error', { multiline: true, minItems: 3 }],
      'style/array-element-newline': ['error', { multiline: true, minItems: 3 }],

      // Import/export formatting - this fixes the {ref } spacing issue
      'style/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'style/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],

      // Function and arrow function formatting
      'style/arrow-parens': ['error', 'always'],
      'style/arrow-spacing': ['error', { before: true, after: true }],
      'style/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'style/function-call-spacing': ['error', 'never'],
      'style/space-in-parens': ['error', 'never'],

      // General spacing rules
      'style/space-before-blocks': ['error', 'always'],
      'style/space-infix-ops': ['error'],
      'style/space-unary-ops': ['error', { words: true, nonwords: false }],
      'style/keyword-spacing': ['error', { before: true, after: true }],
      'style/no-trailing-spaces': ['error'],
      'style/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
      'style/eol-last': ['error', 'always'],

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      'no-return-await': 'error',
      'require-await': 'error',

      // Import ordering and formatting
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], 'unknown'],
          pathGroups: [
            {
              pattern: '(@/store/**)|(@/types/**)|(@/utils/**)',
              group: 'unknown',
            },
            {
              pattern: '@/views/**',
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '@/components/**',
              group: 'unknown',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
        },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      style: stylistic,
      import: importPlugin,
    },
    rules: {
      // Vue specific rules
      'vue/script-setup-uses-vars': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/html-indent': ['error', 2],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 1 },
          multiline: { max: 1 },
        },
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below',
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'never', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
      'vue/v-bind-style': ['error', 'shorthand'],
      'vue/v-on-style': ['error', 'shorthand'],

      // Same stylistic rules as for TS/JS files
      'style/max-len': [
        'error',
        {
          code: 100,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],
      'style/indent': ['error', 2, { SwitchCase: 1 }],
      'style/semi': ['error', 'always'],
      'style/quotes': ['error', 'double', { allowTemplateLiterals: 'always', avoidEscape: true }],
      'style/comma-dangle': ['error', 'always-multiline'],
      'style/object-curly-spacing': ['error', 'always'],
      'style/array-bracket-spacing': ['error', 'never'],
      'style/space-in-parens': ['error', 'never'],
      'style/no-trailing-spaces': ['error'],
      'style/eol-last': ['error', 'always'],

      // TypeScript rules for Vue files
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Import rules for Vue files
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], 'unknown'],
          pathGroups: [
            {
              pattern: '(@/store/**)|(@/types/**)|(@/utils/**)',
              group: 'unknown',
            },
            {
              pattern: '@/views/**',
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '@/components/**',
              group: 'unknown',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
        },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'error',
    },
  },
]
