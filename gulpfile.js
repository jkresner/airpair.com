var path = require('path'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  livereload = require('gulp-livereload'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  buffer = require('gulp-buffer'),
  merge = require('merge-stream'),
  es6ify = require('es6ify'),
  stringify = require('stringify'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  uglifyify = require('uglifyify'),
  annotate = require('browserify-ngannotate'),
  rev = require('gulp-rev');

require('./build/traceur');

paths = {
  public: 'public/**',
  styles: 'public/styles/*.+(less|css)',
  views: 'server/views/**'
}

gulp.task('testnodemon', function () {
  nodemon({ script: 'test/server/helpers/run.js', ext: 'html js',
      ignore: ['public/*','dist/*','node_modules/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node test restart');
    })
});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('nodemon', function () {
  nodemon({ script: 'bootstrap.js', ext: 'html js',
      ignore: ['public/*','test/*','dist/*','node_modules/*'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('>> node restart');
    })
});

gulp.task('less', require('./build/less'));

gulp.task('watch', function() {
  livereload.listen({ port: 35729 });
  var watching = [
    './public/**/*.css',
    './public/**/*.html',
    './public/**/*.js',
    paths.views
  ];

  gulp.watch(paths.styles, ['less']);
  gulp.watch(watching).on('change',livereload.changed);
});

gulp.task('clean', require('./build/clean'));
gulp.task('watchify', require('./build/watchify'));
gulp.task('dist', require('./build/dist'));

gulp.task('default', ['nodemon','less','watch','watchify']);
gulp.task('test', ['testnodemon','build']);
gulp.task('build', ['clean'], function() {
  gulp.start(['less', 'dist']);
});
