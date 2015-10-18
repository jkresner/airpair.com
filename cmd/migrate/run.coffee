# cmd/npm/run-db-migrate

colors                       = require('colors')
global.$log                  = console.log
global._                     = require('lodash')
global.moment                = require('moment')
global.domain                = require('domain')
global.fs                    = require('fs')
global.util                  = require('meanair-shared.util')
global.idToDate              = util.MongoUtil.idToDate
global.idToMoment            = util.MongoUtil.idToMoment



global.specInit = (ctx) ->
  ctx.timeout(4000000)
  before ->
    global.JSONSTRING = {}
    global.Tags = DB.Collections.tags
    global.Users = DB.Collections.users
    global.Experts = DB.Collections.experts
    global.Bookings = DB.Collections.bookings
    global.Requests = DB.Collections.requests
    global.Orders = DB.Collections.orders
    global.Posts = DB.Collections.posts
    global.Paymethods = DB.Collections.paymethods
    global.Payouts = DB.Collections.payouts
    global.ORDER = FIXTURE.orders
    global.EXPERT = FIXTURE.experts

  after ->
    delete global.JSONSTRING



SCREAM          = require('meanair-scream')


config          = require('./201509/setup')('test')


SCREAM(__dirname, config).run()
