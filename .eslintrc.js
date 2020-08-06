module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:vue/essential', 'plugin:vue/recommended'],
  rules: {
    'no-console':
      process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ['TemplateLiteral'],
      },
    ],
    'template-curly-spacing': 0,
    'no-param-reassign': ['error', { props: false }],
    'max-len': [
      2,
      100,
      2,
      { ignorePattern: 'd="([\\s\\S]*?)"', ignoreStrings: true, ignoreTemplateLiterals: true },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
