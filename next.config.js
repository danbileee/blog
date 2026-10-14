const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => ({
  webpack(config, { webpack, isServer }) {
    if (isServer)
      config.plugins.push(
        new webpack.DefinePlugin({
          LOCAL_DEVELOPMENT_PHASE: JSON.stringify(phase === PHASE_DEVELOPMENT_SERVER),
        }),
      );
    return config;
  },
  async redirects() {
    return [
      { source: '/about', destination: '/ko/career', permanent: true },
      { source: '/career', destination: '/ko/career', permanent: true },
      { source: '/blog', destination: '/ko/blog', permanent: true },
      { source: '/blog/:slug', destination: '/ko/blog/:slug', permanent: true },
    ];
  },
  async headers() {
    return ['/rss.xml', '/en/rss.xml', '/ja/rss.xml'].map((source) => ({
      source,
      headers: [{ key: 'Content-Type', value: 'application/rss+xml; charset=utf-8' }],
    }));
  },
  images: {
    domains: [
      'cdn0.iconfinder.com',
      'cdn2.iconfinder.com',
      'cdn4.iconfinder.com',
      'blog.kakaocdn.net',
      'imagedelivery.net',
      'assets.furigana.app',
    ],
    deviceSizes: [600, 1080, 1920],
  },
});
