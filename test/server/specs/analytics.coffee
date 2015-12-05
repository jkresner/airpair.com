#-- Approach

# (1) Generate sessionID on first request to the server
# (2) Alias the sessionID against the mixpanel distinctId immediately on first client
# (3) Alias the users email against the sessionId on user creation

views = ->


  IT 'Can track an anonymous post view', ->
    ANONSESSION (s) ->
      anonymousId = s.sessionID
      analytics.setCallback =>
        viewCheck = => DB.docsByQuery 'View', {anonymousId}, (r) ->
          expect(r.length).to.equal(1)
          expect(r[0].userId).to.be.undefined
          expect(r[0].anonymousId).to.equal(anonymousId)
          EXPECT.equalIds(r[0].objectId, "55c02b22d131551100f1f0da")
          expect(r[0].ip).to.exist
          expect(r[0].type).to.equal('post')
          expect(r[0].url).to.equal(publishedPostUrl)
          expect(r[0].ua).to.equal('Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0')
          expect(r[0].referer).to.equal('http://airpair.com/posts')
          {campaign} = r[0]
          expect(campaign.source).to.equal('test1src')
          expect(campaign.content).to.equal('test1ctn')
          expect(campaign.medium).to.be.undefined
          expect(campaign.term).to.be.undefined
          expect(campaign.campaign).to.be.undefined
          DONE()
        _.delay(viewCheck, 100)
      PAGE "#{publishedPostUrl}?utm_source=test1src&utm_content=test1ctn", {referer:'http://airpair.com/posts'}, ->


  IT 'Can track an anonymous ad click view', ->
    ANONSESSION (s) ->
      anonymousId = s.sessionID
      spy = STUB.spy(analytics,'view')
      analytics.setCallback =>
        viewCheck = => DB.docsByQuery 'View', {anonymousId}, (r) ->
          expect(r.length).to.equal(1)
          expect(r[0].userId).to.be.undefined
          expect(r[0].anonymousId).to.equal(anonymousId)
          expect(r[0].ip).to.exist
          expect(r[0].ua).to.exist
          expect(r[0].type).to.equal('ad')
          expect(r[0].referer).to.equal('https://www.airpair.com/js/js-framework-comparison')
          expect(r[0].url).to.equal('https://keen.io/?utm_source=airpair&utm_medium=banner&utm_campaign=custom_analytics')
          EXPECT.equalIds(r[0].objectId,"55aa28f643f81ad565104e6f")
          DONE()
        _.delay(viewCheck, 100)

      PAGE "/visit/keen.io-072015", {status:302,referer:'https://www.airpair.com/js/js-framework-comparison'}, ->
        expect(spy.callCount).to.equal(1)
        expect(spy.args[0][0]).to.be.undefined
        expect(spy.args[0][1]).to.exist
        expect(spy.args[0][2]).to.equal('ad')
        expect(spy.args[0][3]).to.equal('Keen.io jul custom analytics')
        # expect(spy.args[0][4].tags).to.exist
        expect(spy.args[0][5].referer).to.equal('https://www.airpair.com/js/js-framework-comparison')
        expect(spy.args[0][5].utms).to.be.undefined
        expect(spy.args[0][6]).to.be.undefined


  IT 'Can track logged in post view', ->
    STORY.newUser 'krez', (s) ->
      spy = STUB.spy(analytics,'view')
      userId = ObjectId(s._id)
      analytics.setCallback =>
        viewCheck = => DB.docsByQuery 'View', {userId}, (r) ->
          expect(spy.callCount).to.equal(1)
          expect(r.length).to.equal(1)
          EXPECT.equalIds(r[0].userId,userId)
          expect(r[0].anonymousId).to.be.undefined
          {campaign} = r[0]
          expect(campaign.source).to.be.undefined
          expect(campaign.content).to.be.undefined
          expect(campaign.medium).to.be.undefined
          expect(campaign.term).to.be.undefined
          expect(campaign.name).to.equal('test2nm')
          LOGIN {key:'admin'}, ->
            GET "/adm/views/user/#{userId}", {}, (r2) ->
              expect(r2.length).to.equal(1)
              EXPECT.equalIds(r2[0].userId,userId)
              DONE()
        _.delay(viewCheck, 150)

      PAGE "#{publishedPostUrl}?utm_campaign=test2nm", {}, ->

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


  IT 'Aliases anonymous user with new user signup', ->
    signup = DATA.newSignup("Will Moss")
    DB.removeDocs 'User', { name: signup.name }, ->
    ANONSESSION (s) ->
      anonymousId = s.sessionID
      utms = 'utm_campaign=testSingup&utm_source=test8src&utm_content=test8ctn'
      PAGE "#{publishedPostUrl}?#{utms}", {}, ->
        spy = STUB.spy(analytics,'alias')
        SUBMIT '/auth/signup', signup, {}, (sFull) ->
          userId = ObjectId(sFull._id)
          expect(sFull._id).to.exist
          EXPECT.startsWith(sFull.name, "Will Moss")
          expect(spy.callCount).to.equal(1)
          EXPECT.equalIds(spy.args[0][0]._id, sFull._id)
          expect(spy.args[0][1]).to.equal(s.sessionID)
          expect(spy.args[0][2]).to.equal('signup')
          DB.docsByQuery 'View', {userId}, (r) ->
            expect(r.length).to.equal(1)
            EXPECT.equalIds(r[0].userId,userId)
            EXPECT.equalIds(r[0].anonymousId,s.sessionID)
            DONE()



  it 'Can track an anonymous workshop view'
  #   ANONSESSION (s) ->
  #     anonymousId = s.sessionID
  #     spy = sinon.spy(analytics,'view')

  #     GETP("/any-tag/workshops/simplifying-rails-tests")
  #       .set('referer', 'http://airpair.com/workshops')
  #       .expect('Content-Type', /text/)
  #       .end (err, resp) ->
  #         if (err) then throw err
  #         expect(spy.callCount).to.equal(1)
  #         expect(spy.args[0][0]).to.be.undefined
  #         expect(spy.args[0][1]).to.exist
  #         expect(spy.args[0][2]).to.equal('workshop')
  #         expect(spy.args[0][3]).to.equal('Breaking Up (with) Your Test Suite')
  #         expect(spy.args[0][4].tags).to.exist
  #         expect(spy.args[0][5].referer).to.equal('http://airpair.com/workshops')
  #         expect(spy.args[0][5].campaign).to.be.undefined
  #         expect(spy.args[0][6]).to.be.undefined
  #         spy.restore()
  #         DONE()


  IT 'Login local from existing sessionID does not alias', ->
    singup = DATA.newSignup("Jason Pierce")
    ANONSESSION ->
      utms = ''
      PAGE "#{publishedPostUrl}?#{utms}", {}, ->
      SUBMIT '/auth/signup', singup, {}, (r) ->
        GET '/session/full', (s) ->
          expect(s._id).to.exist
          PAGE '/logout', { status:302 }, ->
            spyAlias = STUB.spy(analytics,'alias')
            SUBMIT '/auth/login', singup, {}, (r3) ->
              expect(spyAlias.callCount).to.equal(1)
              EXPECT.equalIds(spyAlias.args[0][0]._id, s._id)
              expect(spyAlias.args[0][2]).to.equal('login')
              DONE()


  IT 'Login from two sessionIDs aliases and aliases views', ->
    singup = DATA.newSignup("Somik Rana")
    anonymousId = null
    anonymousId2 = null

    session2Callback = (anonymousId) -> ANONSESSION (s2) ->
      anonymousId2 = s2.sessionID
      expect(anonymousId2).to.not.equal(anonymousId)

      PAGE publishedPostUrl, {}, ->
        PAGE publishedPostUrl, {}, ->

          DB.docsByQuery 'View', {anonymousId:anonymousId2}, (v2) ->
            expect(v2.length).to.equal(2)
            expect(v2[0].userId).to.be.undefined
            expect(v2[1].userId).to.be.undefined
            expect(v2[0].anonymousId).to.equal(anonymousId2)
            expect(v2[1].anonymousId).to.equal(anonymousId2)

            # spyIdentify = STUB.spy(analytics,'identify')
            spyAlias = STUB.spy(analytics,'alias')

            SUBMIT '/auth/login', singup, {}, ->

              # expect(spyIdentify.called).to.be.false
              # expect(spyAlias.callCount).to.equal(1)
              # expect(spyAlias.args[0][2]).to.equal('Login')

              # expect(spyIdentify.called).to.be.true
              expect(spyAlias.called).to.be.true
              # expect(spyAlias.args[0][2]).to.equal('Login')

              GET '/session/full', (s3) ->
                userId = ObjectId(s3._id)
                viewCheck = => DB.docsByQuery 'View', {userId}, (v3) ->
                  expect(v3.length).to.equal(4)
                  DONE()
                _.delay(viewCheck, 50)

    ANONSESSION (s) ->
      anonymousId = s.sessionID
      PAGE publishedPostUrl, {}, ->
        PAGE publishedPostUrl, {}, ->

          DB.docsByQuery 'View', {anonymousId}, (v1) ->
            expect(v1.length).to.equal(2)
            expect(v1[0].userId).to.be.undefined
            expect(v1[1].userId).to.be.undefined
            expect(v1[0].anonymousId).to.equal(anonymousId)
            expect(v1[1].anonymousId).to.equal(anonymousId)

          SUBMIT '/auth/signup', singup, {}, (s0) ->
            session2Callback(anonymousId)


module.exports = ->

  @timeout(10000)

  before (done) ->
    SETUP.analytics.on()
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    {higherOrder} = FIXTURE.posts
    DB.ensureDoc 'Post', higherOrder, ->
      global.publishedPostUrl = higherOrder.meta.canonical.replace('https://www.airpair.com', '')
      done()

  after ->
    global.publishedPostUrl = undefined


  DESCRIBE("Views", views)
