var gulp                     = require('gulp')
var path                     = require('path')
var join                     = path.join
var cfg                      = require('./build.json')

var rootDir                  = path.resolve(__dirname, "../")
process.chdir(rootDir)


require('meanair-build')(gulp, cfg).configure({
  dirs: dirs => {
    for (var name in dirs) dirs[name] = join(rootDir, dirs[name])
  },
  clean: clean => {
    clean.dirs = clean.dirs.map(name=>cfg.dirs[name])
  },
  less: less => {
    Object.assign(less, {
      src:     join(cfg.dirs.web, less.src, '*.less'),
      dest:    join(cfg.dirs.web, less.dest),
      imports: less.imports.map(p => join(cfg.dirs.web, p, '**/*.less'))
    })
  },
  nodemon: nodemon => {
    nodemon.config.script = join(cfg.dirs['server'],nodemon.config.script)
    nodemon.config.watch = nodemon.dirs.map(dir => join(rootDir,dir))
  },
  browserify: browserify => {
    browserify.src = join(rootDir, browserify.src)
    // if (cmd.indexOf('dist') == 0)
    //   browserify.dest = cfg.dirs.dist
    // else
    browserify.dest = join(cfg.dirs.web, browserify.dest)
    browserify.watch = !!cmd.match(/watch|dev/)
    browserify.dist = !!cmd.match(/dist/)
  },
  watch: watch => {
    watch.path.less = cfg.less.imports
    watch.path.browserify = watch.path.browserify.map(path => join(rootDir, path))
    watch.path.livereload = watch.path.livereload.map(path => join(rootDir, path))
  },
  dist: dist => {
    dist.src = cfg.dirs.web
    dist.dest = cfg.dirs.dist
  }
}).run()

// var timestart     = new Date().getTime()
// var timeLast      = new Date().getTime()
// global.$time      = function(msg) {
//   var subLapsed   = (new Date().getTime() - timeLast).toString()
//   timeLast        = new Date().getTime()
//   var lapsed      = (timeLast-timestart).toString()
//   console.log(
//       (lapsed+"      a".substring(0,6-lapsed.length)).magenta,
//       (subLapsed+"        b".substring(0,8-subLapsed.length)).green,
//       msg.magenta
//     )
// }
// gulp.task('devsetup:googletoken', initRunTasks(['googletoken']))
// gulp.task('less:all', initRunTasks(['less'], null, {section:'all'}) )
// gulp.task('less:libs', initRunTasks(['less'], null, {section:'libs'}) )
// gulp.task('less:adm', initRunTasks(['less'], null, {section:'adm'}) )
// gulp.task('less:index', initRunTasks(['less'], null, {section:'index'}) )
// gulp.task('build:clean', initRunTasks(['clean']))
// gulp.task('build', initRunTasks(['dist']))
// gulp.task('default', initRunTasks(['watch'], ['nodemon','less'], {section:'all'}) )
// gulp.task('index', initRunTasks(['watch'], ['nodemon','less'], {section:'index'}) )
// gulp.task('adm', initRunTasks(['watch'], ['nodemon','less'], {section:'adm'}) )
// gulp.task('test', initTasks(['less'],['nodemontest']))

