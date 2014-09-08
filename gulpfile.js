var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  jade = require('gulp-jade');


paths = {
  public: 'public/**',
  jade: 'public/**/*.jade',
  styles: 'public/styles/*.+(less|css)',
  blog: 'server/blog/**',
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
  var watching = ['public/**', '!public/style/**', paths.blog, paths.views]

  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(watching).on('change',livereload.changed);
});


gulp.task('default', ['nodemon','jade','less','watch']);
