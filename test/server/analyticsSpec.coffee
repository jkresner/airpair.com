db = require('./helpers/setup.db')
postTitle = "Analytics Tests "+moment().format('X')
postSlug = postTitle.toLowerCase().replace /\ /g, '-'
postUrl = "/v1/posts/#{postSlug}"

#-- Approach

# (1) Generate sessionID on first request to the server
# (2) Alias the sessionID against the mixpanel distinctId immediately on first client
# (3) Alias the users email against the sessionId on user creation


module.exports = -> describe "Tracking: ", ->

  @timeout(10000)

  before (done) ->
    SETUP.addUserWithRole 'jkap', 'editor', ->
      SETUP.initTags ->
        LOGIN 'jkap', data.users['jkap'], (s) ->
          SETUP.initWorkshops ->
            SETUP.createAndPublishPost(s, {title: postTitle,slug:postSlug}, done)

  beforeEach ->
    SETUP.clearIdentity()

  it('Can track an anonymous post view', (done) ->
    ANONSESSION (s) ->
      anonymousId = s.sessionID
      spy = sinon.spy(analytics,'view')
      analytics.setCallback =>
        db.viewsByAnonymousId anonymousId, (e,r) ->
          expect(r.length).to.equal(1)
          expect(r[0].userId).to.be.null
          expect(r[0].anonymousId).to.equal(anonymousId)
          done()

      GETP("/v1/posts/#{postSlug}?utm_source=test1src&utm_content=test1ctn")
        .set('referer', 'http://airpair.com/posts')
        .expect('Content-Type', /text/)
        .end (err, resp) ->
          if err then throw err
          expect(spy.callCount).to.equal(1)
          expect(spy.args[0][0]).to.be.undefined
          expect(spy.args[0][1]).to.exist
          expect(spy.args[0][2]).to.equal('post')
          expect(spy.args[0][3]).to.equal(postTitle)
          expect(spy.args[0][4].tags).to.exist
          expect(spy.args[0][5].referer).to.equal('http://airpair.com/posts')
          expect(spy.args[0][5].utms.utm_source).to.equal('test1src')
          expect(spy.args[0][5].utms.utm_content).to.equal('test1ctn')
          expect(spy.args[0][5].utms.utm_medium).to.be.undefined
          expect(spy.args[0][5].utms.utm_term).to.be.undefined
          expect(spy.args[0][5].utms.utm_campaign).to.be.undefined
          expect(spy.args[0][6]).to.be.undefined
          spy.restore()
  )


  it 'Can track logged in post view', (done) ->
    addLocalUser 'krez', {}, (userKey) ->
      spy = sinon.spy(analytics,'view')
      userId = data.users[userKey]._id
      analytics.setCallback ->
        testDb.viewsByUserId userId, (e,r) ->
          expect(r.length).to.equal(1)
          expect(_.idsEqual(r[0].userId,userId)).to.be.true
          expect(r[0].anonymousId).to.be.null
          done()

      LOGIN userKey, data.users[userKey], (s) ->
        GETP("/v1/posts/#{postSlug}?utm_campaign=test2nm")
          .set('referer', 'http://www.airpair.com/posts')
          .expect('Content-Type', /text/)
          .end (err, resp) ->
            if (err) then throw err
            expect(spy.callCount).to.equal(1)
            expect(spy.args[0][0]._id).to.equal(s._id)
            expect(spy.args[0][1]).to.be.null
            expect(spy.args[0][2]).to.equal('post')
            expect(spy.args[0][3]).to.equal(postTitle)
            expect(spy.args[0][4].tags).to.exist
            expect(spy.args[0][5].referer).to.equal('http://www.airpair.com/posts')
            expect(spy.args[0][5].utms.utm_source).to.be.undefined
            expect(spy.args[0][5].utms.utm_content).to.be.undefined
            expect(spy.args[0][5].utms.utm_medium).to.be.undefined
            expect(spy.args[0][5].utms.utm_term).to.be.undefined
            expect(spy.args[0][5].utms.utm_campaign).to.equal('test2nm')
            expect(spy.args[0][6]).to.be.undefined
            spy.restore()



  # it('Can track post view action', function(done) {
  #   //-- will have to be implemented in a front-end integration test
  #   $log('TODO', "Required front end test")
  #   done()
  # //   expect('analytics track called')
  # //   expect('analytics track has time to action')
  # //   expect('expect userId linked to event')
  # //   expect('expect sessionId (if anonymous) linked to event')
  # Anonymous View a post
  # View login
  # View signup
  # Signup
  # View a workshop

  # expect events
  # View (server:distinctId:sessionId)
  # Click CTA (client:distinctId:sessionId)
  # Route Login (client:distinctId:sessionId)
  # Route Signup (client:distinctId:sessionId)
  # Submit Local Signup (server:distinctId:sessionId)
  # Signup (server:distinctId:userId)
  # View (server:distinctId:userId)
  # })


  it 'Aliases anonymous user with new user signup', (done) ->
    ANONSESSION (s) ->
      anonymousId = s.sessionID

      GETP("/v1/posts/#{postSlug}?utm_campaign=testSingup&utm_source=test8src&utm_content=test8ctn")
        .set('referer', 'http://twitter.co')
        .end (err, resp) ->
          spy = sinon.spy(analytics,'alias')
          singup = getNewUserData('pgap')
          http(global.app).post('/v1/auth/signup').send(singup)
            .set('cookie',cookie)
            .end (err, resp) ->
              GET '/session/full', {}, (sFull) ->
                userId = sFull._id
                expect(sFull._id).to.exist
                expect(sFull.name).to.equal(singup.name)
                expect(sFull.tags).to.be.undefined
                expect(spy.callCount).to.equal(1)
                expect(spy.args[0][0]).to.equal(s.sessionID)
                spy.restore()
                testDb.viewsByUserId userId, (e,r) ->
                  expect(r.length).to.equal(1)
                  expect(_.idsEqual(r[0].userId,userId)).to.be.true
                  expect(_.idsEqual(r[0].anonymousId,s.sessionID)).to.be.true
                  done()


  it 'Can track an anonymous workshop view', (done) ->
    ANONSESSION (s) ->
      anonymousId = s.sessionID
      spy = sinon.spy(analytics,'view')

      analytics.setCallback =>
        spy.restore()
        done()

      GETP("/v1/workshops/simplifying-rails-tests")
        .set('referer', 'http://airpair.com/workshops')
        .expect('Content-Type', /text/)
        .end (err, resp) ->
          if (err) then throw err
          expect(spy.callCount).to.equal(1)
          expect(spy.args[0][0]).to.be.undefined
          expect(spy.args[0][1]).to.exist
          expect(spy.args[0][2]).to.equal('workshop')
          expect(spy.args[0][3]).to.equal('Breaking Up (with) Your Test Suite')
          expect(spy.args[0][4].tags).to.exist
          expect(spy.args[0][5].referer).to.equal('http://airpair.com/workshops')
          expect(spy.args[0][5].campaign).to.be.undefined
          expect(spy.args[0][6]).to.be.undefined


  it 'Can track logged in workshop view', (done) ->
    addLocalUser 'joem', {}, (userKey) ->
      spy = sinon.spy(analytics,'view')
      analytics.setCallback(done)
      LOGIN userKey, data.users[userKey], (s) ->
        GETP("/v1/workshops/simplifying-rails-tests?utm_campaign=test4nm&utm_medium=test4md")
          .set('referer', 'http://www.airpair.com/workshops')
          .expect('Content-Type', /text/)
          .end (err, resp) ->
            if (err) then throw err
            expect(spy.callCount).to.equal(1)
            expect(spy.args[0][0]._id).to.equal(s._id)
            expect(spy.args[0][1]).to.be.null
            expect(spy.args[0][2]).to.equal('workshop')
            expect(spy.args[0][3]).to.equal('Breaking Up (with) Your Test Suite')
            expect(spy.args[0][4].tags).to.exist
            expect(spy.args[0][5].referer).to.equal('http://www.airpair.com/workshops')
            expect(spy.args[0][5].utms.utm_source).to.be.undefined
            expect(spy.args[0][5].utms.utm_content).to.be.undefined
            expect(spy.args[0][5].utms.utm_medium).to.equal('test4md')
            expect(spy.args[0][5].utms.utm_term).to.be.undefined
            expect(spy.args[0][5].utms.utm_campaign).to.equal('test4nm')
            expect(spy.args[0][6]).to.be.undefined
            spy.restore()


  it 'Login local from existing sessionID does not alias', (done) ->
    ANONSESSION ->
      GETP("/v1/posts/#{postSlug}").end (err, resp) ->
      singup = getNewUserData('pgap')
      http(global.app).post('/v1/auth/signup').send(singup).set('cookie',cookie).end (e1, r1) ->
        GET '/session/full', {}, (s) ->
          spyIdentify = sinon.spy(analytics,'identify')
          spyAlias = sinon.spy(analytics,'alias')
          GETP('/v1/auth/logout').end (e2, r2) ->
            http(global.app).post('/v1/auth/login').send(singup).set('cookie',cookie).end (e3, r3) ->
              expect(spyIdentify.callCount).to.equal(1)
              expect(spyIdentify.args[0][2]).to.equal('Login')
              expect(spyAlias.called).to.be.false
              spyIdentify.restore()
              spyAlias.restore()
              done()


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

              # expect(spyIdentify.called).to.be.false
              # expect(spyAlias.callCount).to.equal(1)
              # expect(spyAlias.args[0][2]).to.equal('Login')

              expect(spyIdentify.called).to.be.true
              expect(spyAlias.called).to.be.false
              # expect(spyAlias.args[0][2]).to.equal('Login')


              GET '/session/full', {}, (s3) ->
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


