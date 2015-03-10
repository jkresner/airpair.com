global.http                 = require('supertest')
global.cookie               = null //-- used for maintaining login
global.cookieCreatedAt      = null
var hlpr                    = {}
var {uaFirefox}             = require('../../data/http')
var UserData                = require('../../../server/services/users.data')
var {ObjectId2Moment}       = require('../../../shared/util')



var session = {

  Call(httpCall, cb)
  {
    return httpCall
      .set('user-agent', uaFirefox)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((e,resp) => {
        if (e) {
          $log(e.red)
          throw e
        }
        cookie = resp.headers['set-cookie']
        if (resp.body._id)
          cookieCreatedAt = ObjectId2Moment(resp.body._id)
        else
          cookieCreatedAt = moment()

        cb(resp.body)
      })
  },

  ANONSESSION(cb)
  {
    if (logging) $log('ANONSESSION:')
    var httpCall = hlpr.GET(api.Url('/session/full'))
    return session.Call(httpCall, cb)
  },

  LOGIN(userKey, cb)
  {
    if (logging) $log('LOGIN:', `/test/setlogin/${userKey}`)

    data.sessions[userKey] =
      UserData.select.sessionFromUser(data.users[userKey])

    if (logging) $log(`login.data.sessions[${userKey}]`, data.sessions[userKey])

    var httpCall = hlpr.GET(`/test/setlogin/${userKey}`)
    return session.Call(httpCall, cb)
  },

  LOGOUT(cb)
  {
    global.cookie = null
    global.cookieCreatedAt = null
  }

}


var api = {

  Url(url, httpMethod, data)
  {
    var apiUrl = '/v1/api'+url
    if (logging && httpMethod) $log(`${httpMethod}:`.cyan, apiUrl, data)
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
    global.LOGOUT = session.LOGOUT
    global.GETP = function(url) {  // for getting non-api calls (e.g. pages)
      return hlpr.GET(url)
        .set('cookie', cookie)
        // .expect(200)
    }
  }
}
