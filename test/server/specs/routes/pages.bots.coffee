publishedPostUrl = FIXTURE.posts.higherOrder.htmlHead.canonical.replace('https://www.airpair.com', '')
BADBot =  unauthenticated:true, ua: FIXTURE.http.UA.ban.uk_lddc
GOODBot = unauthenticated:true, ua: FIXTURE.http.UA.search.Google
UANone =  unauthenticated:true, ua: 'null'
Opts = Object.assign


before (done) ->
  DB.removeDocs 'Session', {}, ->
    done()

afterEach (done) ->
  DB.docsByQuery 'Session', {}, (ss) ->
    expect(ss.length).to.equal(0)
    done()


IT 'Returns empty 200 on bad urls for bad bots', ->
  PAGE '/fasdfasdfaeed', Opts({status:200},BADBot), (resp1) ->
    expect(resp1).to.equal('')
    PAGE '/fasdfasdfaeed', Opts({status:404},GOODBot), (resp2) ->
      expect(resp2).inc /not found/i
      DONE()


IT 'Returns empty 200 on good urls for bad bots', ->
  PAGE '/', Opts({status:200},BADBot), (resp) ->
    expect(resp).to.equal('')
    PAGE '/', Opts({status:200},GOODBot), (resp2) ->
      expect(resp2).inc "<title>airpair | Coding help, Software consultants & Programming resources"
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
