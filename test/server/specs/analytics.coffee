module.exports = ->

  before (done) ->
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureExpert 'byrn', ->
    DB.ensureDoc 'Request', FIXTURE.requests.aJob, -> DB.ensureDoc 'User', FIXTURE.users.ricd, ->
    DB.ensureDoc 'Post', FIXTURE.posts.higherOrder, ->
    done()

  DESCRIBE "Google Analytics",   -> require("./analytics/ga")
  DESCRIBE "Impressions",   -> require("./analytics/impressions")
  DESCRIBE "Views",   -> require("./analytics/views")
