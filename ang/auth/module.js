
var resolver = require('./../common/routes/helpers.js');

angular.module("APAuth", ['ngRoute','ngMessages','APFormsDirectives','APFilters','APSvcSession'])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/login', {
      template: require('./login.html')
    });

    $routeProvider.when('/password-reset', {
      template: require('./passwordreset.html'),
    });

  })

  .run(function($rootScope, SessionService) {

    SessionService.onAuthenticated( (session) => {
      // window.firebaseToken = session.firebaseToken;
    })

  })


  .controller('LoginCtrl', function($rootScope, $scope, $window, $timeout, $location, SessionService) {
    var self = this;

    $scope.returnTo = $location.search().returnTo;
    $scope.data = {};

    if ($location.search().as)
      $scope.data.email = $location.search().as

    this.submit = function(isValid, formData) {
      if (!isValid) return
      SessionService.login(formData,
        (result) => {
        	// $window.location = '',
          $timeout(() => { window.location = $scope.returnTo || '/'}, 250)
        },
        (e) => {
          $scope.loginFail = e.message || e
        }
      )
    }
  })

  // .controller('SignupCtrl', function($scope, $window, $location, SessionService) {

  //   SessionService.onAuthenticated(() => { if ($scope.session._id) $location.path('/')})

  //   var self = this;
  //   this.submit = function(isValid, formData) {
  //     if (!isValid) return
  //     SessionService.signup(formData,
  //       () => $window.location = '',
  //       (e) => $scope.signupFail = e.message || e
  //     )
  //   }
  // })

  .controller('PasswordResetCtrl', function($scope, ServerErrors, SessionService) {

    SessionService.onAuthenticated(() => { if ($scope.session._id) $location.path('/')})

    $scope.data = { email: "" }

    var self = this;
    self.submitReset = function(isValid, formData) {
      if (!isValid) return
      SessionService.requestPasswordChange(formData, function(result){
        $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${result.email}` }]
      }, ServerErrors.add)
    };
  })

