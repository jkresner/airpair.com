module.exports = ->


  before (done) ->
    {admin,tiagorg,snug} = FIXTURE.users
    DB.ensureDocs 'User', [admin,tiagorg,snug], -> done()

  DESCRIBE "Root",            -> require("./routes/root")
  DESCRIBE "Redirects",       -> require("./routes/redirects")
  DESCRIBE "Pages (anon)",    -> require("./routes/pages.anon")
  # DESCRIBE "Pages (authenticated)",  -> require("./routes/pages.authenticated")
  # DESCRIBE "Pages (BOTS)",  -> require("./routes/pages.bots")
  # DESCRIBE "User",        -> require("./routes/pages")
