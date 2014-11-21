
angular.module('APSvcSession', [])

  .constant('API', '/v1/api')

  .constant('Auth', '/v1/auth')

  .service('SessionService', ['$rootScope', '$http', 'API', 'Auth', '$cacheFactory', function($rootScope, $http, API, Auth, $cacheFactory) {

    var cache;
    this.getSession = function() {
      cache = cache || $cacheFactory();
      return $http.get(`${API}/session/full`, { cache : cache }).then(
          function(response) { return response.data; }
        );
    }

    var setScope = (successFn) => {
      return function(result) {
        $rootScope.session = result
        successFn(result)
      }
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
      $http.post(`${Auth}/login`, data).success(setScope(success)).error(error);
    }

    this.signup = function(data, success, error)
    {
      $http.post(`${Auth}/signup`, data).success(setScope(success)).error(error);
    }

    this.changeEmail = function(data, success, error)
    {
      $http.put(`${API}/users/me/email`, data).success(setScope(success)).error(error);
    }

    this.verifyEmail = function(data, success, error)
    {
      $http.put(`${API}/users/me/email-verify`, data).success(setScope(success)).error(error);
    }

    this.updateTag = function(data, success, error)
    {
      $http.put(`${API}/users/me/tag/${data.slug}`, {}).success(setScope(success)).error(error)
    }

    this.updateBookmark = function(data, success, error)
    {
      $http.put(`${API}/users/me/bookmarks/${data.type}/${data.objectId}`, {}).success(setScope(success)).error(error)
    }

    this.updateProfile = function(data, success, error)
    {
      $http.put(`${API}/users/me`, data).success(setScope(success)).error(error)
    }

    this.requestPasswordChange = function(data, success, error)
    {
      $http.put(`${API}/users/me/password-change`, data).success(success).error(error)
    }

    this.changePassword = function(data, success, error)
    {
      $http.put(`${API}/users/me/password`, data).success(success).error(error)
    }

    this.tags = function(data, success, error) {
      $http.put(`${API}/users/me/tags`, data).success(success).error(error);
    }

    this.bookmarks = function(data, success, error) {
      $http.put(`${API}/users/me/bookmarks`, data).success(success).error(error);
    }


    this.getPaymethods = function(success, error) {
      $http.get(`${API}/billing/paymethods`).success(success).error(error);
    }

    // this.createPaymethod = function(data, success, error) {
    //   $http.put(`${API}/users/me/bookmarks`, data).success(setScope(success)).error(error);
    // }

  }])
