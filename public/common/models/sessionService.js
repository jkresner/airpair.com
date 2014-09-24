
angular.module('APSvcSession', [])  

  .constant('API', '/v1/api')

  .constant('Auth', '/v1/auth')

  .service('SessionService', ['$http', 'API', 'Auth', '$cacheFactory', function($http, API, Auth, $cacheFactory) {
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

    this.login = function(data, success, error)
    {
      $http.post(`${Auth}/login`, data).success(success).error(error);
    }

    this.signup = function(data, success, error)
    {
      $http.post(`${Auth}/signup`, data).success(success).error(error);
    }
  
  }])
