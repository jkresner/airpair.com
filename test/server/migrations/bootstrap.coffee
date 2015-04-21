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
  mongoUri: "mongodb://localhost/airp air_dev"
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
          db.collection 'bookings', (err, Bookings) ->
            global.Bookings = Bookings
            db.collection 'orders', (err, Orders) ->
              global.Orders = Orders
              db.collection 'requests', (err, Requests) ->
                global.Requests = Requests
                done()


  it '20150421callstobookings', (done) ->
    require('./20150421callstobookings')(done)
    expect(true).to.be.true
