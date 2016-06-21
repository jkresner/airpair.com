
IT 'ga script rendered on pages', ->

  ANONSESSION (anon) ->
    PAGE '/login', {}, (html) ->
      expect(html).inc("ga('create', 'UA-40569487-1', 'auto')")
      expect(html).inc("ga('send', 'pageview');")
      DONE()
