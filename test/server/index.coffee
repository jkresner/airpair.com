{colors,initGlobals,initConfig} = require('./../../server/util/_setup')


config = initConfig('test')
initGlobals(config)


SCREAM          = require('meanair-scream')
global.SETUP    = require('./helpers/setup')
global.newId    = -> new DB.ObjectId()
global.timeSeed = SETUP.timeSeed
global.ANONSESSION = (cb) ->
  global.COOKIE = null
  GET '/session/full', cb
global.expectObjectId = (val) ->
  expect(val, "Expected ObjectId null").to.exist
  expect(val.constructor is ObjectId, "Expected ObjectId #{val.toString().white}".gray+" #{val.constructor} not an ObjectId".gray).to.be.true
global.expectTouch = (touch, byId, action) ->
  expect(touch._id).to.exist
  # expectObjectId(touch._id)
  expectIdsEqual(touch.by._id, byId)
  expect(touch.action).to.equal(action)


loginHandler = (req, cb) ->
  fixtureUser = FIXTURE.users[req.body.key]
  if !fixtureUser
    throw Error("Could not find FIXTURE.user for {key:#{req.body.key}}")
  {email} = FIXTURE.users[req.body.key]
  fn = require('../../server/services/auth').localLogin
  fn.call req, email, config.auth.masterpass, (e,r) ->
    req.session.passport = { user: r } if r
    cb(e,r)

colors.setTheme({
  spec: ['yellow','dim','bold']
  # subspec: ['yellow','dim']
  expectederr: 'red'
  appload: 'white'
  update: 'yellow'
  trace: 'grey'
  validation: 'blue'
  wrappercall: 'white'
})

config.colors = colors
config.log.auth = false
config.log.da = false


global.againstProd = true


SCREAM(__dirname, config, loginHandler).run()




global.STRINGIFY = (obj) ->
  if !JSONSTRING[obj._id]
    JSONSTRING[obj._id] = JSON.stringify(obj).gray
  JSONSTRING[obj._id]


global.expectAttr = (obj, attr, constructor) ->
  expect(obj[attr], attr.white+" missing on: "+STRINGIFY(obj)).to.exist
  if (constructor)
    expect(obj[attr].constructor, "#{attr}.constuctor #{obj[attr].constructor.name.cyan} but expecting #{constructor.name.cyan} on: "+STRINGIFY(obj)).to.equal(constructor)


global.expectAttrUndefined = (obj, attr) ->
  expect(obj[attr], attr.white+" shoud not be found on "+STRINGIFY(obj)).to.be.undefined


global.specInit = (ctx) ->

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
