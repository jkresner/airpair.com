module.exports = ->


  before (done) ->
    {admin,gnic} = FIXTURE.users
    DB.removeDocs 'View', {}, ->
    DB.ensureDocs 'User', [admin,gnic], done


  beforeEach ->
    UTIL.clearIP()


  DESCRIBE "Google Analytics",   -> require("./analytics/ga")
  DESCRIBE "Impressions",        -> require("./analytics/impressions")
  DESCRIBE "Views",              -> require("./analytics/views")
  DESCRIBE "Aliases",            -> require("./analytics/aliases")
