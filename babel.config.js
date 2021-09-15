module.exports = {
  presets: [
    'next/babel',
    '@babel/preset-env',
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
  ],
  plugins: ['@emotion', '@babel/plugin-transform-runtime'],
};
