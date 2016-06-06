module.exports = ->

  before (done) ->
    {admin,tiagorg,snug} = FIXTURE.users
    DB.ensureDocs 'User', [admin,tiagorg,snug], -> done()

  beforeEach ->
    UTIL.clearIP()

  DESCRIBE "Root",                 -> require("./routes/root")
  DESCRIBE "Rules",                -> require("./routes/rules")
  DESCRIBE "Redirects",            -> require("./routes/redirects")
  DESCRIBE "Posts",                -> require("./routes/redirects.posts")

  DESCRIBE "Pages (anon)",         -> require("./routes/pages.anon")
  DESCRIBE "Pages (bots)",         -> require("./routes/pages.bots")
  DESCRIBE "Pages (authd)",        -> require("./routes/pages.authd")
  # DESCRIBE "Pages (adm)",          ->

    # IT 'Redirect non-admin'
      # LOGIN {key:'admin'}, (s) ->
      #   GET '/adm/redirects', {}, (r1) ->
      #     beforeCount = r1.length
      #     suffix = moment().format('X')
      #     d = previous: "/previous-#{suffix}", current: "/current-#{suffix}"
      #     POST '/adm/redirects', d, {}, (redirect) ->
      #       expect(redirect._id).to.exist
      #       expect(redirect.previous).to.equal(d.previous)
      #       GET '/adm/redirects', {}, (r2) ->
      #         expect(beforeCount+1).to.equal(r2.length)
      #         expect(_.find(r2,(r)->r.previous==d.previous)).to. exist
      #         DONE()
