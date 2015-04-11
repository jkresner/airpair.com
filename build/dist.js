
module.exports = function(gulp, config, options, callback) {
  return function() {
    $time('dist start')

    var merge         = require('merge-stream'),
        rev           = require('gulp-rev');

    var source        = require('vinyl-source-stream2'),
        buffer        = require('gulp-buffer'),
        uglify        = require('gulp-uglify');
        // sourceTrans   = require('vinyl-transform');

    var less          = require('gulp-less'),
        minifyCSS     = require('gulp-minify-css');

    var apBrowserify  = require('./browserify')
    var base = config.path.publicDir

    $time('dist required')

    return merge(

      config.jsBundles.all.map(function(fileName) {

        return apBrowserify('./ang/'+fileName)
          .on('end', function() { $time('browserified '+fileName) })
          .pipe(source({
            path: 'public/js/'+fileName,
            base: base                    // Helps put dest in the right sub folder
          }))
          .on('end', function() { $time('sourced '+fileName) })
          // .pipe(sourceTrans())
          .pipe(buffer())                 // Used because something doesnt support streams
          .pipe(uglify())
      })

      ,

      config.styleBundles.map(function(fileName) {
        return gulp.src('public/styles/'+fileName, {base:base})
          .pipe(less({}))
          .pipe(minifyCSS({}))
          // .on('end', function() { $time('finished styles '+fileName) })
      })

    )
      .pipe(rev())
      .pipe(gulp.dest('./dist/static'))
      .pipe(rev.manifest('rev-manifest.json',{merge:true}))
      .pipe(gulp.dest('./dist'))
      .on('end', callback)
  }

}
