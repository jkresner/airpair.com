var nodemon = require('gulp-nodemon');

module.exports = () =>
  nodemon({
      script: 'bootstrap.js',
      ext: 'hbs js',
      ignore: ['public/*','ang/*','test/*','dist/*','node_modules/*'],
      tasks: ['lint']
    })
    .on('restart', function () {
      console.log('>> node restart');
    })
