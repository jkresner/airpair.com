module.exports = ({meanair}, mw) => {
  var {logic} = meanair


  mw.cache('cachedSlackUsers',  mw.data.cached('slack_users', Wrappers.Slack.getUsers))
  mw.cache('cachedPublished',   mw.data.cached('published', logic.posts.recommended.exec))

  mw.cache('inflateMe', mw.data.recast('user','user._id',{required:false,merge:true}))
  mw.cache('inflateMeExpert', mw.data.recast('expert','user._id',{queryKey:'userId'}))

  var {tagLookup} = logic.tags
  mw.cache('paramTag', (req, res, next) => {
    var lookup = req.params.tag
    var inValid = tagLookup.validation(req.user, lookup)
    if (inValid) return next(Error(`req.params.tag ${lookup} inValid`))
    logic.tags.tagLookup(req.params.tag, (e,r) => {
      if (e||!r) return next(e||Error(`Tag param not found by ${lookup}`))
      next(null, req.tag = r)
    })
  })


  mw.cache('inflateOrderBooking', function(req, res, next) {
    if (!req.order) return next()
    var line = _.find(req.order.lines, l => l.info && l.info.paidout != null)
    if (!line && !line.bookingId) return next()
    API.Bookings.svc.getByIdForParticipant.call(req, line.bookingId,
      (e, r) => next(e, r ? req.booking = r : null) )
  })


}
