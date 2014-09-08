var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  watchify = require('watchify'),
  browserify = require('browserify');

paths = {
  public: 'public/**',
  styles: 'public/styles/*.+(less|css)',
  blog: 'server/blog/**',
  views: 'server/views/**'
}

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('nodemon', function () {
  nodemon({ script: 'bootstrap.js', ext: 'html js', 
      ignore: ['public/*'] })
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
  var watching = ['./public/**','!./public/style/**',paths.blog,paths.views]

  gulp.watch(paths.styles, ['less']);
  gulp.watch(watching).on('change',livereload.changed);
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify('./public/workshops/module.js', watchify.args));

  // Optionally, you can apply transforms
  // and other configuration options on the
  // bundler just as you would with browserify
  // bundler.transform('brfs');

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('workshops.js'))
      .pipe(gulp.dest('./public/v1/js'));
  }

  return rebundle();
});


gulp.task('default', ['nodemon','less','watch','watchify']);
