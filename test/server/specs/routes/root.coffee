thumbUrl = "/posts/thumb/#{FIXTURE.posts.higherOrder._id}"

describe " HUMANS".spec, ->

  IT '/post/thumb/:id', -> PAGE thumbUrl, {status:301,contentType:/text/}, (txt) -> DONE()
  IT '/img/software/android.png', -> IMG @
  IT '/ad/heroku/900x90.q2-1.node.js.png', -> IMG @
  IT '/visit/heroku-160411-ruby', -> PAGE @test.title, {status:302,contentType:/text/}, (txt) ->
    expect(txt).to.inc "Found. Redirecting to https://signup.heroku.com/ruby"
    DONE()


  IT 'sitemap.xml', ->
    optsExpect = contentType: /text/, status:200
    PAGE '/index_sitemap.xml', optsExpect, (r1) ->
      expect(r1).to.equal('')
      PAGE '/image_sitemap.xml', optsExpect, (r2) ->
        expect(r2).to.equal('')
        PAGE '/sitemap.xml', optsExpect, (r3) ->
          expect(r3).to.equal('')
          DONE()

  IT '/humans.txt', -> PAGE '/humans.txt', { contentType: /text/ }, (txt) ->
    expect(txt).to.match(/Chef:Jonathon Kresner/)
    DONE()

  IT '/robots.txt', -> PAGE '/robots.txt', { contentType: /text/ }, (txt) ->
    expect(txt).to.inc(['User-agent: *','Disallow: /'])
    DONE()

  IT '/rss', ->
    PAGE '/rss', { contentType: /rss/, status: 200 }, (xml) ->
      expect(xml).to.match(/<rss xmlns:dc="http/)
      expect(xml).to.match(/<item><title><\!\[CDATA\[Mastering ES6 higher-order functions for Arrays\]\]><\/title><description><\!\[CDATA\[Higher-order functions are/)
      expect(xml).to.match(/Elevate your functional programming skills by learning ES6 higher-order functions for Arrays\!\]\]><\/description><link>https:\/\/www.airpair.com\/javascript\/posts\/mastering-es6-higher-order-functions-for-arrays/)
      PAGE '/data/rss', { contentType: /rss/, status: 200 }, (xml2) ->
        expect(xml2).to.inc ['<rss xmlns:dc="http','Elevate your functional programming skills by learning ES6 higher-order functions for Arrays']
        DONE()



describe " SEARCH".spec, ->

  beforeEach -> @optsExpect = ua: FIXTURE.http.UA.search.Google

  IT '/post/thumb/:id', -> PAGE thumbUrl, assign({status:301},@optsExpect), (txt) -> DONE()
  IT '/img/software/android.png', -> IMG @, assign({status:200,contentType:/image/},@optsExpect)
  IT '/ad/heroku/900x90.q2-1.node.js.png', -> IMG @, assign({status:200,contentType:/text/},@optsExpect), (txt) ->
    expect(text).to.equal('')
    DONE()
  IT '/visit/heroku-160411-ruby', -> PAGE @test.title, assign({status:200,contentType:/text/},@optsExpect), (txt) -> DONE()

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
    optsExpect =
    PAGE '/robots.txt', assign({contentType: /text/, status:200 }, @optsExpect), (txt) ->
      expect(txt).to.inc(['Sitemap: https://www.airpair.com/index_sitemap.xml',
                          'User-agent: *'
                          'Disallow: /static/'])
      DONE()

  IT '/rss', ->
    PAGE '/rss', assign({contentType: /rss/, status:200}, @optsExpect), (xml) ->
      expect(xml).to.inc(['<rss xmlns:dc="http',
                          /<item><title><\!\[CDATA\[Mastering ES6 higher-order functions for Arrays\]\]><\/title><description><\!\[CDATA\[Higher-order functions/,
                          /Elevate your functional programming skills by learning ES6 higher-order functions for Arrays\!\]\]><\/description><link>https:\/\/www.airpair.com\/javascript\/posts\/mastering-es6-higher-order-functions-for-arrays/])
      DONE()



describe " BANNED".spec, ->

  beforeEach -> @optsExpect = contentType: /text/, status:200, ua: FIXTURE.http.UA.lib.jsoup

  IT '/hangout/index.html', ->
    PAGE @test.title, @optsExpect, (html) ->
      expect(html).inc('<body>')
      PAGE '/hangout/hangoutApp.xml', assign({},@optsExpect,contentType:/xml/), (xml) ->
        expect(xml).inc('<Module>')
        DONE()
  IT '/post/thumb/:id', -> PAGE thumbUrl, @optsExpect, (txt) -> DONE()
  IT '/img/software/android.png', -> IMG @, @optsExpect
  IT '/ads/heroku/900x90.q2-1.node.js.png', -> IMG @
  IT '/ad/heroku/900x90.q2-1.node.js.png', -> IMG @, @optsExpect
  IT '/visit/heroku-160411-ruby', -> PAGE @test.title, @optsExpect, (txt) -> DONE()

  IT 'sitemap.xml', ->
    PAGE '/index_sitemap.xml', @optsExpect, (r1) =>
      expect(r1).to.equal('')
      PAGE '/image_sitemap.xml', @optsExpect, (r2) =>
        expect(r2).to.equal('')
        PAGE '/sitemap.xml', @optsExpect, (r3) =>
          expect(r3).to.equal('')
          DONE()

  IT '/humans.txt', -> PAGE '/humans.txt', @optsExpect, (txt) =>
    expect(txt).to.match(/Chef:Jonathon Kresner/)
    DONE()

  IT '/robots.txt', -> PAGE '/robots.txt', @optsExpect, (txt) =>
    expect(txt).to.inc(['User-agent: *','Disallow: /'])
    DONE()

  IT '/rss', -> PAGE '/rss', @optsExpect, (txt) =>
    expect(txt).to.equal('')
    DONE()
