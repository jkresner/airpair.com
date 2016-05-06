{log} = config
if log && process.env['LOG_APP_VERBOSE'] then log.app.verbose = process.env['LOG_APP_VERBOSE']
if log && process.env['LOG_APP_MUTE'] then log.app.mute = process.env['LOG_APP_MUTE']
# if (process.env[`LOG_${cfg.logFlag}`]) = cfg.logFlag ? 'white' : undefined


# mmmmmmm
global.STRINGIFY = (obj) ->
  if !JSONSTRING[obj._id]
    JSONSTRING[obj._id] = JSON.stringify(obj).gray
  JSONSTRING[obj._id]


DATA.newSession = (userKey) ->
  suffix = DATA.timeSeed()
  session = cookie:
    originalMaxAge: 2419200000,
    _expires: moment().add(2419200000, 'ms').subtract(1,'s')

  # ?? not the best setting global here ....
  cookieCreatedAt = util.momentSessionCreated(session)
  assign({user:null,sessionID:"test#{userKey}#{suffix}"},{session})


DATA.defaultGH = (name, login, suffix) ->
  profile = FIXTURE.users[FIXTURE.uniquify('users','ape1','auth.gh.email')].auth.gh
  profile.id = (profile.id||1)+moment().unix() + Math.random(2,20)
  profile.login = "#{login}#{suffix}"
  profile.name = profile.name || name || login
  profile.emails = [{email:profile.email,verified:true,primary:true}]
  profile

DATA.ghProfile = (login, uniquify) ->
  suffix = DATA.timeSeed()
  if uniquify is true
    u = FIXTURE.users[FIXTURE.uniquify("users", login, 'username name email auth.gh.email auth.gh.login auth.gh.id auth.gp.id auth.gp.email')] if !u
    # $log('u'.magenta, u.email)
    $log("FIXTURE.users.#{login} MISSING") if !u
    profile = u.auth.gh if u.auth && u.auth.gh
    profile = DATA.defaultGH(u.name || login, login, suffix) if !profile
    profile.emails = [{email:profile.email||u.email,verified:true,primary:true}]
  else
    profile = FIXTURE.users[login].auth.gh
    profile = DATA.defaultGH(login, login, suffix) if !profile
  # $log('profile', profile)
  # expect(profile.emails, "FIXTURE.ghProfile #{login} missing emails").to.exist
  profile


global.ANONSESSION = (cb) ->
  global.COOKIE = null
  GET '/session/full', cb


global.SIGNUP = (login, cb) ->
  profile = DATA.ghProfile login, true
  FIXTURE.users[profile.login] = {auth:{gh:profile}}
  LOGIN profile, cb








# DATA.newSignup = (name) ->
#   ident = name.toLowerCase().replace(/ /g,'.')
#   seed = { name, email: "#{ident}@testpair.com" }
#   suffix = DATA.timeSeed()
#   Object.assign({userKey: ident.substring(0, 4)+suffix}, {
#     email: seed.email.replace('@',suffix+'@')
#     name: seed.name+suffix
#     password: 'testpass'+suffix })

  # key = FIXTURE.uniquify('users',key,'email name')
  # Object.assign(FIXTURE.users[key], {password:'testpass'+DATA.timeSeed()})
  # return _.extend({key}, FIXTURE.users[key])


DB.ensureExpert = (key, done) ->
  DB.ensureDocs 'User', [FIXTURE.users[key]], (e) =>
    # $log("ensureExpert.user.#{key}", e)
    DB.ensureDocs 'Expert', [FIXTURE.experts[key]], (ee) => done()


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

analyticsCfg = _.clone(config.analytics)
STUB.analytics =
  stubbed: false,
  mute: () -> config.log.trk.event = false
  unmute: () -> config.log.trk.event = process.env['LOG_TRK_EVENT']
  on: () -> config.analytics = analyticsCfg
    # global.analytics = require('../../server/services/analytics')(global._analytics)
  off: () -> config.analytics = false
   # global.analytics = {
    # echo: ()=>{},
#     event: ()=>{},
#     view: ()=>{},
#     alias: ()=>{},
#     # identify: ()=>{}
#   }

STUB.analytics.mute()


STUB.Timezone = (key) ->
  STUB.wrapper('Timezone').cb('getTimezoneFromCoordinates', key||'timezone_melbourne')

  # (loc,n,cb) ->
  #   cb(null,


STUB.SlackCommon = ->
  STUB.sync(Wrappers.Slack, 'checkUserSync', null)
  @Slack = STUB.wrapper('Slack')
  @Slack.cb('getUsers', 'slack_users_list')
  cache.slack_users = FIXTURE.wrappers.slack_users_list
  @Slack.cb('getChannels', 'slack_channels_list')
  @Slack.cb('getGroups', 'slack_groups_list')
  @Slack.cb('getGroupWithHistory', 'slack_getGroupWithHistory')
  # @Slack.api('groups.info').fix('slack_group_info')
  # @Slack.api('groups.history').fix('slack_groups_history')


STUB.BraintreeCharge = (key) ->
  STUB.wrapper('Braintree').cb('addPaymentMethod', 'braintree_add_company_card')
  STUB.wrapper('Braintree').api('transaction.sale').fromCtx (payload) ->
    r = FIXTURE.clone('wrappers.'+(key||'braintree_charge_success'))
    r.transaction.amount = payload.amount.toString()
    r.transaction.orderId = payload.orderId.toString()
    [null, r]



EXPECT.ObjectId = (val) ->
  expect(val, "Expected ObjectId null").to.exist
  expect(val.constructor is ObjectId, "Expected ObjectId #{val.toString().white}".gray+" #{val.constructor} not an ObjectId".gray).to.be.true

EXPECT.touch = (touch, byId, action) ->
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

