var livereload      = require('gulp-livereload');
var merge           = require('merge-stream'),
    source          = require('vinyl-source-stream2'),
    watchify        = require('watchify'),
    browserify      = require('browserify'),
    es6ify          = require('es6ify'),
    stringify       = require('stringify'),
    annotate        = require('browserify-ngannotate');


module.exports = function(gulp, config, options, callback) {

  function watchifyer(fileName)
  {
    var bundler = watchify(browserify('./ang/'+fileName, watchify.args))
    bundler.transform(stringify(['.html']))
    bundler.transform(es6ify.configure(/^(?!.*lib)+.+\.js$/))
    bundler.transform(annotate)
    bundler.on('update', rebundle)

    function rebundle() {
      return bundler.bundle()
        .on('error', gulp.printErr('Browserify'))
        .pipe(source(fileName))
        .pipe(gulp.dest('./public/static/js'))
    }

    return rebundle()
  }

  return function() {

    //-- Runs less task if a less file changes
    gulp.watch(config.watch.less, ['less'])

    //-- Runs live-reload if css, html, js or a server side view change
    livereload.listen(config.watch.livereload.port)

    gulp.watch(config.watch.livereload.all)
      .on('change', livereload.changed)

    merge(config.jsBundles[options.section].map(watchifyer))

    callback()

  }

}
