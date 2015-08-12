var express                            = require('express')
var {trackAdClick,trackAdImpression}   = require('../middleware/analytics')
var {authd,noCrawl}                    = require('../middleware/auth')


module.exports = function(app) {

  app.use('/ad', trackAdImpression, express.static(config.ads.staticDir)) //no max age, we want no cacheing

  return express.Router()

    .use(noCrawl('/'))

    .get('/lob-150812',
       trackAdClick('https://lob.com/?utm_source=airpair&utm_medium=bannertop900'),
        (req, res, cb) => res.redirect(req.ad.url) )

    // .get('/keen.io-082015',
    //    trackAdClick('http://keen.github.io/explorer?utm_source=airpair&utm_medium=banner&utm_campaign=data_explorer'),
    //     (req, res, cb) => res.redirect(req.ad.url) )

    .get('/keen.io-072015',
       trackAdClick('https://keen.io/?utm_source=airpair&utm_medium=banner&utm_campaign=custom_analytics'),
        (req, res, cb) => res.redirect(req.ad.url) )

}
