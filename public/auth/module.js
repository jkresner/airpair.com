
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


  .controller('LoginCtrl', ['$scope', 'SessionService', 
      function($scope, SessionService) {
    var self = this;

    this.submit = function(isValid, formData) {
      console.log('validate me biaaat', isValid)
      if (!isValid) return
      // submit data to the server
    }


    // SessionService.onAuthenticated( (session) => {
    //   PostsService.getMyPosts(function (result) {
    //     $scope.myposts = result;
    //   })  
    // }); 
  }])

  .controller('SignupCtrl', ['$scope', 'SessionService', 
      function($scope, SessionService) {
    var self = this;

    this.submit = function(isValid, formData) {
      console.log('validate me biaaat', isValid)
      if (!isValid) return
      // submit data to the server
    }


    // SessionService.onAuthenticated( (session) => {
    //   PostsService.getMyPosts(function (result) {
    //     $scope.myposts = result;
    //   })  
    // }); 
  }])

;