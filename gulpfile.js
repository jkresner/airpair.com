path = require('path');

var gulp = require('gulp');
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');
    // concat = require('gulp-concat'),

paths = {
    public: 'public/**',
    less: 'app/styles/*.less'
}

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('less', function () {
  gulp.src(paths.less)
    .pipe(less({
      paths: [ path.join(__dirname, 'less') ]
    }))
    .pipe(gulp.dest('./public/css'));
});


gulp.task('nodemon', function () {
  nodemon({ script: 'index.js', ext: 'html js', ignore: ['ignored.js'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
});



// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen({ port: 35729 });
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.public).on('change',livereload.changed);
});


gulp.task('default', ['nodemon','less','watch']);