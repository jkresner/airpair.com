publishedPostUrl = FIXTURE.posts.higherOrder.htmlHead.canonical.replace('https://www.airpair.com', '')
{UA}      = FIXTURE.http
BADBot    = session:null, ua: UA.ban.uk_lddc
GOODBot   = session:null, ua: UA.search.Google
AhrefsBot = session:null, ua: UA.ban.AhrefsBot
UANone    =  session:null, ua: 'null'



before (done) ->
  DB.removeDocs 'Session', {}, ->
    DB.removeDocs 'View', {}, ->
      done()

after (done) ->
  DB.docsByQuery 'Session', {}, (ss) ->
    expect(ss.length).to.equal(0)
    DB.docsByQuery 'View', {}, (vv) ->
      expect(vv.length).to.equal(0)
      done()



DESCRIBE "No UA", ->


  IT '[200] empty for bad url', ->
    PAGE '/fasdfasdfaeed', RES(200,/html/,UANone), (resp1) ->
      expect(resp1).to.equal('')
      DONE()


  IT '/100k-writing-competition', ->
    viewSpy = STUB.spy(analytics, 'view')
    PAGE '/100k-writing-competition', RES(200,UANone), (resp) ->
      expect(viewSpy.callCount).to.equal(0)
      DONE()




DESCRIBE "BAD bots", ->

  IT '[200] empty for bad url', ->
    PAGE '/fasdfasdfaeed', RES(200,/html/,BADBot), (resp1) ->
      expect(resp1).to.equal('')
      DONE()

  IT '[200] empty for good url', ->
    PAGE '/', RES(200,/text/,BADBot), (resp) ->
      expect(resp).to.equal('')
      DONE()

  IT '[200] empty for AhrefsBot malformed url', ->
    badurl = '/angularjs/posts/preparing-for-the-future-of-angularjs+'
    PAGE badurl, RES(200,/text/,AhrefsBot), (resp) ->
      expect(resp).to.equal('')
      DONE()



DESCRIBE "GOOD bots (search)", ->

  IT '[404] Bad url for good (search) bots', ->
    PAGE '/fasdfasdfaeed', RES(404,/text/,GOODBot), (resp2) ->
      expect(resp2).inc /not found/i
      DONE()


  IT '[200] on good urls for bad bots', ->
    PAGE '/', RES(200,/html/,GOODBot), (resp2) ->
      expect(resp2).inc "<title>airpair | Software jobs"
      DONE()



# DESCRIBE "Session + analytics not persist", ->

#   SKIP '/100k-writing-competition Yandex Indexing 200, MirrorDector 404', ->
#     indexBot = unauthenticated:true, ua: UA.Yandex.indexing
#     mirrorBot = unauthenticated:true, ua: UA.Yandex.mirrorDector
#     fakeBot = unauthenticated:true, ua: UA.Yandex.fake

#     PAGE '/100k-writing-competition', Opts({status:200}, indexBot), (resp) ->
#       expect(resp).inc "100k Writing Competition"

#     PAGE '/100k-writing-competition', RES(404, fakeBot), (resp) ->
#       DONE()


  #   it 'Views are saved for firefox', (done) ->
  #     checkViewIsSaved 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0', done

  #   it 'Views are saved for chrome', (done) ->
  #     checkViewIsSaved 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25', done

  #   it 'Views are saved for safari', (done) ->
  #     checkViewIsSaved 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36', done
