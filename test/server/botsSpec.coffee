uaFirefox = 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0'
uaGooglebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/


module.exports = ->


  before (done) ->
    testDb.initTags(done)

  after (done) ->
    done()

  afterEach () ->
    global.cookie = null


  expectSessionNotStored = (session, cb) ->
    expect(session.sessionID).to.match(a_uid)
    testDb.ModelById 'Session', session.sessionID, (e, s) ->
      expect(s).to.be.null
      testDb.viewsByAnonymousId session.sessionID, (e, views) ->
        expect(views.length).to.equal(0)
        cb()


  expectSessionToBeStored = (session, cb) ->
    expect(session.sessionID).to.match(a_uid)
    testDb.ModelById 'Session', session.sessionID, (e, s) ->
      expect(s).to.exist
      cb()


  it 'Persists a session for a browser (FireFox)', (done) ->
    viewSpy1 = sinon.spy(analytics, 'view')
    GETP('/about').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      GET '/session/full', {}, (s) =>
        expect(viewSpy1.callCount).to.equal(0)
        expect(s.authenticated).to.equal(false)
        expectSessionToBeStored(s, done)
        viewSpy1.restore()


  it 'Persists a session and view for /angularjs from a browser (FireFox)', (done) ->
    viewSpy2 = sinon.spy(analytics, 'view')
    GETP('/angularjs').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      GET '/session/full', {}, (s) =>
        expect(viewSpy2.calledOnce).to.be.true
        expect(s.authenticated).to.equal(false)
        expectSessionToBeStored s, ->
          testDb.viewsByAnonymousId s.sessionID, (e, views) ->
            expect(views.length).to.equal(1)
            expect(views[0].url).to.equal('/angularjs')
            expect(views[0].type).to.equal('tag')
            expect(views[0].campaign).to.be.undefined
            viewSpy2.restore()
            done()


  it 'Does not persist a session with no user-agent header', (done) ->
    viewSpy = sinon.spy(analytics, 'view')
    GETP('/angularjs').unset('user-agent').end (err, resp) ->
      cookie = resp.headers['set-cookie']
      expect(viewSpy.callCount).to.equal(0)
      expect(cookie).to.be.undefined
      viewSpy.restore()
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, done


  it 'Does not persist a session with uaGooglebot user-agent header', (done) ->
    viewSpy = sinon.spy(analytics, 'view')
    GETP('/angularjs').set('user-agent', uaGooglebot).end (err, resp) ->
      cookie = resp.headers['set-cookie']
      expect(viewSpy.callCount).to.equal(0)
      expect(cookie).to.be.undefined
      viewSpy.restore()
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, done


  it 'Persists utms from a browser (FireFox)', (done) ->
    viewSpy2 = sinon.spy(analytics, 'view')
    GETP('/angularjs?utm_source=team-email&utm_medium=email&utm_term=angular-workshops&utm_content=nov14-workshops-ty&utm_campaign=wks14-4').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      GET '/session/full', {}, (s) =>
        expect(viewSpy2.calledOnce).to.be.true
        expect(s.authenticated).to.equal(false)
        expectSessionToBeStored s, ->
          testDb.viewsByAnonymousId s.sessionID, (e, views) ->
            expect(views.length).to.equal(1)
            expect(views[0].url).to.equal('/angularjs')
            expect(views[0].type).to.equal('tag')
            expect(views[0].campaign).to.exist
            expect(views[0].campaign.source).to.equal('team-email')
            expect(views[0].campaign.medium).to.equal('email')
            expect(views[0].campaign.term).to.equal('angular-workshops')
            expect(views[0].campaign.content).to.equal('nov14-workshops-ty')
            expect(views[0].campaign.name).to.equal('wks14-4')
            viewSpy2.restore()
            done()




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
