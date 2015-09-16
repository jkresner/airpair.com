function primeRevBuild(gulp) {

  function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true })
    src._read = function () {
      this.push(new gulp.util.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
      this.push(null)
    }
    return src
  }


  var pkg = require('../package.json')
  var buildJSON  = '{ ' + '\n' +
    '  "build": {' +
    ' "time": "'+new Date().getTime()+'", "version": "'+pkg.version +
    '" }' + '\n' +
    '} '

  console.log("Building v".cyan+pkg.version)

  return string_src("rev-manifest.json", buildJSON).pipe(gulp.dest('./dist'))
}



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

    primeRevBuild(gulp)

    gulp.src('public/styles/slackin.less', {base:base})
      .pipe(less({}))
      .pipe(gulp.dest('./dist/static'))

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
      .pipe(rev.manifest('./dist/rev-manifest.json',{merge:true}))
      .pipe(gulp.dest('./'))
      .on('end', callback)
  }

}
