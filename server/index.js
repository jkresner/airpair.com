let {argv,env} = process
let ENV        = argv.indexOf("--dist") == -1 ? env.ENV : 'dist'
let sitemap    = argv.indexOf("--sitemap") == -1 ? null : {
  host: 'https://www.airpair.com',
  file: __dirname.replace('server','web/static/robots/sitemap.xml') }

var Honey      = require('honeycombjs')
var track      = require('./app.track')
var config     = Honey.Configure(__dirname, ENV)
if (sitemap)     assign(config.http.static,{sitemap})

var app        = require('./app').run({ config, Honey, track },
  e => e ? console.log('APP.ERROR'.red, e) : 0)
