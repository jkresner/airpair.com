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




// gulp.util     = require('gulp-util')
// var red = gulp.util.colors.red
// var white = gulp.util.colors.white
// gulp.printErr = function(plugin, cb) {
//   return function(e) {
//     gulp.util.beep()
//     gulp.util.log(white(plugin), red(e.message))
//     if (cb) cb()
//   }
// }

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
// var publicDir = path.resolve('public')


// var cfg = {
//   watch: {
//     livereload: {
//       port: 35729,
//       all: [
//         'server/views/**', //views
//         'public/static/js/*.js',//devJS:
//         'public/static/styles/adm.css',
//         'public/static/styles/index.css'
//       ]
//     },
//     less:           'public/styles/**/*.less',
//   },
//   path: {
//     less:           'public/styles/*.less',
//     lessSrc: {
//       index:        'public/styles/index.less',
//       adm:          'public/styles/adm.less',
//       libs:         'public/styles/libs.less',
//       all:          'public/styles/*.less'
//     },
//     builtCss:       './public/static/styles',
//     builtJS:        './public/static/js',

//     browserifyJS:   './ang/*.js',
//     publicDir:      publicDir,
//     lessDir:        publicDir+'/styles/',
//   },
//   styleBundles:     ['libs.less', 'index.less', 'adm.less'],
//   jsBundles:        {
//     all:            ['index.js', 'adm.js'],
//     adm:            ['adm.js'],
//     index:          ['index.js'],
//   }
// }

// function initTasks(initTasks, options) {
//   initTasks.forEach(function(task) {
//     gulp.task(task, function(cb) {
//       require('./build/'+task)(gulp, cfg, options, cb)() })
//   })
//   return initTasks
// }


// function initRunTasks(runTasks, tasksToInit, options) {
//   return function(callback) {
//     if (tasksToInit)
//       initTasks(tasksToInit, options)

//     runTasks.forEach(function(task) {
//       gulp.task(task, function(cb) {
//         require('./build/'+task)(gulp, cfg, options, cb)() })
//     })

//     gulp.task('run', tasksToInit, function(){
//       return gulp.start(runTasks)
//     })
//     gulp.start('run')
//   }
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

