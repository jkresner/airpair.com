module.exports = ->


  before (done) ->
    {tst1,jrenaux,tiag} = FIXTURE.users

    DB.removeDocs 'User', { username: tst1.username }, ->
    DB.ensureDocs 'User', [tst1,jrenaux,tiag], ->
      DB.ensureDoc 'Post', FIXTURE.posts.higherOrder, done


  beforeEach ->
    UTIL.clearIP()


  DESCRIBE "Root",                 -> require("./routes/root")
  # DESCRIBE "Rules",                -> require("./routes/rules")
  # DESCRIBE "Redirects",            -> require("./routes/redirects")
  # DESCRIBE "Posts",                -> require("./routes/redirects.posts")


  # DESCRIBE "Pages (anon)",         -> require("./routes/pages.anon")
  # DESCRIBE "Pages (bots)",         -> require("./routes/pages.bots")
  # DESCRIBE "Pages (authd)",        -> require("./routes/pages.authd")
