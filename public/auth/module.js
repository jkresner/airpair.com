
var resolver = require('./../common/routes/helpers.js');

angular.module("APAuth", ['ngRoute','APFilters','APSvcSession'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {
  
    $routeProvider.when('/v1/auth/login', {
      template: require('./login.html')
    });

    $routeProvider.when('/v1/auth/signup', {
      template: require('./signup.html')
    });

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
    
    // SessionService.onAuthenticated( (session) => {
    //   $rootScope.session = session;
    // })
  
  }])


  .controller('LoginCtrl', ['$scope', '$window', 'SessionService', 
      function($scope, $window, SessionService) {
    var self = this;

    this.submit = function(isValid, formData) {
      if (!isValid) return
      SessionService.login(formData, 
        () => $window.location = '',
        (e) => $scope.signupFail = e.error
      )
    }
  }])

  .controller('SignupCtrl', ['$scope', '$window', 'SessionService', 
      function($scope, $window, SessionService) {
    var self = this;
    this.submit = function(isValid, formData) {
      if (!isValid) return
      SessionService.signup(formData, 
        () => $window.location = '',
        (e) => $scope.signupFail = e.error
      )
    }
  }])

;