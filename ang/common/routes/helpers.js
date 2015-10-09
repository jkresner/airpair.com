(function() {

  var self = {};


  self.resolveExpert = function(args) {
    return ['$rootScope', '$location', '$q',
      function($rootScope, $location, $q) {
        // console.log('resolveExpert')
        if (!$rootScope.session) {
          $location.path('/login')
          return $q.reject()
        }
        else if (!$rootScope.session._id) {
          $location.path('/login')
          return $q.reject()
        }
        else if (!$rootScope.session.cohort ||
          !$rootScope.session.cohort.expert ||
          !$rootScope.session.cohort.expert._id
        ) {
          $location.path('/be-an-expert')
          return $q.reject()
        }

        return $q
      }];
  }


  self.resolveSession = function(args) {
    return ['SessionService', '$rootScope', '$window', '$location', '$q',
      function(SessionService, $rootScope, $window, $location, $q) {
        // console.log('resolveSession')
        return SessionService.getSession().then(
          function(data) {
            if (data._id)
            {
              return data;
            }
            else if ($rootScope.session && $rootScope.session._id)
            {
              // SessionService.flushCache();
              return $rootScope.session;
            }
            else
            {
              var returnTo = $location.path()
              $location.path(`/login`).search('returnTo', returnTo)
              return $q.reject();
            }
          },
          function()
          {
            $location.path('/login')
            return $q.reject();
          }
        );
      }];
  }


  window.trackRoute = function(locationPath, locationSearch) {
    // console.log('trackRoute', analytics)
    if (window.analytics)
    {
      if (locationPath == '/login')
        analytics.track('Route',{ category: 'auth', name: 'login' })

      else if (locationPath == '/v1/auth/signup')
        analytics.track('Route',{ category: 'auth', name: 'signup' })

      else if (locationSearch && (locationSearch.utm_campaign || locationSearch.utm_source))
      {
        console.log('trackUtmRoute', locationSearch)
        analytics.track('Route',{ category: 'utm', name: locationPath.substring(1,locationPath.length) })
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
