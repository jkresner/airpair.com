
angular.module('APSvcSession', [])

  .constant('API', '/v1/api')

  .constant('Auth', '/auth')

  .factory('Notifications', function NotificationsFactory($rootScope, $location) {

    this.calculateNextNotification = () => {
      // var usr = $rootScope.session
      // if ($location.path().indexOf('/login') == 0 ||
      //   $location.path().indexOf('/posts/new') == 0 || !usr) return null
      // else if (!usr._id && usr.bookmarks && usr.bookmarks.length > 0) return { saveBookmarks: true }
      return null
    }

    return this;
  })

  .service('SessionService', function($rootScope, $http, $q, API, Auth, $cacheFactory, Notifications) {

    var setScope = (successFn, trackingData) => {
      return function(r) {
        r.unauthenticated = (r.authenticated!=null && r.authenticated == false)
        $rootScope.session = r
        $rootScope.notifications = Notifications.calculateNextNotification()

        // if (window.analytics && trackingData) analytics.track('Save', trackingData);
        successFn(r)
      }
    }

    var cache;
    this.getSession = function() {
      if ($rootScope.session)
        return $q((r)=> { return r($rootScope.session) })

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
        function(err) { window.location = '/logout'; }
      );
    }

    this.onAuthenticated = function(fn) {
      return this.getSession().then(fn);
    }

    this.onUnauthenticated = function(fn) {
      return this.getSession().then(null, fn);
    }


    // this.login = function(data, success, error) {
    //   $http.post(`${Auth}/login`, data).success(setScope(success)).error(error);
    // }

    // this.signup = function(data, success, error) {
    //   $http.post(`${Auth}/signup`, data).success(setScope(success)).error(error);
    // }

    this.changeEmail = function(data, success, error) {
      var trackingData = { type:'email', email: data.email }
      $http.put(`${API}/users/me/email`, data).success(setScope(success, trackingData)).error(error);
    }

    this.changeName= function(data, success, error) {
      var trackingData = { type:'name', name: data.name }
      $http.put(`${API}/users/me/name`, data).success(setScope(success, trackingData)).error(error);
    }

    this.changeLocationTimezone= function(data, success, error) {
      $http.put(`${API}/users/me/location`, data).success(setScope(success)).error(error);
    }

    // this.verifyEmail = function(data, success, error)
    // {
    //   $http.put(`${API}/users/me/email-verify`, data).success(setScope(success)).error(error);
    // }

    // this.updateTag = function(data, success, error) {
    //   $http.put(`${API}/users/me/tag/${encodeURIComponent(data.slug)}`, {}).success(setScope(success)).error(error)
    // }
    // this.updateBookmark = function(data, success, error) {
    //   $http.put(`${API}/users/me/bookmarks/${data.type}/${data.objectId}`, {}).success(setScope(success)).error(error)
    // }
    // this.tags = function(data, success, error) {
    //   $http.put(`${API}/users/me/tags`, data).success(setScope(success)).error(error);
    // }
    // this.bookmarks = function(data, success, error) {
    //   $http.put(`${API}/users/me/bookmarks`, data).success(setScope(success)).error(error);
    // }
    // this.getSiteNotifications = function(data, success, error) {
    //   $http.get(`${API}/users/me/site-notifications`).success(success).error(error)
    // }
    // this.toggleSiteNotification = function(data, success, error) {
    //   $http.put(`${API}/users/me/site-notifications`, data).success(success).error(error)

    // this.getMaillists = function(data, success, error) {
    //   $http.get(`${API}/users/me/maillists`, data).success(success).error(error)
    // }

    // this.toggleMaillist = function(data, success, error) {
    //   $http.put(`${API}/users/me/maillists`, data).success(success).error(error)
    // }
    // }


    this.updateBio = function(data, success, error) {
      $http.put(`${API}/users/me/bio`, data).success(setScope(success)).error(error)
    }
    this.updateName = function(data, success, error) {
      $http.put(`${API}/users/me/name`, data).success(setScope(success)).error(error)
    }
    this.updateInitials = function(data, success, error) {
      $http.put(`${API}/users/me/initials`, data).success(setScope(success)).error(error)
    }
    this.updateUsername = function(data, success, error) {
      $http.put(`${API}/users/me/username`, data).success(setScope(success)).error(error)
    }

    // this.requestPasswordChange = function(data, success, error) {
    //   $http.post(`/auth/password-reset`, data).success(success).error(error)
    // }

    // this.changePassword = function(data, success, error) {
    //   $http.post(`/auth/password-set`, data).success(setScope(success)).error(error)
    // }

  })
