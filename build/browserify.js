var browserify      = require('browserify'),
    es6ify          = require('es6ify'),
    stringify       = require('stringify'),
    annotate        = require('browserify-ngannotate');

module.exports = function(fileName) {

  var bundler = browserify(fileName)
  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify.configure(/^(?!.*lib)+.+\.js$/));
  bundler.transform(annotate);

  // $time('browserifying '+fileName)

  return bundler.bundle()

}
