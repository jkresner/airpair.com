thumbUrl = "/posts/thumb/#{FIXTURE.posts.higherOrder._id}"

## scream using default UA = 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0'
describe " HUMAN".spec, ->

  IT '/post/thumb/:id', -> PAGE thumbUrl, {status:301,contentType:/text/}, (txt) -> DONE()

  IT '/favicon.ico', -> IMG @

  # IT '/ad/heroku/900x90.q2-1.node.js.png', -> IMG @
  # IT '/visit/heroku-160411-ruby', ->
  #   PAGE @test.title, {status:302,contentType:/text/}, (txt) ->
  #     expect(txt).to.inc "Found. Redirecting to https://signup.heroku.com/ruby"
  #     DONE()

  # Obfuscate sitemap from people, i.e. only search engines can read it
  IT 'sitemap.xml', ->
    optsExpect = contentType: /text/, status: 200
    PAGE '/index_sitemap.xml', optsExpect, (r1) ->
      expect(r1).to.equal('')
      PAGE '/image_sitemap.xml', optsExpect, (r2) ->
        expect(r2).to.equal('')
        PAGE '/sitemap.xml', optsExpect, (r3) ->
          expect(r3).to.equal('')
          DONE()


  IT '/humans.txt', -> PAGE '/humans.txt', { contentType: /text/ }, (txt) ->
    expect(txt).to.inc("Chef:Jonathon Kresner")
    DONE()


  IT '/robots.txt', -> PAGE '/robots.txt', { contentType: /text/ }, (txt) ->
    expect(txt).to.inc(['User-agent: *','Disallow: /airconf'])
    DONE()


  IT '/rss', ->
    PAGE '/rss', { contentType: /rss/, status: 200 }, (xml) ->
      expect(xml).to.inc('<rss xmlns:dc="http')
      expect(xml).to.inc("<item><title><![CDATA[Mastering ES6 higher-order functions for Arrays]]></title><description><![CDATA[Higher-order functions are")
      expect(xml).to.inc("Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!]]></description><link>https://www.airpair.com/javascript/posts/mastering-es6-higher-order-functions-for-arrays")
      PAGE '/data/rss', { contentType: /rss/, status: 200 }, (xml2) ->
        expect(xml2).to.inc ['<rss xmlns:dc="http','Elevate your functional programming skills by learning ES6 higher-order functions for Arrays']
        DONE()


  IT '/hangout/index.html', ->
    PAGE @test.title, { status: 404 }, (html) ->
      expect(html).inc('<body>')
      expect(html).inc('Error')
      PAGE '/hangout/hangoutApp.xml', { status: 500 }, (text) ->
        expect(text).to.equal('')
        DONE()


describe " SEARCH".spec, ->

  beforeEach ->
    @optsExpect = ua: FIXTURE.http.UA.search.Google

  IT '/post/thumb/:id', -> PAGE thumbUrl, assign({status:301},@optsExpect), (txt) -> DONE()

  IT '/img/software/android.png', ->
    PAGE @test.title, assign({status:301,contentType:/text/},@optsExpect), (txt) -> DONE()

  IT 'sitemap.xml', ->
    optsExpect = contentType: /xml/, status:200, ua: FIXTURE.http.UA.search.Google
    PAGE '/index_sitemap.xml', optsExpect, (xml1) ->
      expect(xml1).to.inc(['<sitemapindex xmlns:xsi="http://www.',
                           '<loc>https://www.airpair.com/sitemap.xml</loc>'])
      PAGE '/image_sitemap.xml', optsExpect, (xml2) ->
        expect(xml2).to.inc(['xmlns:image="http://www.google.com/schemas/sitemap-image/1.1',
                             '<image:loc>https://www.airpair.com/img/software/node.js.png</image:loc>'])
        PAGE '/sitemap.xml', optsExpect, (xml3) ->
          expect(xml3).to.inc(['xmlns="http://www.sitemaps.org/schemas/sitemap/0.9',
                               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9',
                               '<loc>https://www.airpair.com</loc>'])
          DONE()

  IT '/robots.txt', ->
    PAGE '/robots.txt', assign({contentType: /text/, status:200 }, @optsExpect), (txt) ->
      expect(txt).to.inc(['Sitemap: https://www.airpair.com/index_sitemap.xml',
                          'User-agent: *'
                          'Disallow: /static/'])
      DONE()

  IT '/rss', ->
    PAGE '/rss', assign({contentType: /rss/, status:200}, @optsExpect), (xml) ->
      expect(xml).to.inc(['<rss xmlns:dc="http',
                          "<item><title><![CDATA[Mastering ES6 higher-order functions for Arrays]]></title><description><![CDATA[Higher-order functions",
                          "Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!]]></description><link>https://www.airpair.com/javascript/posts/mastering-es6-higher-order-functions-for-arrays"])
      DONE()



describe " BANNED".spec, ->

  beforeEach ->
    @optsExpect = contentType: /text/, status:200, ua: FIXTURE.http.UA.lib.jsoup


  IT '/post/thumb/:id', -> PAGE thumbUrl, @optsExpect, (txt) -> DONE()

  IT '/img/software/android.png', -> PAGE @test.title, assign({},@optsExpect,{status:301}), (txt) -> DONE()

  IT '/ads/heroku/900x90.q2-1.node.js.png', -> BAN @

  IT '/ad/heroku/900x90.q2-1.node.js.png', -> BAN @

  IT '/visit/heroku-160411-ruby', -> BAN @

  IT 'sitemap.xml', ->
    PAGE '/index_sitemap.xml', @optsExpect, (r1) =>
      expect(r1).to.equal('')
      PAGE '/image_sitemap.xml', @optsExpect, (r2) =>
        expect(r2).to.equal('')
        PAGE '/sitemap.xml', @optsExpect, (r3) =>
          expect(r3).to.equal('')
          DONE()

  IT '/humans.txt', -> PAGE '/humans.txt', @optsExpect, (txt) =>
    expect(txt).to.inc("Chef:Jonathon Kresner")
    DONE()

  IT '/robots.txt', -> PAGE '/robots.txt', @optsExpect, (txt) =>
    expect(txt).to.inc(['User-agent: *','Disallow: /'])
    DONE()

  IT '/rss', -> PAGE '/rss', @optsExpect, (txt) =>
    expect(txt).to.equal('')
    DONE()
