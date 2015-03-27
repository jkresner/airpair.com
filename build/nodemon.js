var nodemon = require('gulp-nodemon');

module.exports = () =>
  nodemon({
      script: './bootstrap.js',
      ext: 'js hbs',
      ignore: ['public/*','ang/*','test/*','dist/*','node_modules/*']
    })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node restart')
    })
