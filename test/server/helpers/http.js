global.http = require('supertest')
global.cookie = null //-- used for maintaining login
global.cookieCreatedAt = null
var hlpr = {}

var uaFirefox = 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0'


var session = {

  ANONSESSION(cb)
  {
    if (logging) $log('ANONSESSION:')
    return hlpr.GET('/v1/api/session/full')
      .set('user-agent', uaFirefox)
      .end((e,resp) => {
        if (e) return done(e)
        cookie = resp.headers['set-cookie']
        cookieCreatedAt = moment()
        cb(resp.body)
      })
  },

  LOGIN(key, user, cb)
  {
    if (logging) $log('LOGIN:'.cyan, '/test/setlogin/'+key)
    //-- todo, reconsider how the data.users and data.sessions hang together
    data.sessions[key] = {
      _id: user._id,
      name: user.name,
      emailVerified: user.emailVerified,
      email: user.email,
      roles: user.roles
    }
    if (logging) $log(`login.data.sessions[${key}]`, data.sessions[key])
    return hlpr.GET(`/test/setlogin/${key}`)
      .set('user-agent', uaFirefox)
      .end((e,resp) => {
        if (e) {
          $log(resp.text.red)
          throw err
        }
        cookie = resp.headers['set-cookie']
        if (logging) $log('login.cookie', cookie, resp.body)
        cb(resp.body)
      })
  }

}


var api = {

  Url(url, httpMethod, data)
  {
    var apiUrl = '/v1/api'+url
    if (logging) $log(`${httpMethod}:`.cyan, apiUrl, data)
    return apiUrl
  },

  Call(httpCall, opts, cb)
  {
    return httpCall
      .set('cookie', (opts.unauthenticated) ? null : cookie)
      .set('user-agent', uaFirefox)
      .expect('Content-Type', /json/)
      .expect(opts.status||200)
      .end((e, resp) => {
        if (!e) return cb(resp.body)
        $log( ((resp) ? resp.text : e.message ).red )
        throw e
      })
  },

  GET(url, opts, cb)
  {
    var httpCall = hlpr.GET(api.Url(url,'GET'))
    return api.Call(httpCall, opts, cb)
  },

  POST(url, data, opts, cb)
  {
    var httpCall = hlpr.POST(api.Url(url,'POST',data)).send(data)
    return api.Call(httpCall, opts, cb)
  },

  PUT(url, data, opts, cb)
  {
    var httpCall = hlpr.PUT(api.Url(url,'PUT',data)).send(data)
    return api.Call(httpCall, opts, cb)
  },

  DELETE(url, opts, cb)
  {
    var httpCall = hlpr.DELETE(api.Url(url,'DELETE',data))
    return api.Call(httpCall, opts, cb)
  }

}


module.exports = {
  init(app) {
    hlpr.GET = http(app).get
    hlpr.POST = http(app).post
    hlpr.PUT = http(app).put
    hlpr.DELETE = http(app).delete
    global.GET = api.GET
    global.POST = api.POST
    global.PUT = api.PUT
    global.DELETE = api.DELETE
    global.ANONSESSION = session.ANONSESSION
    global.LOGIN = session.LOGIN
    global.GETP = function(url) {  // for getting non-api calls (e.g. pages)
      return hlpr.GET(url)
        .set('cookie', cookie)
        .expect(200)
    }
  }
}
