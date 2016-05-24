
IT 'ga script rendered on pages', ->

  ANONSESSION (anon) ->
    PAGE '/login', {}, (html) ->
      expect(html).contains("ga('create', 'UA-40569487-1', 'auto')")
      expect(html).contains("ga('send', 'pageview');")
      DONE()
