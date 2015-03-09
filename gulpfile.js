var gulp = require('gulp');

require('./build/traceur');


['lint','less','watch','nodemon','nodemontest','clean','watchify','dist', 'devsetup']
  .forEach(function(task) {
    gulp.task(task, require('./build/'+task));
})


gulp.task('default', ['nodemon','less','watch','watchify']);

gulp.task('test', ['nodemontest','build']);

gulp.task('build', ['clean'], function() {
  gulp.start(['less', 'dist']);
});
