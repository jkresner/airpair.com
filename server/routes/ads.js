var express                            = require('express')
var {trackAdClick,trackAdImpression}   = require('../middleware/analytics')
var {authd,noCrawl}                    = require('../middleware/auth')


module.exports = function(app) {

  app.use('/ad', trackAdImpression, express.static(config.ads.staticDir)) //no max age, we want no cacheing

  return express.Router()

    .use(noCrawl('/'))

    .get('/heroku-151014-node.js',
       trackAdClick('https://signup.heroku.com/nodese?c=70130000001xtjz&utm_campaign=Web%20-%20Signup%20-%20Endemic%20-%20Air%20Pair%20ROS%20Heroku%20-%20Q3%20Nodese&utm_medium=display&utm_source=airpair&utm_term=node&utm_content=top-900-banner'),
        (req, res, cb) => res.redirect(req.ad.url) )

    .get('/heroku-151014-php',
       trackAdClick('https://signup.heroku.com/php?c=70130000001xtkF&utm_campaign=Web%20-%20Signup%20-%20Endemic%20-%20Air%20Pair%20ROS%20Heroku%20-%20Q3_PHP&utm_medium=display&utm_source=airpair&utm_content=&utm_term=php&utm_content=top-900-banner'),
        (req, res, cb) => res.redirect(req.ad.url) )

    .get('/heroku-151014-java',
       trackAdClick('https://signup.heroku.com/java?c=70130000001xtkF&utm_campaign=Web%20-%20Signup%20-%20Endemic%20-%20Air%20Pair%20ROS%20Heroku%20-%20Q3_JAVA&utm_medium=display&utm_source=airpair&utm_content=&utm_term=java&utm_content=top-900-banner'),
        (req, res, cb) => res.redirect(req.ad.url) )

    // .get('/lob-150812',
    //    trackAdClick('https://lob.com/?utm_source=airpair&utm_medium=bannertop900'),
    //     (req, res, cb) => res.redirect(req.ad.url) )

    // .get('/keen.io-082015',
    //    trackAdClick('http://keen.github.io/explorer?utm_source=airpair&utm_medium=banner&utm_campaign=data_explorer'),
    //     (req, res, cb) => res.redirect(req.ad.url) )

    .get('/keen.io-072015',
       trackAdClick('https://keen.io/?utm_source=airpair&utm_medium=banner&utm_campaign=custom_analytics'),
        (req, res, cb) => res.redirect(req.ad.url) )

}
