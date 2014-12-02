(function() {

  var self = {};

  self.resolveSession = function(args) {
    return ['SessionService', '$window', '$location', '$q',
      function(SessionService, $window, $location, $q) {
        return SessionService.getSession().then(
          function(data) {
            // console.log('data', data)
            if (data._id)
            {
              return data;
            }
            else
            {
              var returnTo = $location.path()
              $location.path(`/v1/auth/login`).search('returnTo', returnTo)
              return $q.reject();
            }
          },
          function()
          {
            $location.path('/v1/auth/login')
            return $q.reject();
          }
        );
      }];
  }


  window.trackRoute = function(locationPath, locationSearch) {
    // console.log('trackRoute', analytics)
    if (analytics)
    {
      if (locationPath == '/v1/auth/login')
        analytics.track('Route',{ category: 'auth', name: 'login' })

      else if (locationPath == '/v1/auth/signup')
        analytics.track('Route',{ category: 'auth', name: 'signup' })

      else if (locationSearch && (locationSearch.utm_campaign || locationSearch.utm_source))
      {
        console.log('trackUtmRoute', locationSearch)
        analytics.track('Route',{ category: 'utm', name: locationPath.substring(1,locationPath.length-1) })
      }
    }
  }


  function resolveHelper(deps, extend) {
    deps = deps || [];

    extend = extend || {};
    angular.forEach(deps, function(entry) {
      var args, dep = entry;
      if (angular.isArray(entry)) {
        dep = entry[0];
        args = entry[1];
      }
      var fnName = 'resolve' + dep.charAt(0).toUpperCase() + dep.substr(1);
      // console.log('fnName', fnName, self, self[fnName])
      var fn = self[fnName](args);
      extend[dep] = fn;
    });

    return extend;
  }


  module.exports = {
    resolveHelper: resolveHelper,
    trackRoute: trackRoute
  };


})()
