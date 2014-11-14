var
  source = require('vinyl-source-stream'),
  buffer = require('gulp-buffer'),
  es6ify = require('es6ify'),
  stringify = require('stringify'),
  browserify = require('browserify'),
  uglifyify = require('uglifyify'),
  annotate = require('browserify-ngannotate');

function applyBundleTransforms(bundler) {
  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify.configure(/^(?!.*lib)+.+\.js$/));
  bundler.transform(annotate);
}

module.exports = function(fileName) {
  var bundler = browserify('./public/common/'+fileName);

  applyBundleTransforms(bundler)
  bundler.transform({global:true}, 'uglifyify');

  return bundler.bundle()
    .pipe(source(fileName))
    .pipe(buffer());
};

module.exports.applyBundleTransforms = applyBundleTransforms;
