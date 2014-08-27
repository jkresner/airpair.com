var gulp = require('gulp');
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');
    // uglify = require('gulp-uglify'),
    // rename = require('gulp-rename'),
    // concat = require('gulp-concat'),
    // livereload = require('gulp-livereload');

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});



gulp.task('nodemon', function () {
  nodemon({ script: 'index.js', ext: 'html js', ignore: ['ignored.js'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
});



gulp.task('default', ['nodemon']);