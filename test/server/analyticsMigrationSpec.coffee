postTitle = "Analytics M Tests "+moment().format('X')
postSlug = postTitle.toLowerCase().replace /\ /g, '-'
postUrl = "/v1/posts/#{postSlug}"

#-- Approach

# (1) Generate sessionID on first request to the server
# (2) Alias the sessionID against the mixpanel distinctId immediately on first client
# (3) Alias the email against the sessionId on user login
# (4) Alias the userId against the email

#-- TODO
# 
# (1) Make sure we have utms available
# (2) Make sure we can see page views
# (3) Make sure we alias right with existing v0 users
 
# https://mixpanel.com/docs/integration-libraries/using-mixpanel-alias
# However, its possible to chain aliases. If you originally created an alias
# for "john@hotmail.com", and he changes his email address to "john@gmail.com", 
# you can simply create a new alias: mixpanel.alias("john@gmail.com"). We will then 
# remap "john@gmail.com" to 123123, the original value of the "john@hotmail.com" alias.

# In fact, this behavior is so undesirable that if you call alias with an existing alias 
# as the argument, Mixpanel will just silently ignore the alias request.

# (v0 signup userflow)
# OK:   email {A|S0} originalMixId               

# (v1 signup userflow)
# OK:   userId {A|S1|S} sessionID {A|C} newMixId

# (v1 login userflow of existing v0)
# OK:   
      email {A|S0} originalMixId
      sessionID {A|C} newMixId
      email {I|L1} sessionID
      userId {A|L1} email

  (but will loose non-logged in events)


# -- TODO
# -- Implement visits by day in user.cohort.engagement.visits



module.exports = ->
 
  describe "Tracking: ", ->

    @timeout(4000)

    before (done) ->
      testDb.addUserWithRole 'jkap', 'editor', ->
        testDb.initTags ->
          LOGIN 'jkap', data.users['jkap'], (s) ->
            testDb.createAndPublishPost(s, {title: postTitle,slug:postSlug}, done)


    afterEach ->
      cookie = null


    it('Alias a v0 user sessionID to email and then to userId', (done) ->
      ANONSESSION (s) ->
        anonymousId = s.sessionID
        spy = sinon.spy(analytics,'view')
        analytics.setCallback =>
          testDb.viewsByAnonymousId anonymousId, (e,r) ->
            $log 'in.callback', r.length, anonymousId        
            expect(r.length).to.equal(1)
            expect(r[0].userId).to.be.null
            expect(r[0].anonymousId).to.equal(anonymousId)          
            done()          

        spyIdentify = sinon.spy(analytics,'identify')            
        spyAlias = sinon.spy(analytics,'alias')
        
        userKey = 'existing'
        LOGIN userKey, data.users[userKey], (s) ->
          expect(spyIdentify.called).to.be.false
          expect(spyAlias.callCount).to.equal(1)                         
          expect(spyAlias.args[0][2]).to.equal('Login')              

    )

    it 'Login from two sessionIDs aliases and aliases views', (done) ->
      anonymousId = null
      anonymousId2 = null
      singup = getNewUserData('igor')

      session2Callback = (anonymousId) -> ANONSESSION (s2) ->
        anonymousId2 = s2.sessionID
        expect(anonymousId2).to.not.equal(anonymousId)          
        
        GETP(postUrl).end  ->
          GETP(postUrl).end ->

            testDb.viewsByAnonymousId anonymousId2, (e2,v2) ->
              expect(v2.length).to.equal(2)
              expect(v2[0].userId).to.be.null
              expect(v2[1].userId).to.be.null          
              expect(v2[0].anonymousId).to.equal(anonymousId2)          
              expect(v2[1].anonymousId).to.equal(anonymousId2)    

              spyIdentify = sinon.spy(analytics,'identify')            
              spyAlias = sinon.spy(analytics,'alias')

              http(global.app).post('/v1/auth/login').send(singup).set('cookie',cookie).end -> 

                expect(spyIdentify.called).to.be.false
                expect(spyAlias.callCount).to.equal(1)                         
                expect(spyAlias.args[0][2]).to.equal('Login')         

                GET '/session/full', {}, (s3) -> 
                  $log('loggedin', s3.email)              
                  testDb.viewsByUserId s3._id, (e3,v3) ->
                    expect(v3.length).to.equal(4)
                    spyIdentify.restore()
                    spyAlias.restore()
                    done()  
                    
      ANONSESSION (s) ->
        anonymousId = s.sessionID
        GETP(postUrl).end ->
          GETP(postUrl).end -> 
      
            testDb.viewsByAnonymousId anonymousId, (e1,v1) ->
              expect(v1.length).to.equal(2)
              expect(v1[0].userId).to.be.null
              expect(v1[1].userId).to.be.null          
              expect(v1[0].anonymousId).to.equal(anonymousId)          
              expect(v1[1].anonymousId).to.equal(anonymousId)                    
                  
            http(global.app).post('/v1/auth/signup').send(singup).set('cookie',cookie).end ->
              session2Callback(anonymousId)
              


# make sure we have utms

#     it('Can link an existing v0 user', function(done) {
#       expect('email aliased to userId, preserves events')
#     })


#     it('User alias', function(done) {
#       expect('pageViews linked')
#       expect('visit_first')      
#       expect('visit_last')      
#       expect('visit_signup')            
#       expect('visits')      
#       expect('copied-bookmarks')            
#       expect('copied-stack')                  
#       expect('?copied-email')                        
#     })


