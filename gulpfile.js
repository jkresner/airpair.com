var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  buffer = require('gulp-buffer'),
  merge = require('merge-stream'),
  es6ify = require('es6ify'),
  stringify = require('stringify'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  uglifyify = require('uglifyify'),
  rev = require('gulp-rev');

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


var watchifyer = function(fileName)
{
  var bundler = watchify(browserify('./public/common/'+fileName, watchify.args));
  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify.configure(/^(?!.*lib)+.+\.js$/));
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
  watchifyer('index.js');
  watchifyer('adm.js');
});

var bundlerer = function(fileName) {
  var bundler = browserify('./public/common/'+fileName);

  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify.configure(/^(?!.*lib)+.+\.js$/));

  bundler.transform({global:true}, 'uglifyify');

  return bundler.bundle()
    .pipe(source(fileName))
    .pipe(buffer());
}

gulp.task('bundle', function() {
  merge(
    bundlerer('index.js'),
    bundlerer('adm.js')
    )
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'))
});


gulp.task('default', ['nodemon','less','watch','watchify']);
gulp.task('test', ['testnodemon','build']);
gulp.task('build', ['less','bundle']);
