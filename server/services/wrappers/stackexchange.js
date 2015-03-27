var logging                       = false

var wrapper = {

  init() {
    wrapper.api = require('superagent')
  },

  getTagByStackoverflowSlug(term, cb) {
    var encoded = encodeURIComponent(term)
    if (logging)
      $log('getTagByStackoverflowSlug', `http://api.stackexchange.com/tags/${encoded}/wikis?site=stackoverflow`)

    wrapper.api
      .get(`https://api.stackexchange.com/tags/${encoded}/wikis?site=stackoverflow`,
      // .set('user-agent', "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.104 Safari/537.36")
      // .set('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
      // .set('Accept', 'application/json')
      function(ee, res) {
        if (logging || ee) $log('SO.res'.yellow, ee, res.ok, res.body)

        var err = new Error(`Stackoverflow tag ${term} not found`)
        if (!res.ok)
         return cb(err)

        // subscript for fucking invisible character
        // var d = JSON.parse(res.text.substring(1)).items[0])
        var d = res.body.items[0]

        if (!d)
          return cb(err)

        cb(null, {
          name: d.tag_name,
          short: d.tag_name,
          slug: d.tag_name,
          desc: d.excerpt,
          soId: d.tag_name,
          so: d
        })


      })
  }
}

module.exports = wrapper
