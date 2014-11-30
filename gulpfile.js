var gulp = require('gulp');

require('./build/traceur');


['lint','less','watch','nodemon','nodemontest','clean','watchify','dist']
  .forEach(function(task) {
    gulp.task(task, require('./build/'+task));
})


gulp.task('default', ['nodemontest','less','watch','watchify']);

gulp.task('test', ['nodemontest','build']);

gulp.task('build', ['clean'], function() {
  gulp.start(['less', 'dist']);
});
