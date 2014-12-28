var Twit = require('twit')
var twit = new Twit(config.auth.twitter)


var tw = {
  postTweet(content, cb) {
    if (config.env != 'production') return cb(null, 'faked')
    twit.post('statuses/update', {status:content}, (e, r, resp) => {
        if (e) {
          $log(e.message.red, e.twitterReply.white)
          cb(e)
        }
        else
        {
          $log(`TWEET @${r.user.screen_name} ${r.text}`.cyan,
            `https://twitter.com/airpair/status/${r.id_str}`.white)
          cb(null, r.id)
        }
      }
    )
  }
}

module.exports = tw
