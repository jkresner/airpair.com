
angular.module('APSvcSession', [])

  .constant('API', '/v1/api')

  .constant('Auth', '/v1/auth')

  .factory('Notifications', function NotificationsFactory($rootScope, $location) {
    // this.add = (msg) =>
    //   $rootScope.notifications = _.union($rootScope.notifications, [msg])

    // this.remove = (msg) =>
    //   $rootScope.notifications = _.without($rootScope.notifications, msg)

    this.calculateNextNotification = () => {
      var usr = $rootScope.session
      if ($location.path().indexOf('/login') == 0) return null
      else if (!usr._id && usr.bookmarks && usr.bookmarks.length > 0) return { saveBookmarks: true }
      else if (!usr.emailVerified && usr._id && $location.path().indexOf('/me') != 0) return { verifyEmail: true }
      return null
    }

    return this;
  })

  .service('SessionService', function($rootScope, $http, API, Auth, $cacheFactory, Notifications) {

    var setScope = (successFn, trackingData) => {
      return function(r) {

        $rootScope.session = r
        $rootScope.notifications = Notifications.calculateNextNotification()

        if (trackingData) analytics.track('Save', trackingData);

        successFn(r)
      }
    }

    var cache;
    this.getSession = function() {
      cache = cache || $cacheFactory();
      return $http.get(`${API}/session/full`, { cache : cache }).then(
          function(response) { return response.data; }
        );
    }

    this.flushCache = function() {
      cache = null;
    };

    this.onAuthenticated = function(fn) {
      return this.getSession().then(setScope(fn));
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

    this.changeEmail = function(data, success, error)
    {
      var trackingData = { type:'email', email: data.email }
      $http.put(`${API}/users/me/email`, data).success(setScope(success, trackingData)).error(error);
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

  })
