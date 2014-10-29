
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


  .controller('AccountCtrl', ['$rootScope', '$scope', '$location', 'SessionService',
    function($rootScope, $scope, $location, SessionService) {

 		var self = this;

 		if ($location.search().verify) {
 			SessionService.verifyEmail({hash:$location.search().verify}, function(result){
				$rootScope.session = result
			}, function(e){
				console.log('verifyEmail.failed', e)
			})
 		}

	  SessionService.onAuthenticated( (session) =>
	    $scope.data = _.pick(session, 'name','email','initials','username')  )

		if ($scope.session)
		  $scope.data = _.pick($scope.session, 'name','email','initials','username')

 		$scope.sendVerificationEmail = function() {
			SessionService.changeEmail({email:$scope.session.email}, function(result){
				console.log('changeEmail.sucess', result)
			}, function(e){
				console.log('changeEmail.failed', e)
			})
 		};

		$scope.updateEmail = function(model) {
			if (!model.$valid) return
			$scope.emailChangeFailed = ""

		  SessionService.changeEmail({ email: $scope.data.email },
		    (result) => {
					console.log('updateEmail', analytics)
		    	analytics.track('Save', { type:'email', email: result.email });
		    	$rootScope.session = result
		    	$scope.data.email = result.email
		    }
		    ,
		    (e) => {
		    	$scope.emailChangeFailed = e.message
		    	$scope.data.email = null
		    }
		  )
		}

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
