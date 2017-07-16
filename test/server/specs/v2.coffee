module.exports = ->

  before (done) ->
#     DB.ensureDoc 'User', FIXTURE.users.tiagorg, ->
#       DB.ensureDoc 'Post', higherOrder, ->
    done()


  beforeEach ->
    UTIL.clearIP()



  DESCRIBE "Search (Tags)", () => require("./api/tags")


  # DESCRIBE "Jobs", -> require("./v1/jobs")
  # DESCRIBE "Mojo", -> require("./v1/mojo")
  # DESCRIBE "Mailman",   require("./v1/mailman")
  # DESCRIBE "Pairbot", -> require("./v1/pairbot")
