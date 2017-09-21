
IT 'ga script renders for anonymous session', ->
  expect(global.COOKIE).to.be.null
  PAGE '/', {session:null}, (html) ->
    expect(global.COOKIE).to.exist
    # {sessionID} = SESSION()
    # OI('sessionID', sessionID)
    expect(html).inc("ga('create', 'UA-XXXXYYYY-N', 'auto')")
    expect(html).inc("ga('send', 'pageview')")
    PAGE '/login', {}, (html2) ->
      # OI('html2', html2)
      expect(html2).inc("ga('create', 'UA-XXXXYYYY-N', 'auto')")
      expect(html2).inc("ga('send', 'pageview')")
      # expect(html2).inc("session: {\"id\": \"#{sessionID}\"")
      DONE()
