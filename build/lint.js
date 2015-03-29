var gulp = require('gulp'),
    jshint = require('gulp-jshint');

module.exports = function() {
  return gulp.src('./**/*.js')
    .pipe(jshint())
}
