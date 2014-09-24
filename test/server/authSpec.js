var UserService = require('../../server/services/users')
module.exports = function()
{
  
  describe("Signup: ", function() {

    before(function(done) {
      done()
    })


    it('Can sign up as new user with local credentials', function(done) {
      var d = { 
        name: "Jonathon "+moment().format(),
        email: "jk"+moment().format()+"@airpair.com",
        password: "Yoyoyoyoy" }

      http(global.app).post('/v1/auth/signup').send(d).expect(302)
        .end(function(err, resp) {
          if (err) throw err
          cookie = resp.headers['set-cookie']
          get('/session/full', {}, function(s) {
            expect(s._id).to.exist
            expect(s.google).to.be.undefined
            expect(s.googleId).to.be.undefined
            expect(s.name).to.equal(d.name)            
            expect(s.email).to.equal(d.email)
            expect(s.emailVerified).to.equal(false)  
            expect(s.local).to.be.undefined  // holds password field   
            expect(s.roles).to.be.undefined // new users have undefined roles
            done()
        })
      })
    })


    it('Can sign up as new user with google', function(done) {
      UserService.upsertProviderProfile(null, 'google', data.oauth.jkre, function(e,usr) {
        login('jkre', usr, function() {
          get('/session/full', {}, function(s) {
            expect(s._id).to.equal(usr._id.toString())
            expect(s.email).to.equal(usr.email)
            expect(s.name).to.equal(usr.name) 
            expect(s.googleId).to.be.undefined  // not returned from session call            
            expect(s.google.id).to.equal(data.oauth.jkre.id)  
            expect(s.emailVerified).to.equal(false)  
            expect(s.local).to.be.undefined  // holds password field       
            expect(s.roles).to.be.undefined // new users have undefined roles
            done()
          })    
        })
      })
    })

    it('Can not sign up with local credentials and existing gmail', function(done) {
      var d = { 
        name: "Jonathon Kresner",
        email: "jk@airpair.com",
        password: "Yoyoyoyoy" }

      http(global.app).post('/v1/auth/signup').send(d)
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          if (err) return done(err)   
          var failTest = new RegExp('fail=local-singup&info=try%20google%20login')
          expect(failTest.test(res.text)).to.be.true  // holds password field
          done()
      })
    })

    it('Can not sign up with local credentials and existing local email', function(done) {
      var d = { 
        name: "Jonathon Exists"+moment().format(),
        email: "jkexists"+moment().format()+"@airpair.com",
        password: "Yoyoyoyoy" }

      http(global.app).post('/v1/auth/signup').send(d).expect(302)
        .end(function(e, r) {
          http(global.app).post('/v1/auth/signup').send(d).expect(302)          
            .end(function(err, res) {
              if (err) return done(err)   
              var failTest = new RegExp('fail=local-singup&info=user%20already%20exists')
              expect(failTest.test(res.text)).to.be.true  // holds password field
              done()
            })        
        })
    })

  })

  // describe("Login", function() {
    // it('login google: new user')
    //   expect('google').toExist()
    //   expect('googleId').toExist()  
    //   expect('name').toExist()  
    //   expect('email').toExist()  
    //   expect('emailVerified').toBe(false)  
    //   expect('local.password').toBe(null)  

    // it('login google: no google, has local, google login matching local email')
    //   expect('login success')
    //   expect('profile upsert success')  
    //   expect('google').toExist()
    //   expect('googleId').toExist()  

    // it('login local: user has google, no local, with google email address')
    //   expect('login fail')
    //   expect('tell no matching password')  
    //   expect('ask user to google login')  

    // it('signup local: no google, has local, singup with matching local email')
    //   expect('signup fail')
    //   expect('ask user to login')  
  // }
}


