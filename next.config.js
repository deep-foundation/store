const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: '/store',
  assetPrefix: isProd ? 'https://cdn.statically.io/gh/deepcase/deepcase.github.io/gh-pages/' : '',
};
