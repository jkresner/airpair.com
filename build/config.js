var path = require('path');

module.exports = {
  path: {
    publicDir: path.resolve('public'),
    public: 'public/**',
    less: 'public/less/*.+(less|css)',
    views: 'server/views/**',
    devAssets: './public/**/*.{css,html,js}',
    builtJS: '/v1/js',
    builtCss: '/v1/styles'
  },
  jsBundles: ['index.js', 'adm.js'],
  styleBundles: ['public/styles/index.less','public/styles/adm.less'],
  styleLib: 'public/styles/libs.css',
  livereload: { port: 35729 }
}
