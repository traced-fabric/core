import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'lib',

  stylistic: {
    semi: true,
  },

  typescript: true,

  rules: {
    'antfu/if-newline': 'off',

    'ts/consistent-type-definitions': ['error', 'type'],

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
});
