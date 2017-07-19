// process.env.ENV = 'prod'
var Honey    = require('honeycombjs')
var config   = Honey.Configure(__dirname, process.env.ENV || 'dev', true)
var track    = require('./app.track')

var app = require('./app').run({ config, Honey, track },
  (e) => { if (e) console.log('APP.ERROR'.red, e, e.stack) })

//     var urls = app.sitemap.map(url => `<url><loc>${url}</loc></url>`)
//                           .join('\n  ')
//                           .replace(new RegExp(config.http.host,'g'), 'https://www.airpair.com')

//     require('fs').writeFileSync(
//       __dirname.replace('server','web/robots/sitemap.xml'),
// `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${urls}
// </urlset>`)
