var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  jade = require('gulp-jade');


paths = {
  jade: 'app/**/*.jade',
  public: 'public/v1/**',
  styles: 'app/styles/*.+(less|css)',
  blog: 'app/blog/**',
  chat: 'app/chat/*.+(js|html)'
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
  nodemon({ script: 'bootstrap.js', ext: 'js', ignore: ['ignored.js','chat/*'] })
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
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.blog).on('change', livereload.changed);
  gulp.watch(paths.chat).on('change', livereload.changed);
  gulp.watch(paths.public).on('change', livereload.changed);
});


gulp.task('default', ['nodemon','less','watch']);
