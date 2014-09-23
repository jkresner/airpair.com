(function() {

  var self = {};

  self.resolveSession = function(args) {
    return ['SessionService', '$window', '$location', '$q',
      function(SessionService, $window, $location, $q) { 
        return SessionService.getSession().then(
          function(data) {
            return data;
          },
          function()
          {   
            // $window.location = '/v1/auth/login?returnTo=/posts/new';
            $location.path('/auth/login')
            return $q.reject();
          }
        ); 
      }]; 
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
      console.log('fnName', fnName, self, self[fnName])
      var fn = self[fnName](args);
      extend[dep] = fn;
    });

    return extend;
  }


  module.exports = resolveHelper;


})()
