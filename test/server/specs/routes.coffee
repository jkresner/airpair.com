module.exports = ->

  before (done) ->
    {admin,tiagorg,snug} = FIXTURE.users
    DB.ensureDocs 'User', [admin,tiagorg,snug], -> done()

  beforeEach ->
    delete global.cache.abuse['::ffff:127.0.0.1']

  DESCRIBE "Root",                 -> require("./routes/root")
  DESCRIBE "Redirects",            -> require("./routes/redirects")
  DESCRIBE "Rules",                -> require("./routes/rules")

  DESCRIBE "Pages (anon)",         -> require("./routes/pages.anon")
  DESCRIBE.only "Pages (bots)",         -> require("./routes/pages.bots")
  # DESCRIBE "Pages (authed)",       -> require("./routes/pages.authenticated")
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
