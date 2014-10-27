
var resolver = require('./../common/routes/helpers.js').resolveHelper;


angular.module("APProfile", ['ngRoute', 'APFilters', 'APSvcSession', 'APTagInput'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/me', {
      template: require('./account.html'),
      controller: 'AccountCtrl as account',
      resolve: authd
    });

    $routeProvider.when('/me/:username', {
      template: require('./profile.html'),
      controller: 'ProfileCtrl as profile',
      resolve: authd
    });

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {

  }])


  .controller('AccountCtrl', ['$scope', 'SessionService',
      function($scope, SessionService) {

   		var self = this;

  }])

	//-- this will be refactored out of the posts module
	.controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams', 'session',
	  function($scope, PostsService, $routeParams, session) {

	    $scope.username = $routeParams.username;

	    PostsService.getByUsername($routeParams.username, (posts) => {
	      $scope.posts = posts;
	    });

  }])

;
