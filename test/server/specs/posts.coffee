

browsing = ->

  IT '200 on rss', ->
    opts = status: 200, unauthenticated: true, contentType: /rss/
    $log('calling PAGE', opts)
    PAGE "/rss", opts, -> DONE()


  IT '200 on unauthenticated Posts index', ->
    opts = status: 200, unauthenticated: true
    PAGE "/software-experts", opts, -> DONE()


  IT '200 on unauthenticated Posts by tag', ->
    opts = status: 200, unauthenticated: true
    GET("/posts/tagged/javascript", opts, -> DONE() )


  IT "Request post by non-existing slug", ->
    fakeUrl = "/angularjs/posts/the-definitive-ionic-starter-gu"
    PAGE fakeUrl, {status:404}, (r) ->
      EXPECT.contains(r,'not found')
      DONE()


  IT "Redirect on review link for published post", ->
    author = FIXTURE.users.submPostAuthor
    post = FIXTURE.posts.pubedArchitec
    DB.ensureDoc 'Post', post, ->
      PAGE "/posts/review/#{post._id}", { status: 301 }, (e) ->
        EXPECT.startsWith(e, 'Moved Permanently. Redirecting to https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx')
        DONE()


  IT "Anon view a published post", ->
    post = FIXTURE.posts.higherOrder
    url = post.htmlHead.canonical.replace('https://www.airpair.com', '')
    DB.ensureDoc 'Post', post, ->
      PAGE url, {}, (html) ->
        EXPECT.contains(html, '<h1 class="entry-title" itemprop="headline">Mastering ES6 higher-order functions for Arrays</h1>')
        EXPECT.contains(html, '<li><a href="/posts/tag/javascript" target="_self">javascript</a></li>')
        DONE()


  IT "Authd view a published post", ->
    post = FIXTURE.posts.higherOrder
    url = post.htmlHead.canonical.replace('https://www.airpair.com', '')
    DB.ensureDoc 'Post', post, ->
      LOGIN {key:'snug'}, ->
        PAGE url, {}, (html) ->
          EXPECT.contains(html, '<h1 class="entry-title" itemprop="headline">Mastering ES6 higher-order functions for Arrays</h1>')
          EXPECT.contains(html, '<li><a href="/posts/tag/javascript" target="_self">javascript</a></li>')
          DONE()


  IT "2015 100k writing competition", ->
    PAGE '/100k-writing-competition', {status:200}, (html) ->
      EXPECT.contains(html, '<h1>2015 Developer Writing Competition</h1>')
      DONE()



module.exports = ->

  before (done) ->
    global.higherOrder = FIXTURE.posts.higherOrder
    DB.ensureDoc 'User', FIXTURE.users.tiagorg, ->
      DB.ensureDoc 'Post', higherOrder, ->
        done()

  after ->
    delete global.higherOrder

  beforeEach ->
    STUB.wrapper('Slack').cb('getUsers', 'slack_users_list')

  DESCRIBE("Browsing", browsing)
