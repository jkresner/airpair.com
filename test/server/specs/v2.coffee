module.exports = ->

  beforeEach ->
    STUB.wrapper('Slack').cb('getUsers', 'slack_users_list')



  DESCRIBE "Tags",   -> require("./api/tags")
  DESCRIBE.skip "Reviews",   -> require("./api/reviews")
