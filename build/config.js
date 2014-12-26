var path = require('path');

module.exports = {
  path: {
    publicDir: path.resolve('public'),
    public: 'public/**',
    less: 'public/styles/*.{css,less}',
    views: 'server/views/**',
    devAssets: './public/**/*.{css,html,js}',
    builtJS: '/static/js',
    builtCss: '/static/styles'
  },
  jsBundles: ['index.js', 'adm.js', 'home.js'],
  styleBundles: [
    'public/styles/index.less',
    'public/styles/adm.less',
    'public/styles/libs.less'
  ],
  styleLib: 'public/styles/libs.css',
  livereload: { port: 35729 }
}
