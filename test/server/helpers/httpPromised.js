global.http = require('supertest')


global.cookie = null //-- used for maintaining login

var sessionFromUser = (u) => {
  return { _id: u._id, name: u.name, email: u.email, roles: u.roles } }

global.login = (key, user) =>
  new Promise( (resolve, reject) => {
    data.sessions[key] = sessionFromUser(user)
    if (logging) $log('login:', '/test/setlogin/'+key, data.sessions[key])
    return http(global.app)
      .get('/test/setlogin/'+key)
      .end( (e,r) => {
        if (e) throw e
        global.cookie = r.headers['set-cookie']
        resolve(r.body)
      })
  })



global.get = (url, opts) =>
  new Promise( (resolve, reject) => {
    var apiUrl = '/v1/api'+url
    if (logging) $log('get:', apiUrl, opts)

    var sessionCookie = cookie
    if (opts.unauthenticated) { sessionCookie = null }
    
    return http(global.app)
      .get(apiUrl)
      .set('cookie',sessionCookie)
      .expect('Content-Type', /json/)
      .expect(opts.status||200)
      .end( (e, r) => { 
        if (e) throw e
        else resolve(r.body) })
  })



global.post = (url, data, opts) =>
  new Promise( (resolve, reject) => {
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
      .end( (e, r) => { 
        if (e) throw e
        else resolve(r.body) })
  })


global.put = (url, data, opts) =>
  new Promise( (resolve, reject) => {  
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
      .end( (e, r) => { 
        if (e) throw e
        else resolve(r.body) })
  })