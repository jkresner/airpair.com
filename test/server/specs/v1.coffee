module.exports = ->

  before (done) ->
    DB.removeDocs 'User', { email:'airpairtest1@gmail.com' }, ->
      DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureExpert 'snug', ->
    DB.ensureExpert 'gnic', ->
    DB.ensureExpert 'dros', ->
    DB.ensureExpert 'phlf', ->
      done()


  beforeEach ->
    STUB.SlackCommon()
    # STUB.wrapper('Slack').cb('getUsers', 'slack_users_list')



  DESCRIBE "Adm",  -> require("./v1/adm")
  DESCRIBE "Bookings",  -> require("./v1/bookings")
  DESCRIBE "Mailman",   require("./v1/mailman")
