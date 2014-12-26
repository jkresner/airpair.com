var
  gulp = require('gulp'),
  merge = require('merge-stream'),
  bundler = require('./bundler'),
  rev = require('gulp-rev'),
  config = require('./config'),
  less = require('gulp-less'),
  minifyCSS = require('gulp-minify-css'),
  addSrc = require('gulp-add-src');

function lessBundler() {
  return gulp.src(config.styleBundles, {base: config.path.publicDir})
    .pipe(less())
    .pipe(addSrc(config.styleLib, {base: config.path.publicDir}))
    .pipe(minifyCSS())
}

module.exports = () =>
  merge(
    config.jsBundles.map(bundler),
    lessBundler()
  )
    .pipe(rev())
    .pipe(gulp.dest('./dist/static'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'))
