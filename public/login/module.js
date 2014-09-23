require('./../common/filters.js');
require('./../common/sessionService.js');

var resolver = require('./../common/routes/helpers.js');

angular.module("APLogin", ['ngRoute','APFilters','APSvcSession'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {
  
    $locationProvider.html5Mode(true);

    $routeProvider.when('/auth/login', {
      template: require('./login.html')
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

;