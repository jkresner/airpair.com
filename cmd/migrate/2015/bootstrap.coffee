"""
  mocha server/cmd/migrations/bootstrap.coffee

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
      db.collection 'posts', (err, Posts) ->
        global.Posts = Posts
        done()

      # db.collection 'bookings', (err, Bookings) ->
      #   global.Bookings = Bookings
        # db.collection 'orders', (err, Orders) ->
        #   global.Orders = Orders
          # db.collection 'requests', (err, Requests) ->
          #   global.Requests = Requests
    #   $log("                 Connected to db #{config.mongoUri}".appload)
    #   db.collection 'experts', (err, Experts) ->
    #     global.Experts = Experts
    #     db.collection 'users', (err, Users) ->
    #       global.Users = Users

  it '20150712 Post Comp Prizes', (done) ->
    require('./20150712postcomp')(done)
    expect(true).to.be.true


  # it '20150704 2013-2014 orderIds on migrated bookings', (done) ->
  #   require('./20150704orderIdonBookings')(done)
  #   expect(true).to.be.true


  # it '20150704 add bookingIds to (v1) order lines', (done) ->
  #   require('./20150704bookingIdonLines')(done)
  #   expect(true).to.be.true


  # it '20150421experts', (done) ->
  #   require('./20150421experts')(done)
  #   expect(true).to.be.true

  # it 'can run request report', (done) ->
  #   require('../../../server/util/mongoInit').connect ->
  #     require('../../../server/services/reports').getRequestReports (e, r) ->
  #       $log('summary.time'.magenta, r.wkSummary.time)
  #       $log('summary.status'.magenta, r.wkSummary.status)
  #       done()


  # it 'can update all cohorts', (done) ->
  #   require('../../../server/util/mongoInit').connect ->
  #     require('../../../server/services/reports').updateCohorts (e, r) ->
  #       done()
