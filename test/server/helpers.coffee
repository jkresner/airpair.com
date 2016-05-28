{log} = config
if log && process.env['LOG_APP_VERBOSE'] then log.app.verbose = process.env['LOG_APP_VERBOSE']
if log && process.env['LOG_APP_MUTE'] then log.app.mute = process.env['LOG_APP_MUTE']
# if (process.env[`LOG_${cfg.logFlag}`]) = cfg.logFlag ? 'white' : undefined



{TypesUtil}     = require("meanair-shared")
global.UTIL =
  in:           (ms, fn) -> setTimeout(fn, ms)
  Date:         TypesUtil.Date



"""
DB
"""


DB.ensureExpert = (key, done) ->
  DB.ensureDocs 'User', [FIXTURE.users[key]], (e) =>
    DB.ensureDocs 'Expert', [FIXTURE.experts[key]], (ee) => done()


DB.noSession = ({sessionID}, cb) ->
  a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/
  expect(sessionID).to.match(a_uid)
  DB.docsByQuery 'Session', {_id:sessionID}, (s) ->
    expect(s.length).to.equal(0)
    DB.docsByQuery 'View', { sId:sessionID }, (views) ->
      expect(views.length).to.equal(0)
      DB.docsByQuery 'Impression', { sId:sessionID }, (impressions) ->
        expect(impressions.length).to.equal(0)
        cb()


DB.expectSession = ({sessionID}, cb) ->
  a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/
  expect(sessionID).to.match(a_uid)
  DB.docsByQuery 'Session', {_id:sessionID}, (s) ->
    expect(s.length, "db.Session({_id:#{sessionID}).length == #{s.length}").to.equal(1)
    cb()


"""
FLAVOUR
"""


# global.STRINGIFY = (obj) ->
#   if !JSONSTRING[obj._id]
#     JSONSTRING[obj._id] = JSON.stringify(obj).gray
#   JSONSTRING[obj._id]

# EXPECT.ObjectId = (val) ->
  # expect(val, "Expected ObjectId null").to.exist
  # expect(val.constructor is ObjectId, "Expected ObjectId #{val.toString().white}".gray+" #{val.constructor} not an ObjectId".gray).to.be.true


# EXPECT.touch = (touch, byId, action) ->
  # expect(touch._id).to.exist
  # expect(touch._id.constructor is ObjectId).to.be.true
  # expectObjectId(touch._id)
  # EXPECT.equalIds(touch.by._id, byId)
  # expect(touch.action).to.equal(action)


# EXPECT.attr = (obj, attr, constructor) ->
#   expect(obj[attr], attr.white+" missing on: "+STRINGIFY(obj)).to.exist
#   if (constructor)
#     expect(obj[attr].constructor, "#{attr}.constuctor #{obj[attr].constructor.name.cyan} but expecting #{constructor.name.cyan} on: "+STRINGIFY(obj)).to.equal(constructor)


# EXPECT.attrUndefined = (obj, attr) ->
#   expect(obj[attr], attr.white+" shoud not be found on "+STRINGIFY(obj)).to.be.undefined



"""
DATA
"""

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


DATA.QUERY =
  users: require('./../../server/services/users.data').query.existing



"""
HTTP
"""


global.ANONSESSION = (opts, cb) ->
  if !cb
    cb = opts

  global.COOKIE = null
  GET '/session/full', opts, cb


global.SIGNUP = (login, cb) ->
  profile = DATA.ghProfile login, true
  FIXTURE.users[profile.login] = {auth:{gh:profile}}
  LOGIN profile, {retainSession:true}, cb


global.HTML = ({test}, match, opts) =>
  status = (opts||{}).status || 200
  nomatch = (opts||{}).no || []
  PAGE test.title, { contentType: /html/, status }, (html) =>
    expect(html).match(pattern) for pattern in match
    expect(html).not.match(pattern) for pattern in nomatch
    if test.parent.title.match(/noindex/i)
      expect(html).to.have.string('<meta name="robots" content="noindex, follow">')
    else if test.parent.title.match(/index/i)
      expect(html).to.have.string('<meta name="robots" content="index, follow">')
    DONE()


global.IMG = ({test}, opts) =>
  status = (opts||{}).status || 200
  PAGE test.title, { contentType: /image/, status }, (image) =>
    DONE()

# global.REDIRECT = ({test}, to, opts) =>
#   status = (opts||{}).status || 301
#   PAGE test.title, { contentType: /text/, status }, (txt) =>
#     if status == 301
#       expect(txt).to.have.string("Moved Permanently\. Redirecting to #{to}")
#     if status == 302
#       expect(txt).to.have.string("Found\. Redirecting to #{to}")
#     DONE()


"""
STUB(s)
"""

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
