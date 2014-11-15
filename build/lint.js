var gulp = require('gulp'),
    jshint = require('gulp-jshint');

module.exports = () =>
  gulp.src('./**/*.js')
    .pipe(jshint())
