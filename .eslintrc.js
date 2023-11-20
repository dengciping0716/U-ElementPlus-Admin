// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    './packages/.eslintrc-auto-import.json'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  rules: {
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //
    'one-var': 'off',
    'no-tabs': 'off',
    'prefer-const': 'off',
    'no-unused-vars': 'off',
  },
  globals: {
    $: true,
    moment: true,
    _: true,
    jsonStr: true,
    jsonClear: true,
    echarts: true,
    BMap: true,
    BMapLib: true,
    LODOP: true,
    __APP_INFO__: true,
  },
};
