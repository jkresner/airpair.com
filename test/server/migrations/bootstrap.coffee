"""
  mocha test/server/migrations/bootstrap.coffee

"""

require('../setup/flavor')
require('../../../server/util/es6')
colors = require('colors')
colors.SPEC = colors.yellow.dim.bold
colors.SUBSPEC = colors.yellow.dim
colors.EXPECTEDERR = colors.magenta.dim
colors.APPLOAD = colors.white
colors.setTheme({
  spec: 'SPEC',
  subspec: 'SUBSPEC',
  expectederr: 'EXPECTEDERR',
  appload: 'APPLOAD'
})

global.config =
  mongoUri: "mongodb://localhost/airpair_dev"
  # mongoUri: "mongodb://heroku:PQDUBfuFXxtCHT-LpObnI_pS_nx7bEzs2vGtbP3pqxhZUeMGo1p7WXwAYLK9RqhiqD6ftG9-zmQ1CVWnWqeTEQ@candidate.14.mongolayer.com:10507/app33053049"
  log: { auth: false }


global._      = require('lodash')
global.util   = require('../../../shared/util')
global.moment = require('moment')


describe 'Migration: '.spec, ->

  @timeout(4000000)

  before (done) ->
    global.$log               = console.log
    global.logging            = false
    MongoClient               = require('mongodb').MongoClient
    MongoClient.connect config.mongoUri, (err, db) ->
      $log("                 Connected to db #{config.mongoUri}".appload)
      db.collection 'experts', (err, Experts) ->
        global.Experts = Experts
        db.collection 'users', (err, Users) ->
          global.Users = Users
          done()


  it.kip '20150409experts', (done) ->
    require('./20150409experts')(done)
    expect(true).to.be.true
