var logging = false
var parseURL = require('url').parse

var middleware = {

  noTrailingSlash(req, res, next) {
    if (logging) $log(`mw.noTrailingSlash ${req.url}`.cyan)
    var method = req.method.toLowerCase()

    // Skip when the request is neither a GET or HEAD.
    if (!(method === 'get' || method === 'head'))
      return next()

    var url      = parseURL(req.url),
        pathname = url.pathname,
        search   = url.search || '',
        hasTrailingSlash = pathname.charAt(pathname.length - 1) === '/';

    if (!hasTrailingSlash)
      return next()

    // Adjust the URL's path by removing a trailing slash
    pathname = pathname.slice(0, -1)
    res.redirect(301, pathname + search)
    res.end()
  }

}

module.exports = middleware
