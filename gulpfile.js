var browserify = require('browserify'),
    es6ify = require('es6ify'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    stringify = require('stringify'),
    watchify = require('watchify');

paths = {
  public: 'public/**',
  jade: 'public/**/*.jade',
  styles: 'public/styles/*.+(less|css)',
  views: 'server/views/**'
}

gulp.task('jade', function() {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'))
});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('nodemon', function () {
  nodemon({ script: 'bootstrap.js',
            ext: 'html js',
            ignore: ['public/*','test/*','dist/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node restart');
    })
});

gulp.task('less', function () {
  gulp.src(paths.styles)
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

  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(watching).on('change',livereload.changed);
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify('./public/common/index.js', watchify.args));

  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify);

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('index.js'))
      .pipe(gulp.dest('./public/v1/js'));
  }

  return rebundle();
});

gulp.task('bundle', function() {
  var bundler = browserify('./public/common/index.js');

  bundler.transform(stringify(['.html']));
  bundler.transform(es6ify);

  bundler.bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./public/v1/js'));
});

gulp.task('default', ['nodemon','jade', 'less','watch','watchify']);
gulp.task('build', ['less','bundle']);
