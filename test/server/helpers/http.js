global.http = require('supertest')


global.cookie = null //-- used for maintaining login


global.login = function(key, user, cb) {
  if (logging) $log('login:', '/test/setlogin/'+key)
  data.sessions[key] = { _id: user._id, name: user.name, email: user.email, roles: user.roles };
  if (logging) $log('login.data.sessions[key]', data.sessions[key])
  return http(global.app).get('/test/setlogin/'+key).end(function(e,res){
    if (e) return done(err)
    cookie = res.headers['set-cookie']
    cb(e)
  })
}


global.get = function(url, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('get:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .get(apiUrl)
    .set('cookie',sessionCookie)
    .expect('Content-Type', /json/)
    .expect(opts.status||200)
    .end(function(err, resp){
      if (err) throw err
      else cb(resp.body)
    })
}


global.post = function(url, data, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('post:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .post(apiUrl)
    .send(data)
    .set('cookie',sessionCookie)
    .expect(opts.status||200)
    .expect('Content-Type', /json/)
    .end(function(err, resp){
      if (err) throw err
      else cb(resp.body, resp)
    })

}


global.put = function(url, data, opts, cb) {
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
      if (err) throw err
      else cb(resp.body, resp)
    })

}
