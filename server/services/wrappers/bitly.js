var request = require('superagent')
var bitlyUrl = 'https://api-ssl.bitly.com/v3'
var {accessToken,shortDomain} = config.bitly

module.exports = {
  shorten(link, cb) {
    if (config.env != 'production') return cb(null, `${shortDomain}faked`)

    link =  `https://www.airpair.com${link}`.replace(/&/g,'%26')
    request
      .get(`${bitlyUrl}/shorten?access_token=${accessToken}&longUrl=${link}`)
      .type('json')
      .end((res)=>{
        if (!res.ok) return cb(res.error)
        // $log('bitly', res.body)
        cb(null, `${shortDomain}${res.body.data.hash}`)
      })
  }
}

