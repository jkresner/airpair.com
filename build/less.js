var path = require('path'),
  gulp = require('gulp'),
  less = require('gulp-less'),
  config = require('./config');

module.exports = function () {
  return gulp.src(config.styleBundles)
    .pipe(less({
      paths: [ path.join(__dirname, 'styles') ]
    }))
    .pipe(gulp.dest('./public/v1/css'));
}
