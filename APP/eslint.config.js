// eslint.config.js
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.vscode/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      'prettier/prettier': 0, // Desativa os erros do Prettier
      'react/react-in-jsx-scope': 0, // Desativa a necessidade de importar React em JSX (React 17+)
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.ts', '.tsx', '.jsx'] }],
      'react/no-array-index-key': 0, // Desativa a regra que proíbe o uso de índices como key
      'no-use-before-define': 0, // Desativa a regra de usar variáveis antes de defini-las
      'no-unused-vars': 0, // Desativa avisos para variáveis não usadas
      'no-undef': 1, // Aviso para variáveis não definidas
      'no-const-assign': 1, // Aviso para atribuições a constantes
      'react/prop-types': 0, // Desativa a exigência de prop-types
      'react/jsx-key': 0, // Desativa a exigência de keys nos elementos JSX
      indent: 0, // Desativa a regra de indentação
      'react-hooks/exhaustive-deps': 0, // Desativa a verificação de dependências de hooks
      'no-case-declarations': 0, // Permite declarações dentro de cases
      'import/extensions': [
        'off',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],
      'no-extra-boolean-cast': 0, // Desativa avisos para casts booleanos extras
      'react/no-unknown-property': 0, // Desativa avisos para propriedades JSX desconhecidas
      'import/no-named-as-default': 0, // Desativa aviso para exportações como default e named
      'react/display-name': 0 // Desativa avisos para a falta de nomes de display nos componentes
    }
  },
  prettier // Integração com Prettier para evitar conflitos de formatação
]
