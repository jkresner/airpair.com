module.exports = ->

  beforeEach ->
    UTIL.clearIP()

  DESCRIBE "Search (Tags)", -> require("./api/tags")
