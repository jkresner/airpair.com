var nodemon = require('gulp-nodemon');

module.exports = () =>
  nodemon({ script: 'test/bootstrap.js', ext: 'html js',
      ignore: ['public/*','ang/*','dist/*','node_modules/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node test restart');
    })
