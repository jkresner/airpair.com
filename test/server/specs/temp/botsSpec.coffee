
{uaFirefox,uaGooglebot,uk_lddc_bot}   = require('./../data/http')

a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/


expectSessionNotStored = (session, cb) ->
  expect(session.sessionID).to.match(a_uid)
  db.readDocs 'Session', {_id:session.sessionID}, (s) ->
    expect(s.length).to.equal(0)
    db.readDocs 'View', { anonymousId:session.sessionID }, (views) ->
      expect(views.length).to.equal(0)
      cb()


expectSessionToBeStored = (session, cb) ->
  expect(session.sessionID).to.match(a_uid)
  db.readDocs 'Session', {_id:session.sessionID}, (s) ->
    expect(s.length).to.equal(1)
    cb()


api = ->

  before (done) ->
    SETUP.analytics.on()
    done()

  it 'Returns empty 200 on bad urls for bad bots', itDone ->
    GETP('/fasdfasdfaeed').set('user-agent', uk_lddc_bot).end (err, resp) ->
      expect(err).to.be.null
      expect(resp.text).to.equal('')
      expect(resp.status).to.equal(200)
      GETP('/fasdfasdfaeed').set('user-agent', uaGooglebot).end (err2, resp2) ->
        expect(err2).to.to.be.null
        expect(resp2.status).to.equal(404)
        DONE()

  it 'Returns empty 200 on good urls for bad bots', itDone ->
    GETP('/').set('user-agent', uk_lddc_bot).end (err, resp) ->
      expect(err).to.be.null
      expect(resp.text).to.equal('')
      expect(resp.status).to.equal(200)
      GETP('/').set('user-agent', uaGooglebot).end (err2, resp2) ->
        expect(err2).to.to.be.null
        expect(resp2.status).to.equal(200)
        DONE()


  it 'Does not exec analytics or store session on 404', itDone ->
    trackSpy = sinon.spy(analytics, 'track')
    GETP('/feed').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      expect(global.cookie).to.be.undefined
      expect(trackSpy.callCount).to.equal(0)
      trackSpy.restore()
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


  it 'Persists a session for a browser (FireFox)', itDone ->
    viewSpy1 = sinon.spy(analytics, 'view')
    GETP('/about').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      GET '/session/full', {}, (s) =>
        expect(viewSpy1.callCount).to.equal(0)
        expect(s.authenticated).to.equal(false)
        expectSessionToBeStored(s, DONE)
        viewSpy1.restore()


  it 'Persists a session and view for /angularjs from a browser (FireFox)', itDone ->
    viewSpy2 = sinon.spy(analytics, 'view')
    GETP('/angularjs').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      GET '/session/full', {}, (s) =>
        expect(viewSpy2.calledOnce).to.be.true
        expect(s.authenticated).to.equal(false)
        expectSessionToBeStored s, ->
          db.readDocs 'View', { anonymousId:s.sessionID }, (views) ->
            expect(views.length).to.equal(1)
            expect(views[0].url).to.equal('/angularjs')
            expect(views[0].type).to.equal('tag')
            expect(views[0].campaign).to.be.undefined
            expect(views[0].userId).to.be.undefined
            expect(views[0].anonymousId).to.equal(s.sessionID)
            viewSpy2.restore()
            DONE()


  it 'Does not persist a session with no user-agent header', itDone ->
    viewSpy = sinon.spy(analytics, 'view')
    GETP('/angularjs').unset('user-agent').end (err, resp) ->
      cookie = resp.headers['set-cookie']
      expect(viewSpy.callCount).to.equal(0)
      expect(cookie).to.be.undefined
      viewSpy.restore()
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


  it 'Does not persist a session with uaGooglebot user-agent header', itDone ->
    viewSpy = sinon.spy(analytics, 'view')
    GETP('/angularjs').set('user-agent', uaGooglebot).end (err, resp) ->
      cookie = resp.headers['set-cookie']
      expect(viewSpy.callCount).to.equal(0)
      expect(cookie).to.be.undefined
      viewSpy.restore()
      expectSessionNotStored { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


  it 'Persists utms from a browser (FireFox)', itDone ->
    viewSpy2 = sinon.spy(analytics, 'view')
    GETP('/angularjs?utm_source=team-email&utm_medium=email&utm_term=angular-workshops&utm_content=nov14-workshops-ty&utm_campaign=wks14-4').set('user-agent', uaFirefox).end (err, resp) ->
      global.cookie = resp.headers['set-cookie']
      expect(viewSpy2.calledOnce).to.be.true
      expect(global.cookie).to.exist
      GET '/session/full', {}, (s) =>
        expect(s.authenticated).to.equal(false)
        expectSessionToBeStored s, ->
          db.readDocs 'View', { anonymousId:s.sessionID }, (views) ->
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

  describe("API: ".subspec, api)
