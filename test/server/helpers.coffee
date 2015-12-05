# mmmmmmm
global.STRINGIFY = (obj) ->
  if !JSONSTRING[obj._id]
    JSONSTRING[obj._id] = JSON.stringify(obj).gray
  JSONSTRING[obj._id]


SPEC.init = (ctx) ->

  before ->
    global.JSONSTRING = {}

  after ->
    delete global.JSONSTRING

  # $timelapsed("BEFORE start")
  # global.verboseErrHandler  = true   # true => lots of red detail
  # global.withoutStubs       = false    # true => real (slow) apis calls
  # $log("   Stubs:".white, if withoutStubs then "TURNED OFF!".red else "on".gray)

  # global.data               = require('./../data/data')
  # global.SETUP              = require('./setup/_setup')
  # global.timeSeed           = SETUP.timeSeed
  # global.newId              = SETUP.newId

  # global.stubs              = SETUP.initStubs()


STUB.SlackCommon = ->
  STUB.sync(Wrappers.Slack, 'checkUserSync', null)
  @Slack = STUB.wrapper('Slack')
  @Slack.cb('getUsers', 'slack_users_list')
  cache.slack_users = FIXTURE.wrappers.slack_users_list
  @Slack.cb('getChannels', 'slack_channels_list')
  @Slack.cb('getGroups', 'slack_groups_list')


STUB.BraintreeCharge = (key) ->
  STUB.wrapper('Braintree').api('transaction.sale').fromCtx (payload) ->
    r = FIXTURE.clone('wrappers.'+(key||'braintree_charge_success'))
    r.transaction.amount = payload.amount.toString()
    r.transaction.orderId = payload.orderId.toString()
    [null, r]


STUB.PayPalPayout = (key) ->
  STUB.wrapper('PayPal').api('payout.create').fromCtx (payload,syncmode) ->
    r = FIXTURE.clone("wrappers."+(key||'paypal_single_payout_success'))
    r.items[0].payout_item.receiver = payload.items[0].receiver
    r.items[0].payout_item.amount = payload.items[0].amount.toString()
    [null, r]



EXPECT.ObjectId = (val) ->
  expect(val, "Expected ObjectId null").to.exist
  expect(val.constructor is ObjectId, "Expected ObjectId #{val.toString().white}".gray+" #{val.constructor} not an ObjectId".gray).to.be.true

EXPECT.expectTouch = (touch, byId, action) ->
  expect(touch._id).to.exist
  # expect(touch._id.constructor is ObjectId).to.be.true
  # expectObjectId(touch._id)
  EXPECT.equalIds(touch.by._id, byId)
  expect(touch.action).to.equal(action)

EXPECT.attr = (obj, attr, constructor) ->
  expect(obj[attr], attr.white+" missing on: "+STRINGIFY(obj)).to.exist
  if (constructor)
    expect(obj[attr].constructor, "#{attr}.constuctor #{obj[attr].constructor.name.cyan} but expecting #{constructor.name.cyan} on: "+STRINGIFY(obj)).to.equal(constructor)

EXPECT.attrUndefined = (obj, attr) ->
  expect(obj[attr], attr.white+" shoud not be found on "+STRINGIFY(obj)).to.be.undefined

