var logging = false

var resolver = {
  fnLookup: {},
  resolve(paramName) {
    var {svcName,svcFnName} = resolver.fnLookup[paramName]
    var svc = require(`../services/${svcName}`)
    return svc[svcFnName]
  },
  param(paramName, svcName, svcFnName) {
    resolver.fnLookup[paramName] = { svcName, svcFnName }
    return resolver
  }
}

resolver
  .param('expert', 'experts', 'getById')
  .param('paymethod', 'paymethods', 'getById')
  .param('orders', 'orders', 'getMultipleOrdersById')
  .param('tagfrom3rdparty', 'tags', 'getBy3rdParty')

var ErrorApi404 = (msg) => {
  var e = new Error(msg)
  e.status = 404
  e.fromApi = true
  return e
}


var middleware = {

  json2mb: require('body-parser').json({limit: '2mb'}),

  bodyParam(paramName) {
    return (req, res, next) => {
      var param = req.body[paramName]
      if (!param) return next(ErrorApi404(`Body param ${paramName} not specified.`))
      if (logging) $log('bodyParamFn'.trace, paramName, req.body[paramName])

      var svcFn = resolver.resolve(paramName)
      $callSvc(svcFn,req)(param, function(e, r) {
        if (!e && !r)
          e = ErrorApi404(`${paramName} not found.`)
        else if (!e && typeof param == 'array' && param.length != r.length)
          e = (`Not all ${paramName} found.`)

        if (e) return next(e)
        else {
          req[paramName] = r
          // $log(`req.${paramName}`, req[paramName])
          next()
        }
      })
    }
  },

  cache: {

    itemReady(key) {
      return (req, res, next) =>
        cache.ready([key], next)
    },

    slackReady(req, res, next) {
      if (logging) $log('cache.slackReady'.trace)
      Wrappers.Slack.getUsers(next)
    },

    templatesReady(req, res, next) {
      if (logging) $log('cache.templatesReady'.trace)
      cache.tmpl('','',()=>{next()})
    },

  },

  populate: {

    user(req, res, next) {
      var UserSvc = require("../services/users")
      if (logging) $log('bodyParamFn'.trace, paramName, req.body[paramName])

      $callSvc(UserSvc.getMe, req)(function(e, r) {
        // if (!e && !r)
        //   e = ErrorApi404(`${paramName} not found.`)
        // else if (!e && typeof param == 'array' && param.length != r.length)
        //   e = (`Not all ${paramName} found.`)
        if (e) return next(e)
        else {
          req.user = r
          // $log(`req.${paramName}`, req[paramName])
          next()
        }
      })
    },

    expert(req, res, next) {
      var ExpertsSvc = require("../services/experts")
      if (logging) $log('populate.expert'.trace, req.user._id)
      $callSvc(ExpertsSvc.getMe,req)(function(e, r) {
        if (e) return next(e)
        else {
          // if (r._id)
          req.expert = r
          next()
        }
      })
    },

    orderBooking(req, res, next) {
      if (logging) $log('populate.orderBooking'.trace, req.user._id)
      if (!req.order) return next()
      var BookingsSvc = require("../services/bookings")
      var line = _.find(req.order.lines,(l) =>l.info && l.info.paidout != null)
      if (!line && !line.bookingId) return next()
      $callSvc(BookingsSvc.getByIdForParticipant,req)(line.bookingId, (e, r) => {
        if (e) return next(e)
        req.booking = r
        next()
      })
    },

    tagPage(slug) {
      return function(req, res, next) {
        var TagsSvc = require("../services/tags")
        if (logging) $log('populate.tagsPage'.trace, slug)
        $callSvc(TagsSvc.getTagPage,req)(slug, function(e, r) {
          if (e) return next(e)
          else {
            req.tagpage = r
            req.tagpage.meta = r.tag.meta
            req.tag = r.tag
            // $log('req.tagpage', req.tagpage)
            next()
          }
        })
      }
    }

  }

}

module.exports = middleware
