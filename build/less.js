var path = require('path'),
  gulp = require('gulp'),
  less = require('gulp-less');

module.exports = function () {
  return gulp.src(['public/styles/index.less','public/styles/adm.less'])
    .pipe(less({
      paths: [ path.join(__dirname, 'styles') ]
    }))
    .pipe(gulp.dest('./public/v1/css'));
}
