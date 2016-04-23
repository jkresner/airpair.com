#-- Approach

# (1) Generate sessionID on first request to the server
# (2) Alias the sessionID against the mixpanel distinctId immediately on first client
# (3) Alias the users email against the sessionId on user creation

views = ->


  IT 'Track anonymous post view', ->
    ANONSESSION (s) ->
      sId = s.sessionID
      viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
        expect(r.length).to.equal(1)
        expect(r[0].uId).to.be.undefined
        expect(r[0].sId).to.equal(sId)
        EXPECT.equalIds(r[0].oId, "55c02b22d131551100f1f0da")
        expect(r[0].ip).to.exist
        expect(r[0].type).to.equal('post')
        expect(r[0].url).to.equal(publishedPostUrl)
        expect(r[0].ua).to.equal('Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0')
        expect(r[0].ref).to.equal('http://airpair.com/posts')
        {utm} = r[0]
        expect(utm.source).to.equal('test1src')
        expect(utm.content).to.equal('test1ctn')
        expect(utm.medium).to.be.undefined
        expect(utm.term).to.be.undefined
        expect(utm.campaign).to.be.undefined
        DONE()
      _.delay(viewCheck, 300)
      PAGE "#{publishedPostUrl}?utm_source=test1src&utm_content=test1ctn", {referer:'http://airpair.com/posts'}, ->



  IT 'Track authed post view', ->
    DB.removeDocs 'User', { 'auth.gh.id': 215283 }, ->
    LOGIN 'admb', (s) ->
      spy = STUB.spy(analytics,'view')
      uId = ObjectId(s._id)
      viewCheck = => DB.docsByQuery 'View', {uId}, (r) ->
        expect(spy.callCount).to.equal(1)
        expect(r.length).to.equal(1)
        EXPECT.equalIds(r[0].uId,uId)
        expect(r[0].sId).to.exist
        {utm} = r[0]
        expect(utm.source).to.be.undefined
        expect(utm.content).to.be.undefined
        expect(utm.medium).to.be.undefined
        expect(utm.term).to.be.undefined
        expect(utm.campaign).to.equal('test2nm')
        DONE()
      _.delay(viewCheck, 150)
      PAGE "#{publishedPostUrl}?utm_campaign=test2nm", {}, ->



  IT 'Track anonymous ad (click) view', ->
    spy = STUB.spy(analytics, 'view')
    ANONSESSION (s) ->
      sId = s.sessionID
      viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
        expect(r.length).to.equal(1)
        expect(Object.keys(r[0]).length).to.equal(9)
        expect(r[0]._id).to.exist
        expect(r[0].app).to.equal('apcom')
        EXPECT.equalIds(r[0].oId,"56f97837b60d99e0d793cafc")
        expect(r[0].sId).to.equal(sId)
        expect(r[0].uId).to.be.undefined
        expect(r[0].type).to.equal('ad')
        expect(r[0].ip).to.exist
        expect(r[0].ua).to.exist
        expect(r[0].ref).to.equal('https://www.airpair.com/js/js-framework-comparison')
        expect(r[0].url).to.equal('https://signup.heroku.com/nodese?c=70130000000NYVFAA4&utm_campaign=Display%20-Endemic%20-Airpair%20-Node%20-%20Signup&utm_medium=display&utm_source=airpair&utm_term=node&utm_content=deploy-free')
        DONE()

      PAGE "/visit/heroku-160328-node.js", {status:302,referer:'https://www.airpair.com/js/js-framework-comparison'}, ->
        expect(spy.callCount).to.equal(1)
        expect(spy.args[0][1]).to.equal('ad')
        expect(spy.args[0][2]).to.exist
        expect(spy.args[0][2].tag).to.equal('node.js')
        expect(spy.args[0][2].utm).to.be.undefined
        _.delay(viewCheck, 100)


  IT 'Aliases anonymous sessionId with new signup user._id', ->
    DB.removeDocs 'User', { 'auth.gh.id': 1655968 }, ->
    ANONSESSION (s) ->
      sId = s.sessionID
      utms = 'utm_campaign=testSingup&utm_source=test8src&utm_content=test8ctn'
      PAGE "#{publishedPostUrl}?#{utms}", {}, ->
        spy = STUB.spy(analytics,'event')
        SIGNUP 'tmot', (sFull) ->
          expect(spy.callCount).to.equal(1)
          expect(sFull._id).to.exist
          uId = ObjectId(sFull._id)
          EXPECT.startsWith(sFull.name, "Todd Motto")
          EXPECT.equalIds(spy.args[0][2].user._id, sFull._id)
          EXPECT.startsWith(spy.args[0][2].user.name, 'Todd Motto')
          expect(spy.args[0][1]).to.equal("signup:oauth:gh")
          # expect(spy.args[0][1]).to.equal(s.sessionID)
          # expect(spy.args[0][2]).to.equal('signup')
          viewCheck = => DB.docsByQuery 'View', {uId}, (r) ->
            expect(r.length).to.equal(1)
            expect(Object.keys(r[0]).length).to.equal(10)
            EXPECT.equalIds(r[0].uId, uId)
            EXPECT.equalIds(r[0].sId, s.sessionID)
            expect(r[0].app).to.equal('apcom')
            EXPECT.equalIds(r[0].oId, FIXTURE.posts.higherOrder._id)
            expect(r[0].type).to.equal('post')
            expect(r[0].ref).to.be.undefined
            expect(r[0].url).to.equal("#{publishedPostUrl}")
            expect(r[0].ip).to.exist
            expect(r[0].ua).to.exist
            expect(Object.keys(r[0].utm).length).to.equal(3)
            expect(r[0].utm.campaign).to.equal('testSingup')
            expect(r[0].utm.source).to.equal('test8src')
            expect(r[0].utm.content).to.equal('test8ctn')
            DONE()
          _.delay(viewCheck, 150)



  IT 'Track anon workshop view', ->
    ANONSESSION (s) ->
      sId = s.sessionID
      spy = sinon.spy(analytics,'view')
      PAGE "/ruby-on-rails/workshops/simplifying-rails-tests", { 'referer':'http://airpair.com/workshops' }, (html) ->
        expect(spy.callCount).to.equal(1)
        expect(spy.args[0][1]).to.equal('workshop')
        EXPECT.equalIds(spy.args[0][2]._id, '53dc048a6a45650200845f23')
        expect(spy.args[0][2].url).to.equal("/ruby-on-rails/workshops/simplifying-rails-tests")
        viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
          expect(r.length).to.equal(1)
          expect(r[0].uId).to.be.undefined
          expect(r[0].utm).to.be.undefined
          expect(Object.keys(r[0]).length).to.equal(9)
          EXPECT.equalIds(r[0].sId, s.sessionID)
          expect(r[0].app).to.equal('apcom')
          EXPECT.equalIds(r[0].oId, '53dc048a6a45650200845f23')
          expect(r[0].type).to.equal('workshop')
          expect(r[0].ref).to.equal('http://airpair.com/workshops')
          expect(r[0].url).to.equal("/ruby-on-rails/workshops/simplifying-rails-tests")
          expect(r[0].ua).to.exist
          expect(r[0].ip).to.exist
          expect(r[0]._id).to.exist
          DONE()
        _.delay(viewCheck, 150)



