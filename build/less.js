module.exports = function(gulp, config, options, callback) {

  return function() {
    var less = require('gulp-less')

    var pathsForImports = [ config.path.lessDir ]

    var section = options ? options.section : 'all'

    // console.log('less', section,
    //   config.path.lessSrc[section],
    //   config.path.builtCss)

    return gulp.src(config.path.lessSrc[section])
      .pipe(less({paths: pathsForImports}))
      .on('error', gulp.printErr('LESS', callback))
      .pipe(gulp.dest(config.path.builtCss))
      .on('end', callback)
  }

}
