var
  gulp = require('gulp'),
  livereload = require('gulp-livereload'),
  config = require('./config');


module.exports = function() {

  //-- Runs less task if a less file changes
  gulp.watch(config.path.less, ['less']);

  //-- Runs live-reload if css, html, js or a server side view change
  livereload.listen(config.livereload);
  gulp.watch(config.path.devWatch).on('change',livereload.changed);

}
