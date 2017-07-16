var base = 'https://api.cloudflare.com/client/v4'
var obj = honey.util.Object
var view = {
  getUser: 'id',
  getFirewall: 'id mode status notes modified_on'
}


var wrp = {

  name: 'Cloudflare',

  init(opts) {
    var [email,key] = global.config.wrappers.cloudflare.split(':')
    this.cfg = {base,email,key}
    this.api = require('superagent')
    var request = (method, opName, cb) => (url, data) => {
      LOG(`wrpr.call`, `cloudflare.${opName}`, data ? JSON.stringify(data).gray : '')
      var req = this.api[method](`${base}${url}`)
                  .accept('application/json')
                  .set('user-agent', 'airflare')
                  .set('X-Auth-Key', key)
                  .set('X-Auth-Email', email)

      if (data) req = req.send(data)

      req.end((e, res) => {
        if (e || !res.ok) return cb(e, console.log('Oh no! error', e, res))
        LOG(`wrpr.cloudflare`, `${method.toUpperCase()}${url}`, JSON.stringify(res.body))
        var r = res.body.result
        var attrs = view[opName]
        if (attrs)
          r = r.length > 0 ? r.map(item => obj.select(item, attrs)) : obj.select(r, attrs)
        cb(e, r)
      })
    }
    this.get = (op, url, cb) => request('get', op, cb)(url)
    this.post = (op, url, data, cb) => request('post', op, cb)(url, data)
  },

  getUser(cb) {
    this.get(`getUser`, `/user`, cb)
  },

  getFirewall(cb) {
    this.get(`getFirewall`, `/user/firewall/access_rules/rules`, cb)
  },

  blockIssue(issue, cb) {
    if (/((Googlebot)|(bingbot)|(yandex)|(yahoo))/i.test(issue.ua)) return cb(Error(`Wont block ${issue._id} ua[${issue.ua}]`))
    var notes = `issue:${issue._id}\n${issue.data.msg||issue.data.url}\n${issue.ip}\n${issue.ua}`
    var data = { mode: 'block', notes, configuration: { value:issue.ip, target: 'ip' } }
    this.post(`blockIP`, `/user/firewall/access_rules/rules`, data, cb)
  },

  blockIP(value, notes, cb) {
    var data = { mode: 'block', notes, configuration: { value, target: 'ip' } }
    this.post(`blockIP`, `/user/firewall/access_rules/rules`, data, cb)
  },

  blockRange(value, notes, cb) {
    value = `${value}.0/24`
    var data = { mode: 'block', notes, configuration: { value, target: 'ip_range' } }
    this.post(`blockRange`, `/user/firewall/access_rules/rules`, data, cb)
  }

}


module.exports = wrp
