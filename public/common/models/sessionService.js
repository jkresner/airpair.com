
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

    this.login = function(data, success, error)
    {
      $http.post(`${Auth}/login`, data).success(success).error(error);
    }


    this.signup = function(data, success, error)
    {
      $http.post(`${Auth}/signup`, data).success(success).error(error);
    }

    this.changeEmail = function(data, success, error)
    {
      $http.put(`${API}/users/me/email`, data).success(success).error(error);
    }

    this.updateTag = function(data, success, error)
    {
      $http.put(`${API}/users/me/tag/${data.slug}`, {}).success(success).error(error)
    }

    this.updateBookmark = function(data, success, error)
    {
      $http.put(`${API}/users/me/bookmarks/${data.type}/${data.objectId}`, {}).success(success).error(error)
    }

  }])
