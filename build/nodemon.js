var nodemon = require('gulp-nodemon');

module.exports = () =>
  nodemon({ script: 'bootstrap.js', ext: 'html js',
      ignore: ['public/*','test/*','dist/*','node_modules/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node restart');
    })
