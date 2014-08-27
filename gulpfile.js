path = require('path');

var gulp = require('gulp');
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less');
    // rename = require('gulp-rename'),
    // concat = require('gulp-concat'),
    // livereload = require('gulp-livereload');

paths = {
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
  gulp.watch(paths.less, ['less']);
});


gulp.task('default', ['nodemon','less','watch']);