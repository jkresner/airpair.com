module.exports = ->

  beforeEach ->
    UTIL.clearIP()


  DESCRIBE "Search (Tags)", () => require("./api/tags")
  DESCRIBE.skip "Reviews",  () => require("./api/reviews")
