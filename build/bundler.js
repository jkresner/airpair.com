var
  source = require('vinyl-source-stream2'),
  buffer = require('gulp-buffer'),
  es6ify = require('es6ify'),
  stringify = require('stringify'),
  browserify = require('browserify'),
  annotate = require('browserify-ngannotate'),
  uglify = require('gulp-uglify'),
  config = require('./config');

function applyBundleTransforms(bundler) {
  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify.configure(/^(?!.*lib)+.+\.js$/));
  bundler.transform(annotate);
}

module.exports = function(fileName) {
  var bundler = browserify('./ang/'+fileName);

  applyBundleTransforms(bundler);

  return bundler.bundle()
    .pipe(source({
      path: `public/js/${fileName}`,
      base: config.path.publicDir
    }))
    .pipe(buffer())
    .pipe(uglify());
};

module.exports.applyBundleTransforms = applyBundleTransforms;
