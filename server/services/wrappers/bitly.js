var bitlyUrl = 'https://api-ssl.bitly.com/v3'
var {accessToken,shortDomain} = config.bitly

var wrapper = {

  init() {
    wrapper.api = require('superagent')
  },

  shorten(link, cb) {
    if (config.env != 'production') return cb(null, `${shortDomain}faked`)

    link =  `https://www.airpair.com${link}`.replace(/&/g,'%26')
    wrapper.api
      .get(`${bitlyUrl}/shorten?access_token=${accessToken}&longUrl=${link}`)
      .type('json')
      .end((e, res)=>{
        if (!res.ok) return cb(res.error)
        // $log('bitly', res.body)
        cb(null, `${shortDomain}${res.body.data.hash}`)
      })
  }

}

module.exports = wrapper
