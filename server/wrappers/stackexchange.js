var wrapper = {

  name: "StackExchange",

  init() {
    this.url = `http://api.stackexchange.com/`
    wrapper.api = require('superagent')
  },

  getTagBySlug(term, cb) {
    LOG(`wrpr.call`, `Stack.getTagBySlug`, term)

    var encoded = encodeURIComponent(term)
    wrapper.api
      .get(`{this.url}/tags/${encoded}/wikis?site=stackoverflow`,
      // .set('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
      // .set('Accept', 'application/json')
      function(ee, res) {
        if (ee) $log(`wrpr.StackExhange.err ${ee}`.red)

        if (!res.ok)
         return cb(new Error(`StackOverflow tag not found matching [${term}]`))

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
