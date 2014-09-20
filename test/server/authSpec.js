module.exports = function()
{
  describe("Signup", function() {

    before(function(done) {
      // check google login and insert google user.

      
    })


    it('Can sign up as new user with local credentials', function(done) {
      var data = { 
        name: "Jonathon "+moment().format(),
        email: "jk"+moment().format()+"@airpair.com",
        password: "Yoyoyoyoy"
      }
      http(global.app).post('/v1/auth/signup').send(data)
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(ee, res){
          cookie = res.headers['set-cookie']
          get('/session/full').set('cookie',cookie).expect(200).end(function(e, r){
            s = r.body
            expect(s._id).to.exist
            expect(s.google).to.be.undefined
            expect(s.googleId).to.be.undefined
            expect(s.name).to.equal(data.name)            
            expect(s.email).to.equal(data.email)
            expect(s.emailVerified).to.equal(false)  
            expect(s.local).to.be.undefined  // holds password field
            done()
          })
        })
    })


// it('signup local: has google, no local, singup with matching google email address')
//   expect('signup fail')
//   expect('ask user to google login')



  })

  // describe("Login", function() {

  // }
}

// it('login google: new user')
//   expect('google').toExist()
//   expect('googleId').toExist()  
//   expect('name').toExist()  
//   expect('email').toExist()  
//   expect('emailVerified').toBe(false)  
//   expect('local.password').toBe(null)  


// it('login google: has google, no local')
//   expect('google').toExist()
//   expect('googleId').toExist()  
//   expect('name').toExist()  
//   expect('email').toExist()  


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

