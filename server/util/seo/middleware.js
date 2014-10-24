var parseURL = require('url').parse;

export function noTrailingSlash(statusCode) {
	// Force a permanent redirect, unless otherwise specified.
	statusCode || (statusCode = 301);

	return function (req, res, next) {
		var method = req.method.toLowerCase();

		// Skip when the request is neither a GET or HEAD.
		if (!(method === 'get' || method === 'head')) {
			next();
			return;
		}

		var url      = parseURL(req.url),
			pathname = url.pathname,
			search   = url.search || '',
			hasTrailingSlash = pathname.charAt(pathname.length - 1) === '/';

		if (!hasTrailingSlash) return next()

		// Adjust the URL's path by removing a trailing slash
		pathname = pathname.slice(0, -1)
		res.redirect(statusCode, pathname + search);
		res.end()
	};
}
