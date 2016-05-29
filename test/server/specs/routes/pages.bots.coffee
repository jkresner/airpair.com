publishedPostUrl = FIXTURE.posts.higherOrder.htmlHead.canonical.replace('https://www.airpair.com', '')
BADBot =  unauthenticated:true, ua: FIXTURE.http.UA.ban.uk_lddc
GOODBot = unauthenticated:true, ua: FIXTURE.http.UA.search.Google
UANone =  unauthenticated:true, ua: 'null'
UAUser =  ua: FIXTURE.http.UA.Firefox
Opts = Object.assign


IT 'Returns empty 200 on bad urls for bad bots', ->
  PAGE '/fasdfasdfaeed', Opts({status:200},BADBot), (resp) ->
    expect(resp).to.equal('')
    PAGE '/fasdfasdfaeed', Opts({status:404},GOODBot), (resp2) ->
      expect(resp2).inc /not found/i
      DONE()


IT 'Returns empty 200 on good urls for bad bots', ->
  PAGE '/', Opts({status:200},BADBot), (resp) ->
    expect(resp).to.equal('')
    PAGE '/', Opts({status:200},GOODBot), (resp2) ->
      expect(resp2).inc "<title>airpair | Coding help, Software consultants & Programming resources"
      DONE()


IT 'Does not exec analytics or store session on 404', ->
  # trackSpy = STUB.spy(analytics, 'event')
  PAGE '/register', Opts({status:404}, UAUser), (resp) ->
    # global.cookie = resp.headers['set-cookie']
    # expect(global.cookie).to.be.undefined
    # expect(trackSpy.callCount).to.equal(0)
    DB.noSession { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


IT '/ (unauthenticated) Persists session for uaFireFox', ->
  # viewSpy1 = STUB.spy(analytics, 'view')
  PAGE '/', Opts({status:200}, UAUser), (resp) ->
    GET '/auth/session', (s) ->
      # expect(viewSpy1.callCount).to.equal(1)
      expect(s.authenticated).to.equal(false)
      DB.expectSession s, DONE


IT '/100k-writing-competition (unauthenticated) Persists session for uaFireFox', ->
  # viewSpy = STUB.spy(analytics, 'view')
  PAGE '/100k-writing-competition', Opts({status:200}, UAUser), (resp) ->
    GET '/auth/session', (s) ->
      # expect(viewSpy.calledOnce).to.be.true
      expect(s.authenticated).to.equal(false)
      DB.expectSession s, ->
        DB.docsByQuery 'View', { sId:s.sessionID }, (views) ->
          expect(views.length).to.equal(1)
          expect(views[0].sId).to.equal(s.sessionID)
          expect(views[0].type).to.equal('landing')
          expect(views[0].url).to.equal('/100k-writing-competition')
          expect(views[0].utm).to.be.undefined
          expect(views[0].uId).to.be.undefined
          DONE()


IT '/100k-writing-competition (no user-agent) Does not persist session', ->
  # viewSpy = STUB.spy(analytics, 'view')
  PAGE '/100k-writing-competition', Opts({status:200}, UANone), (resp) ->
    # expect(viewSpy.callCount).to.equal(0)
    DB.noSession { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


IT '/100k-writing-competition (uaGooglebot) does not persist session or view', ->
  # viewSpy = STUB.spy(analytics, 'view')
  PAGE '/100k-writing-competition', Opts({status:200}, GOODBot), (resp) ->
    expect(resp).inc "100k Writing Competition"
    # expect(viewSpy.callCount).to.equal(0)
    DB.noSession { sessionID: 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' }, DONE


IT '/100k-writing-competition (uaUser) Persists utms and referer', ->
  # viewSpy = STUB.spy(analytics, 'view')
  referer = 'https://www.airpair.com/'
  utms = 'utm_source=team-email&utm_medium=email&utm_term=angular-workshops&utm_content=nov14-workshops-ty&utm_campaign=wks14-4'
  PAGE "/100k-writing-competition?#{utms}", Opts({status:200,referer}, UAUser), (resp) ->
    # expect(viewSpy.calledOnce).to.be.true
    GET '/auth/session', (s) ->
      expect(s.authenticated).to.equal(false)
      DB.expectSession  s, ->
        DB.docsByQuery 'View', { sId:s.sessionID }, (views) ->
          expect(views.length).to.equal(1)
          expect(views[0].url).to.equal('/100k-writing-competition')
          expect(views[0].type).to.equal('landing')
          expect(views[0].utm).to.exist
          expect(views[0].ref).to.equal(referer)
          expect(views[0].utm.source).to.equal('team-email')
          expect(views[0].utm.medium).to.equal('email')
          expect(views[0].utm.term).to.equal('angular-workshops')
          expect(views[0].utm.content).to.equal('nov14-workshops-ty')
          expect(views[0].utm.campaign).to.equal('wks14-4')
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
