
Opts = Object.assign

expectSessionNotStored = (session, cb) ->
  a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/
  expect(session.sessionID).to.match(a_uid)
  DB.docsByQuery 'Session', {_id:session.sessionID}, (s) ->
    expect(s.length).to.equal(0)
    DB.docsByQuery 'View', { anonymousId:session.sessionID }, (views) ->
      expect(views.length).to.equal(0)
      cb()


expectSessionStored = (session, cb) ->
  a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/
  expect(session.sessionID).to.match(a_uid)
  DB.docsByQuery 'Session', {_id:session.sessionID}, (s) ->
    expect(s.length).to.equal(1)
    cb()


api = ->

  before (done) ->
    STUB.analytics.on()
    done()


  IT 'Returns empty 200 on bad urls for bad bots', ->
    PAGE '/fasdfasdfaeed', Opts({status:200},BADBot), (resp) ->
      expect(resp).to.equal('')
      PAGE '/fasdfasdfaeed', Opts({status:404},GOODBot), (resp2) ->
        EXPECT.contains(resp2, ">Page not found</h")
        DONE()


  IT 'Returns empty 200 on good urls for bad bots', ->
    PAGE '/', Opts({status:200},BADBot), (resp) ->
      expect(resp).to.equal('')
      PAGE '/', Opts({status:200},GOODBot), (resp2) ->
        EXPECT.contains(resp2, "<title>Software Micro-Consulting via Video Chat | AirPair</title>")
        DONE()


  IT 'Does not exec analytics or store session on 404', ->
    trackSpy = STUB.spy(analytics, 'echo')
    PAGE '/feed', Opts({status:404}, UAUser), (resp) ->
      # global.cookie = resp.headers['set-cookie']
      # expect(global.cookie).to.be.undefined
      expect(trackSpy.callCount).to.equal(0)
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


  IT '/ (unauthenticated) Persists session for uaFireFox', ->
    viewSpy1 = STUB.spy(analytics, 'view')
    PAGE '/', Opts({status:200}, UAUser), (resp) ->
      GET '/session/full', (s) ->
        expect(viewSpy1.callCount).to.equal(0)
        expect(s.authenticated).to.equal(false)
        expectSessionStored s, DONE


  SKIP '/angularjs (unauthenticated) Persists session or uaFireFox', ->
    viewSpy = STUB.spy(analytics, 'view')
    PAGE '/angularjs', Opts({status:200}, UAUser), (resp) ->
      GET '/session/full', (s) ->
        expect(viewSpy.calledOnce).to.be.true
        expect(s.authenticated).to.equal(false)
        expectSessionStored s, ->
          DB.docsByQuery 'View', { anonymousId:s.sessionID }, (views) ->
            expect(views.length).to.equal(1)
            expect(views[0].url).to.equal('/angularjs')
            expect(views[0].type).to.equal('tag')
            expect(views[0].campaign).to.be.undefined
            expect(views[0].userId).to.be.undefined
            expect(views[0].anonymousId).to.equal(s.sessionID)
            DONE()


  SKIP '/angularjs (no user-agent) Does not persist session', ->
    viewSpy = STUB.spy(analytics, 'view')
    PAGE '/angularjs', Opts({status:200}, UANone), (resp) ->
      expect(viewSpy.callCount).to.equal(0)
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


  SKIP '/angularjs (uaGooglebot) does not persist session or view', ->
    viewSpy = STUB.spy(analytics, 'view')
    PAGE '/angularjs', Opts({status:200}, GOODBot), (resp) ->
      EXPECT.contains(resp, "AngularJS experts</h")
      expect(viewSpy.callCount).to.equal(0)
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


  SKIP '/angularjs (uaUser) Persists utms and referer', ->
    viewSpy = STUB.spy(analytics, 'view')
    ref = 'https://www.airpair.com/'
    utms = 'utm_source=team-email&utm_medium=email&utm_term=angular-workshops&utm_content=nov14-workshops-ty&utm_campaign=wks14-4'
    PAGE "/angularjs?#{utms}", Opts({status:200,referer:ref}, UAUser), (resp) ->
      expect(viewSpy.calledOnce).to.be.true
      GET '/session/full', (s) ->
        expect(s.authenticated).to.equal(false)
        expectSessionStored s, ->
          DB.docsByQuery 'View', { anonymousId:s.sessionID }, (views) ->
            expect(views.length).to.equal(1)
            expect(views[0].url).to.equal('/angularjs')
            expect(views[0].type).to.equal('tag')
            expect(views[0].campaign).to.exist
            expect(views[0].referer).to.equal(ref)
            expect(views[0].campaign.source).to.equal('team-email')
            expect(views[0].campaign.medium).to.equal('email')
            expect(views[0].campaign.term).to.equal('angular-workshops')
            expect(views[0].campaign.content).to.equal('nov14-workshops-ty')
            expect(views[0].campaign.name).to.equal('wks14-4')
            DONE()

  #   it 'Views from bots are not saved', (d) ->
  #     done = createCountedDone(8, d)
  #     checkViewIsNotSaved 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', done
  #     checkViewIsNotSaved 'Mozilla/5.0 (compatible; GurujiBot/1.0; +http://www.guruji.com/en/WebmasterFAQ.html)', done
  #     checkViewIsNotSaved 'Twitterbot', done
  #     checkViewIsNotSaved 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)', done
  #     checkViewIsNotSaved 'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)', done
  #     checkViewIsNotSaved 'msnbot-media/1.1 (+http://search.msn.com/msnbot.htm)', done
  #     checkViewIsNotSaved 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)', done
  #     checkViewIsNotSaved 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', done

  #   it 'Views are saved for firefox', (done) ->
  #     checkViewIsSaved 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0', done

  #   it 'Views are saved for chrome', (done) ->
  #     checkViewIsSaved 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25', done

  #   it 'Views are saved for safari', (done) ->
  #     checkViewIsSaved 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36', done


module.exports = ->

  before (done) ->
    {uaFirefox,uaGooglebot,uk_lddc_bot} = FIXTURE.http
    global.BADBot = {ua:uk_lddc_bot,unauthenticated:true}
    global.GOODBot = {ua:uaGooglebot,unauthenticated:true}
    global.UANone = {ua:'null',unauthenticated:true}
    global.UAUser = {ua:uaFirefox}
    {higherOrder} = FIXTURE.posts
    DB.ensureDoc 'Post', higherOrder, ->
      global.publishedPostUrl = higherOrder.meta.canonical.replace('https://www.airpair.com', '')
      done()

  after ->
    global.BADBot = undefined
    global.GOODBot = undefined
    global.UANone = undefined
    global.UAUser = undefined
    global.publishedPostUrl = undefined


  DESCRIBE("API: ", api)
