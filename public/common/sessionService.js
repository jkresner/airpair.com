angular.module('APSvcSession', [])  

  .constant('API', '/v1/api')

  .service('SessionService', ['$http', 'API', '$cacheFactory', function($http, API, $cacheFactory) {
    var cache;
    this.getSession = function() {
      cache = cache || $cacheFactory();
      return $http.get(`${API}/session/full`, { cache : cache }).then(
          function(response) { return response.data; }
        );
    }

    this.onAuthenticated = function(fn) {
      return this.getSession().then(fn);
    }

    this.onUnauthenticated = function(fn) {
      return this.getSession().then(null, fn);
    }

    this.flushCache = function() {
      cache = null; 
    };

    /*
    this.getSessionFull = function(success, error)
    {
      $http.get(`${API}/session/full`).success(success).error(error);
    }
    */
  }])
