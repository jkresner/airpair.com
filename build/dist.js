var
  gulp = require('gulp'),
  merge = require('merge-stream'),
  bundler = require('./bundler'),
  rev = require('gulp-rev'),
  config = require('./config');

module.exports = () =>
  merge(config.jsBundles.map(bundler))
    .pipe(rev())
    .pipe(gulp.dest('./dist/v1/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'))
