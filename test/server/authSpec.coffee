UserService = require('../../server/services/users')
util = require('../../shared/util')

module.exports = ->  
  describe "Signup: ", ->


    before (done) ->
      # stubAnalytics()
      done()
    

    after (done) ->
      # resotreAnalytics()
      global.cookie = null
      global.cookieCreatedAt = null
      done()


    it 'Can sign up as new user with local credentials', (done) ->
      d = getNewUserData('jkap')

      http(global.app).post('/v1/auth/signup').send(d).expect(302)
        .end (err, resp) ->
          if (err) then throw err
          global.cookie = resp.headers['set-cookie']
          GET '/session/full', {}, (s) ->
            expect(s._id).to.exist
            expect(s.google).to.be.undefined
            expect(s.googleId).to.be.undefined
            expect(s.name).to.equal(d.name)            
            expect(s.email).to.equal(d.email)
            expect(s.emailVerified).to.equal(false)  
            expect(s.local).to.be.undefined  # holds password field   
            expect(s.roles).to.be.undefined # new users have undefined roles
            expect(s.cohort.engagement).to.exist
            done()


    it 'New user has correct cohort information', (done) ->
      addAndLoginLocalUser 'dysn', (s) ->
        {userKey,sessionID} = s 
        {cohort} = data.users[userKey]
        expect(moment(cohort.engagement.visit_first).unix()).to.equal(moment(cookieCreatedAt).unix())
        expect(cohort.engagement.visit_signup).to.be.exist
        expect(cohort.engagement.visit_last).to.be.exist 
        expect(cohort.engagement.visits.length).to.equal(1)
        expect(moment(cohort.engagement.visits[0]).unix()).to.equal(moment(util.dateWithDayAccuracy()).unix())
        expect(cohort.aliases.length).to.equal(1)        
        expect(cohort.aliases[0].indexOf("testdysn")).to.equal(0)                
        done()


    it 'Can sign up as new user with google', (done) ->
      UserService.upsertProviderProfile.call newUserSession(), 'google', data.oauth.rbrw, (e,usr) ->
        LOGIN 'rbrw', usr, ->
          GET '/session/full', {}, (s) ->
            expect(s._id).to.equal(usr._id.toString())
            expect(s.email).to.equal(usr.email)
            expect(s.name).to.equal(usr.name) 
            expect(s.googleId).to.be.undefined  # not returned from session call            
            expect(s.google.id).to.equal(data.oauth.rbrw.id)  
            expect(s.emailVerified).to.equal(false)  
            expect(s.local).to.be.undefined  # holds password field       
            expect(s.roles).to.be.undefined  # new users have undefined roles
            expect(s.cohort.engagement).to.exist
            done()


    it 'Can not sign up with local credentials and existing gmail', (done) ->
      d = name: "AirPair Experts", email: "experts@airpair.com", password: "Yoyoyoyoy"

      UserService.upsertProviderProfile.call newUserSession(), 'google', data.oauth.exap, (e,usr) ->
        expect(usr._id).to.exist
        http(global.app).post('/v1/auth/signup').send(d)
          .expect(400)
          .expect('Content-Type', /json/)
          .end (err, res) ->
            if (err) then return done(err)   
            expect(res.body.error).to.equal('try google login')
            done()


    it 'Can not sign up with local credentials and existing local email', (done) ->
      d = getNewUserData('jkap')

      http(global.app).post('/v1/auth/signup').send(d).expect(200)
        .end (e, r) ->
          http(global.app).post('/v1/auth/signup').send(d).expect(400)          
            .end (err, res) ->
              if (err) then return done(err)   
              expect(res.body.error).to.equal('user already exists')
              done()



  describe "Login", -> 

    it 'Login of existing v0 user creates cohort', (done) ->
      testDb.ensureUser data.v0.users.SoumyaAcharya, (e, sou) ->
        expect(_.idsEqual sou._id, "51a6668866a6f999a465f2fc").to.be.true
        expect(sou.email).to.be.undefined
        expect(sou.name).to.be.undefined        
        expect(sou.cohort.visit_first).to.be.undefined
        expect(sou.cohort.aliases.length).to.equal(0)

        UserService.upsertProviderProfile.call newUserSession('SoumyaAcharya'), 'google', sou.google, (e,u) ->
          expect(u.email).to.equal(sou.google._json.email)
          expect(u.name).to.equal(sou.google.displayName)
          expect(u.emailVerified).to.be.false
          expect(u.cohort.aliases.length).to.equal(2)
          expect(u.cohort.aliases[0].indexOf('test'+'SoumyaAcharya')).to.equal(0)
          expect(u.cohort.aliases[1]).to.equal(sou.google._json.email)          
          expect(u.cohort.engagement.visit_first).to.exist
          expect(moment(u.cohort.engagement.visit_signup).unix()).to.equal(moment(util.ObjectId2Date(sou._id)).unix())
          expect(u.cohort.engagement.visit_last).to.exists
          expect(u.cohort.engagement.visits.length).to.equal(1)
          done()


    it 'Login from a new anonymous session adds sessionID to aliases', () ->  
      $log('TODO: Write Test')  
      # expect('updates last visit')

    it 'Login from existing anonymous session leaves aliases', () ->    
      $log('TODO: Write Test')  
      # expect('updates last visit')


  #   it('login google: no google, has local, google login matching local email')
  #     expect('login success')
  #     expect('profile upsert success')  
  #     expect('google').toExist()
  #     expect('googleId').toExist()  

  #   it('login local: user has google, no local, with google email address')
  #     expect('login fail')
  #     expect('tell no matching password')  
  #     expect('ask user to google login')  

  #   it('signup local: no google, has local, singup with matching local email')
  #     expect('signup fail')
  #     expect('ask user to login')  
  # }

