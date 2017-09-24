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
  less: less => {
    Object.assign(less, {
      base:    cfg.dirs.web,
      src:     join(cfg.dirs.web, less.src, '*.less'),
      dest:    join(cfg.dirs.web, less.dest),
      imports: less.imports.map(p => join(cfg.dirs.web, p)) //, '**/*.less'
    })
  },
  browserify: browserify => {
    browserify.src = join(rootDir, browserify.src)
    // if (cmd.indexOf('dist') == 0)
    //   browserify.dest = cfg.dirs.dist
    // else
    browserify.dest = join(cfg.dirs.web, browserify.dest)
    browserify.watch = /(watch|default)/i.test(cmd)
    browserify.dist = /dist/i.test(cmd)
  },
  watch: watch => {
    watch.path.less = cfg.less.imports
    watch.path.browserify = watch.path.browserify.map(path => join(rootDir, path))
    watch.path.livereload = watch.path.livereload.map(path => join(rootDir, path))
  },
  dist: dist => {
    dist.src = cfg.dirs.web
    dist.dest = cfg.dirs.dist
    if (/dist/.test(cmd))
      cfg.less.imports[1] = cfg.less.imports[1].replace('dev','dist')
  }
}).run()
