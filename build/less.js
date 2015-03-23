var path = require('path'),
  gulp = require('gulp'),
  less = require('gulp-less'),
  config = require('./config');

module.exports = function () {
  var pathsForImports = [ __dirname.replace('build','public/styles') ]

  return gulp.src(config.styleBundles)
    .pipe(less({
      paths: pathsForImports
    }))
    .pipe(gulp.dest(`./public/${config.path.builtCss}`));
}
