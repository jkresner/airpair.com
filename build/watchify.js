var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  merge = require('merge-stream'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  config = require('./config');

var applyBundleTransforms = require('./bundler').applyBundleTransforms;

function watchifyer(fileName)
{
  var bundler = watchify(browserify('./public/common/'+fileName, watchify.args));
  applyBundleTransforms(bundler)
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error')) // log errors if they happen
      .pipe(source(fileName))
      .pipe(gulp.dest('./public/v1/js'));
  }

  return rebundle();

}

module.exports = function() {
  return merge(config.jsBundles.map(watchifyer));
};

