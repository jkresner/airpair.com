module.exports = ->

  before (done) ->
    {admin,ricd} = FIXTURE.users
    DB.ensureDocs 'User', [admin,ricd], ->
    DB.ensureExpert 'byrn', ->
    DB.ensureDoc 'Request', FIXTURE.requests.aJob, ->
    done()

  beforeEach ->
    UTIL.clearIP()


  DESCRIBE "Google Analytics",   -> require("./analytics/ga")
  DESCRIBE "Impressions",        -> require("./analytics/impressions")
  DESCRIBE "Views",              -> require("./analytics/views")
  DESCRIBE "Aliases",            -> require("./analytics/aliases")
