
angular.module('APSvcSession', [])

  .constant('API', '/v1/api')

  .constant('Auth', '/v1/auth')

  .factory('Notifications', function NotificationsFactory($rootScope, $location) {

    this.calculateNextNotification = () => {
      var usr = $rootScope.session
      if ($location.path().indexOf('/login') == 0 || !usr) return null
      else if (!usr._id && usr.bookmarks && usr.bookmarks.length > 0) return { saveBookmarks: true }
      else if (!usr.emailVerified && usr._id && $location.path().indexOf('/me') != 0) return { verifyEmail: true }
      return null
    }

    return this;
  })

  .service('SessionService', function($rootScope, $http, $q, API, Auth, $cacheFactory, Notifications) {

    var setScope = (successFn, trackingData) => {
      return function(r) {
        if (r._id && window._)
          $rootScope.session = _.extend($rootScope.session||{}, r)
        else
          $rootScope.session = r

        $rootScope.notifications = Notifications.calculateNextNotification()

        if (trackingData) analytics.track('Save', trackingData);

        // console.log(r);
        window.firebaseToken = r.firebaseToken;
        successFn(r)
      }
    }

    var cache;
    this.getSession = function() {
      if ($rootScope.session && $rootScope.session.authenticated == false)
        return $q((r)=>r($rootScope.session))

      cache = cache || $cacheFactory();
      return $http.get(`${API}/session/full`, {cache:cache}).then(
        function(response) {
          if ($rootScope.session && $rootScope.session.tags) {
            return $rootScope.session
          } else {
            setScope(()=>{})(response.data);
            return response.data;
          }
        },
        function(err) { window.location = '/v1/auth/logout'; }
      );
    }

    this.onAuthenticated = function(fn) {
      return this.getSession().then(fn);
    }

    this.onUnauthenticated = function(fn) {
      return this.getSession().then(null, fn);
    }

    this.login = function(data, success, error)
    {
      $http.post(`${Auth}/login`, data).success(setScope(success)).error(error);
    }

    this.signup = function(data, success, error)
    {
      $http.post(`${Auth}/signup`, data).success(setScope(success)).error(error);
    }

    this.subscribe = function(data, success, error)
    {
      $http.post(`${Auth}/subscribe`, data).success(setScope(success)).error(error);
    }

    this.changeEmail = function(data, success, error)
    {
      var trackingData = { type:'email', email: data.email }
      $http.put(`${API}/users/me/email`, data).success(setScope(success, trackingData)).error(error);
    }

    this.changeName= function(data, success, error)
    {
      var trackingData = { type:'name', name: data.name }
      $http.put(`${API}/users/me/name`, data).success(setScope(success, trackingData)).error(error);
    }

    this.verifyEmail = function(data, success, error)
    {
      $http.put(`${API}/users/me/email-verify`, data).success(setScope(success)).error(error);
    }

    this.updateTag = function(data, success, error)
    {
      $http.put(`${API}/users/me/tag/${encodeURIComponent(data.slug)}`, {}).success(setScope(success)).error(error)
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
      $http.put(`${API}/users/me/tags`, data).success(setScope(success)).error(error);
    }

    this.bookmarks = function(data, success, error) {
      $http.put(`${API}/users/me/bookmarks`, data).success(setScope(success)).error(error);
    }

  })
