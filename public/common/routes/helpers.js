(function() {

  var self = {};

  self.resolveSession = function(args) {
    return ['SessionService', '$window', '$location', '$q',
      function(SessionService, $window, $location, $q) { 
        return SessionService.getSession().then(
          function(data) {
            console.log('data', data)
            if (data._id)
            { 
              return data;
            } 
            else
            {
              $location.path('/v1/auth/login')
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

  global.trackRoute = function(locationPath) {
    if (analytics)
    {
      if (locationPath == '/v1/auth/login') {
        // console.log('tracking', 'login')
        analytics.track('Route',{ category: 'auth', name: 'login' })
      }
      else if (locationPath == '/v1/auth/signup') {
        // console.log('tracking', 'signup')
        analytics.track('Route',{ category: 'auth', name: 'signup' })
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
