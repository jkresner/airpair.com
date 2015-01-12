
var resolver = require('./../common/routes/helpers.js');

angular.module("APAuth", ['ngRoute','ngMessages','APFormsDirectives','APFilters','APSvcSession'])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/login', {
      template: require('./login.html')
    });

    $routeProvider.when('/v1/auth/login', {
      template: require('./login.html')
    });

    $routeProvider.when('/v1/auth/signup', {
      template: require('./signup.html')
    });

    $routeProvider.when('/v1/auth/reset', {
      template: require('./passwordreset.html'),
    });

  })

  .run(function($rootScope, SessionService) {

    SessionService.onAuthenticated( (session) => {
      console.log('setting root scope', session);
      window.firebaseToken = session.firebaseToken;
    })

  })


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

    SessionService.onAuthenticated(() => { if ($scope.session._id) $location.path('/me')})

    var self = this;
    this.submit = function(isValid, formData) {
      if (!isValid) return
      SessionService.signup(formData,
        () => $window.location = '',
        (e) => $scope.signupFail = e.error
      )
    }
  })

  .controller('PasswordResetCtrl', function($scope, ServerErrors, SessionService) {

    SessionService.onAuthenticated(() => { if ($scope.session._id) $location.path('/me')})

    $scope.data = { email: "" }

    var self = this;
    self.submitReset = function(isValid, formData) {
      if (!isValid) return
      SessionService.requestPasswordChange(formData, function(result){
        $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${result.email}` }]
      }, ServerErrors.add)
    };
  })

