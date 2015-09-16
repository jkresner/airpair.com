var nodemon = require('gulp-nodemon')

module.exports = function(gulp, config, options, callback) {

  return function() {
    nodemon({
        restartable: false,
        // stdout: false,
        // stdin: false,
        // verbose: true,
        script: './bootstrap.js',
        ext: 'js hbs',
        ignore: [
          ".git",         // lol 6000 hidden .git files!
          'ang/*',
          'build/*',
          'dist/*',
          'node_modules/*',
          'public/*',
          'test/*',
          '.bowerrc',
          '.editorconfig',
          '.gitignore',
          'bower.json',
          'gulpfile.js',
          'package.json',
          'Procfile',
          'REAME.md',
          '*DS_Store'
        ],
        env: { NODE_ENV: "development" },
        execMap: {
          js: 'node --harmony_destructuring'
        }
      })
      .on('change', ['lint'])
      .on('restart', function () {
        // console.log('>> node restart')
      })

    callback()
  }

}