aliases = ->


  IT 'sessionID is not duplicate in aliases with multiple logins', ->
    utms = ''
    ANONSESSION (anon) ->
      {sessionID} = anon
      expect(sessionID).to.exist
      PAGE "#{publishedPostUrl}?#{utms}", {}, ->
        SIGNUP 'dros', (s) ->
          expect(s._id).to.exist
          DB.docById 'User', s._id, (rUser1) ->
            expect(rUser1.cohort.aliases.length).to.equal(1)
            expect(rUser1.cohort.aliases[0]).to.equal(sessionID)
          PAGE '/auth/logout', { status:302 }, ->
            spyAlias = STUB.spy(analytics,'event')
            LOGIN s.username, (s2) ->
              expect(spyAlias.callCount).to.equal(1)
              # $log('spyAlias.args[0][0].analytics', spyAlias.args[0][0].analytics)
              expect(spyAlias.args[0][1]).to.equal('login:oauth:gh')
              expect(spyAlias.args[0][0].analytics.alias).to.exist
              EXPECT.equalIds(spyAlias.args[0][0].analytics.alias._id, s._id)
              EXPECT.equalIds(spyAlias.args[0][2].user._id, s._id)
              dbCheck = ->
                DB.docsByQuery 'View', {sId:sessionID}, (r) ->
                  expect(r.length).to.equal(1)
                  EXPECT.equalIds(r[0].uId, s._id)
                  DB.docsByQuery 'Event', {sId:sessionID}, (r2) ->
                    expect(r2.length).to.equal(3)
                    # $log('r2', r2)
                    EXPECT.equalIds(r2[0].uId, s._id)
                    EXPECT.equalIds(r2[1].uId, s._id)
                    EXPECT.equalIds(r2[2].uId, s._id)
                    DB.docById 'User', s._id, (rUser2) ->
                      expect(rUser2.cohort.aliases.length).to.equal(1)
                      expect(rUser2.cohort.aliases[0]).to.equal(sessionID)
                      DONE()
              _.delay(dbCheck, 250)


  IT 'Two sessionIDs added from unique sessions', ->
    DB.removeDocs 'User', { 'auth.gh.id': 465691 }, ->
    sessionId1 = null
    sessionId2 = null

    session2Callback = () -> ANONSESSION (s2) ->

      sessionId2 = s2.sessionID
      expect(sessionId2).to.not.equal(sessionId1)

      PAGE "/job/#{FIXTURE.requests.aJob._id}", {}, ->
        PAGE "/review/#{FIXTURE.requests.aJob._id}", {}, ->

          DB.docsByQuery 'views', {sId:sessionId2}, (v2) ->
            expect(v2.length).to.equal(2)
            expect(v2[0].uId).to.be.undefined
            expect(v2[1].uId).to.be.undefined
            expect(v2[0].sId).to.equal(sessionId2)
            expect(v2[1].sId).to.equal(sessionId2)

            LOGIN 'mkod', ->
              # expect(spyAlias.callCount).to.equal(1)
              # expect(spyAlias.args[0][2]).to.equal('Login')

              # expect(spyIdentify.called).to.be.true
              # expect(spyAlias.called).to.be.true
              # expect(spyAlias.args[0][2]).to.equal('Login')

              GET '/session/full', (s3) ->
                userId = ObjectId(s3._id)
                viewCheck = => DB.docsByQuery 'View', {uId:userId}, (v3) ->
                  expect(v3.length).to.equal(4)
                  DB.docById 'User', s3._id, (rUser) ->
                    expect(rUser.cohort.aliases.length).to.equal(2)
                    expect(rUser.cohort.aliases[0]).to.equal(sessionId1)
                    expect(rUser.cohort.aliases[1]).to.equal(sessionId2)
                    DONE()
                _.delay(viewCheck, 50)

    ANONSESSION (s) ->
      sessionId1 = s.sessionID
      PAGE "/job/#{FIXTURE.requests.aJob._id}", {}, ->
        PAGE "/review/#{FIXTURE.requests.aJob._id}", {}, ->
          DB.docsByQuery 'View', {sId:sessionId1}, (v1) ->
            expect(v1.length).to.equal(2)
            expect(v1[0].ud).to.be.undefined
            expect(v1[1].uId).to.be.undefined
            expect(v1[0].sId).to.equal(sessionId1)
            expect(v1[1].sId).to.equal(sessionId1)
            expect(v1[0].type).to.equal('job')
            expect(v1[1].type).to.equal('job')
          LOGIN 'mkod', (s) ->
            session2Callback()



