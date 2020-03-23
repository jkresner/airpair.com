throttle = null

module.exports = ->


  before (done) ->
    throttle = config.middleware.throttle
    {tst1,jrenaux,tiag} = FIXTURE.users
    DB.removeDocs 'User', { username: tst1.username }, =>
    DB.ensureDocs 'User', [tst1,jrenaux,tiag], =>
      DB.ensureDoc 'Post', FIXTURE.posts.higherOrder, =>
        LOGIN 'gnic', (s) ->
          global.AUTHED = key: s.username, session: global.COOKIE
          done()


  beforeEach ->
    UTIL.clearIP()


  after ->
    delete global.AUTHED


  afterEach ->
    config.middleware.throttle = throttle



  # DESCRIBE "Canonical",         -> require("./routes/canonical")
  # DESCRIBE "Foul",             -> require("./routes/foul")
  # DESCRIBE "[401] Gone",       -> require("./routes/gone")
  DESCRIBE "Redirects",        -> require("./routes/redirects")
  # DESCRIBE "Robots",           -> require("./routes/robots")

  # DESCRIBE "Pages (anon)",         -> require("./routes/pages.anon")
  # DESCRIBE "Pages (bots)",         -> require("./routes/pages.bots")
  # DESCRIBE "Pages (authd)",        -> require("./routes/pages.authd")
