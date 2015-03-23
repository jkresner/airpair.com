var path = require('path');

var cfg = {
  path: {
    publicDir: path.resolve('public'),
    public: 'public/**',
    builtJS: '/static/js',
    builtCss: '/static/styles',
    less: 'public/styles/*.{css,less}',
    devWatch: [
      'server/views/**', //views
      './public/static/js/**/*.{js}',//devJS:
      './public/static/js/**/*.{css}',//devCSS:
    ],
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


module.exports = cfg
