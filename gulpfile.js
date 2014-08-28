var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload');


paths = {
  dist: 'dist/**',
  styles: 'app/styles/*.less'
}

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('nodemon', function () {
  nodemon({ script: 'index.js', ext: 'html js', ignore: ['ignored.js'] })
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
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
  livereload.listen({ port: 35729 });
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.dist).on('change',livereload.changed);
});


gulp.task('default', ['nodemon','less','watch']);