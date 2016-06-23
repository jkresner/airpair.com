module.exports = ->

  before (done) ->
#     DB.ensureDoc 'User', FIXTURE.users.tiagorg, ->
#       DB.ensureDoc 'Post', higherOrder, ->
    done()


  beforeEach ->
    UTIL.clearIP()



  DESCRIBE "Search (Tags)", () => require("./api/tags")
