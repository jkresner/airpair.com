var middleware = {

  slowrequests(req, res, next) {
    var start = new Date
    res.on('finish', function() {
      var duration = new Date - start
      if (duration > 1000)
      $log(`req::end ${duration} ${req.url}`.red)
    })
    next()
  }

}

module.exports = middleware