impressions = ->

  SKIP "Tracks single impression for 2 x repeat of same ad on page"



module.exports = ->

  @timeout(10000)

  before (done) ->
    STUB.analytics.on()
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureExpert 'byrn', ->
    DB.ensureDoc 'Request', FIXTURE.requests.aJob, -> DB.ensureDoc 'User', FIXTURE.users.ricd, ->
    {higherOrder} = FIXTURE.posts
    DB.ensureDoc 'Post', higherOrder, ->
      global.publishedPostUrl = higherOrder.htmlHead.canonical.replace('https://www.airpair.com', '')
      done()

  after ->
    global.publishedPostUrl = undefined


  DESCRIBE("Views", views)
  DESCRIBE("Aliases", aliases)
  DESCRIBE("Impressions", impressions)




  # # it('Can track post view action', function(done) {
  # #   //-- will have to be implemented in a front-end integration test
  # #   $log('TODO', "Required front end test")
  # #   done()
  # # //   expect('analytics track called')
  # # //   expect('analytics track has time to action')
  # # //   expect('expect userId linked to event')
  # # //   expect('expect sessionId (if anonymous) linked to event')
  # # Anonymous View a post
  # # View login
  # # View signup
  # # Signup
  # # View a workshop

  # # expect events
  # # View (server:distinctId:sessionId)
  # # Click CTA (client:distinctId:sessionId)
  # # Route Login (client:distinctId:sessionId)
  # # Route Signup (client:distinctId:sessionId)
  # # Submit Local Signup (server:distinctId:sessionId)
  # # Signup (server:distinctId:userId)
  # # View (server:distinctId:userId)
  # # })
