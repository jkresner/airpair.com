global.http = require('supertest')

global.cookie = null //-- used for maintaining login
global.cookieCreatedAt = null


global.GETP = function(url) {
  return http(global.app)
    .get(url)
    .set('cookie',cookie)
    .expect(200);
}


global.ANONSESSION = function(cb) {
  if (logging) $log('ANONSESSION:')
  return http(global.app).get('/v1/api/session/full').end(function(e,resp){
    if (e) return done(err)
    cookie = resp.headers['set-cookie']
    cb(resp.body)
  })
}


global.LOGIN = function(key, user, cb) {
  if (logging) $log('login:', '/test/setlogin/'+key)
  data.sessions[key] = { _id: user._id, name: user.name, emailVerified: user.emailVerified, email: user.email, roles: user.roles };
  if (logging) $log(`login.data.sessions[${key}]`, data.sessions[key])
  return http(global.app).get('/test/setlogin/'+key).end(function(e,resp){
    if (e) {
    	$log(resp.text.red)
     	throw err
    }
    cookie = resp.headers['set-cookie']
  	if (logging) $log('login.cookie.blue', cookie, resp.body)
    cb(resp.body)
  })
}


global.GET = function(url, opts, headers, cb) {
  if (arguments.length == 3) {
    if (Object.prototype.toString.call(headers) == "[object Function]") {
      cb = headers;
      headers = undefined; 
    }
  }

  var apiUrl = '/v1/api'+url
  if (logging) $log('get:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  // setup the get request
  var req = http(global.app).get(apiUrl);

  // add custom headers if we have them
  if (headers) {
    for (var h in headers) {
      req.set(h, headers[h]);
    }
  }

  // finish setting up the request
  return req.set('cookie',sessionCookie)
    .expect('Content-Type', /json/)
    .expect(opts.status||200)
    .end(function(err, resp){
      if (err) {
      	$log(resp.text.red)
      	throw err
      }
      else cb(resp.body)
    })
}


global.POST = function(url, data, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('post:', apiUrl, data)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .post(apiUrl)
    .send(data)
    .set('cookie',sessionCookie)
    .expect(opts.status||200)
    .expect('Content-Type', /json/)
    .end(function(err, resp){
      if (err) {
      	$log(resp.text.red)
      	throw err
      }
      else cb(resp.body, resp)
    })

}


global.PUT = function(url, data, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('put:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .put(apiUrl)
    .send(data)
    .set('cookie',sessionCookie)
    .expect(opts.status||200)
    .expect('Content-Type', /json/)
    .end(function(err, resp){
      if (err) {
      	$log(resp.text.red)
      	throw err
      }
      else cb(resp.body, resp)
    })

}


global.DELETE = function(url, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('DELETE:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .delete(apiUrl)
    .set('cookie',sessionCookie)
    .expect(opts.status||200)
    .expect('Content-Type', /json/)
    .end(function(err, resp){
      if (err) {
      	$log(resp.text.red)
      	throw err
      }
      else cb(resp.body, resp)
    })

}
