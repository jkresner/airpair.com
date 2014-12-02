
var resolver = require('./../common/routes/helpers.js');

angular.module("APAuth", ['ngRoute','ngMessages','APFormsDirectives','APFilters','APSvcSession','APAnalytics'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $routeProvider.when('/login', {
      template: require('./login.html')
    });

    $routeProvider.when('/v1/auth/login', {
      template: require('./login.html')
    });

    $routeProvider.when('/v1/auth/signup', {
      template: require('./signup.html')
    });

  }])

  .run(['$rootScope', 'SessionService',
    function($rootScope, SessionService) {

    SessionService.onAuthenticated( (session) => {
      //console.log('setting root scope', $rootScope.session)
    })

  }])


  .controller('LoginCtrl', function($rootScope, $scope, $window, $timeout, $location, SessionService) {
    var self = this;

    $scope.returnTo = $location.search().returnTo;
    $scope.data = {};

    this.submit = function(isValid, formData) {
      if (!isValid) return
      SessionService.login(formData,
        (result) => {
        	// $window.location = '',
          $timeout(() => { window.location = $scope.returnTo || '/me'}, 250)
        },
        (e) => {
          $scope.loginFail = e.error
        }
      )
    }
  })

  .controller('SignupCtrl', function($scope, $window, $location, SessionService) {

    SessionService.onAuthenticated(function() {
      if ($scope.session._id) $location.path('/me')
    })

    var self = this;
    this.submit = function(isValid, formData) {
      if (!isValid) return
      SessionService.signup(formData,
        () => $window.location = '',
        (e) => $scope.signupFail = e.error
      )
    }
  })
