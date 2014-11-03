var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  gutil = require('gulp-util'),
  stringify = require('stringify'),
  source = require('vinyl-source-stream'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  es6ify = require('es6ify');

paths = {
  public: 'public/**',
  styles: 'public/styles/*.+(less|css)',
  views: 'server/views/**'
}

gulp.task('testnodemon', function () {
  nodemon({ script: 'test/server/helpers/run.js', ext: 'html js',
      ignore: ['public/*','dist/*','node_modules/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node test restart');
    })
});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('nodemon', function () {
  nodemon({ script: 'bootstrap.js', ext: 'html js',
      ignore: ['public/*','test/*','dist/*','node_modules/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node restart');
    })
});

gulp.task('less', function () {
  gulp.src(['public/styles/index.less','public/styles/adm.less'])
    .pipe(less({
      paths: [ path.join(__dirname, 'styles') ]
    }))
    .pipe(gulp.dest('./public/v1/css'));
});

gulp.task('watch', function() {
  livereload.listen({ port: 35729 });
  var watching = [
    './public/**/*.css',
    './public/**/*.html',
    './public/**/*.js',
    paths.views
  ];

  gulp.watch(paths.styles, ['less']);
  gulp.watch(watching).on('change',livereload.changed);
});


var watchifyer = function(fileName) {
  var bundler = watchify(browserify('./public/common/'+fileName, watchify.args));
  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify);
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error')) // log errors if they happen
      .pipe(source(fileName))
      .pipe(gulp.dest('./public/v1/js'));
  }

  return rebundle();

}

gulp.task('watchify', function() {
  watchifyer('lite.js');
  watchifyer('index.js');
  watchifyer('adm.js');
});

var bundlerer = function(fileName) {
  var bundler = browserify('./public/common/'+fileName);

  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify);

  bundler.bundle()
    .pipe(source(fileName))
    .pipe(gulp.dest('./public/v1/js'));
}

gulp.task('bundle', function() {
  bundlerer('lite.js')
  bundlerer('index.js')
  bundlerer('adm.js')
});


gulp.task('default', ['nodemon','less','watch','watchify']);

gulp.task('test', ['testnodemon','build']);

gulp.task('build', ['less','bundle']);
