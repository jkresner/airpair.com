module.exports = ->

  before (done) ->
    DB.removeDocs 'User', { email:'airpairtest1@gmail.com' }, ->
      DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureExpert 'snug', ->
    DB.ensureExpert 'louf', ->
    DB.ensureExpert 'tmot', ->
    DB.ensureExpert 'gnic', ->
    DB.ensureExpert 'dros', ->
    DB.ensureExpert 'phlf', ->
    LOGIN 'admin', (s) ->
      GET '/adm/requests/active', -> done() # force tmpl cache hack


  beforeEach ->
    STUB.SlackCommon()
    STUB.BraintreeCharge()


  DESCRIBE "Adm",  -> require("./v1/adm")
  DESCRIBE "Paymethods",  -> require("./v1/paymethods")
  DESCRIBE "Orders",  -> require("./v1/orders")
  DESCRIBE "Bookings",  -> require("./v1/bookings")
  DESCRIBE "Jobs", -> require("./v1/jobs")
  DESCRIBE "Mojo", -> require("./v1/mojo")
  DESCRIBE "Mailman",   require("./v1/mailman")
  DESCRIBE "Pairbot", -> require("./v1/pairbot")
