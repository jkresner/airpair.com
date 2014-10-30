
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

    $routeProvider.when('/me/password', {
      template: require('./password.html'),
      controller: 'PasswordCtrl as account'
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
		$scope.emailAlerts = []

 		if ($location.search().verify) {
 			SessionService.verifyEmail({hash:$location.search().verify}, function(result){
				$scope.emailAlerts.push({ type: 'success', msg: `${$scope.session.email} verified !` })
			}, function(e){
				console.log('verifyEmail.failed', e)
			})
 		}

	  SessionService.onAuthenticated( (session) =>
	    $scope.data = _.pick(session, 'name','email','initials','username')  )

		if ($scope.session)
		  $scope.data = _.pick($scope.session, 'name','email','initials','username')

 		angular.element('#profileForm input').on('blur', function(event) {
 			$scope.profileAlerts = []

 			console.log('profileForm.$valid', profileForm.$valid)

 			if ($scope.session.name != $scope.data.name ||
 				$scope.session.initials != $scope.data.initials ||
 				$scope.session.username != $scope.data.username
 				)
 			{
	 			SessionService.updateProfile($scope.data, function(result){
					$scope.profileAlerts.push({ type: 'success', msg: `${event.target.name} updated` })
				}, function(e){
					$scope.data.username = $scope.session.username
					$scope.profileAlerts.push({ type: 'danger', msg: e.message })
				})
 			}
 		})

		$scope.updateEmail = function(model) {
			if (!model.$valid || $scope.data.email == $scope.session.email) return
			$scope.emailChangeFailed = ""

		  SessionService.changeEmail({ email: $scope.data.email },
		    (result) => {
		    	$scope.data.email = result.email
		    }
		    ,
		    (e) => {
		    	$scope.emailChangeFailed = e.message
		    	$scope.data.email = null
		    }
		  )
		}

 		$scope.sendVerificationEmail = function() {
			SessionService.changeEmail({email:$scope.session.email}, function(result){
				console.log('changeEmail.success', result)
			}, function(e){
				console.log('changeEmail.failed', e)
			})
 		};

 		$scope.sendPasswordChange = function() {
			SessionService.requestPasswordChange({email:$scope.session.email}, function(result){
				$scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${$scope.session.email}` }]
			}, function(e){
				console.log('requestPasswordChange.failed', e)
			})
 		};

  }])

	//-- this will be refactored out of the posts module
	.controller('ProfileCtrl', ['$scope', 'PostsService', '$routeParams',
	  function($scope, PostsService, $routeParams) {

	    $scope.username = $routeParams.username;

	    PostsService.getByUsername($routeParams.username, (posts) => {
	      $scope.posts = posts;
	    });

  }])


	//-- this will be refactored out of the posts module
	.controller('PasswordCtrl', ['$scope', '$routeParams', '$location', 'SessionService',
	  function($scope, $routeParams, $location, SessionService) {

	  $scope.alerts = []

	  $scope.data = { password: '', hash: $location.search().token };

	  $scope.savePassword = function() {
	  	SessionService.changePassword($scope.data, function(result){
				$scope.alerts.push({ type: 'success', msg: `New password set` })
			}, function(e){
				$scope.alerts.push({ type: 'danger', msg: `Password change failed` })
			})
	  }

 		if ($scope.data.hash)
 		{

 		}
 		else
 		{
 			$scope.alerts.push({ type: 'danger', msg: `Password token expired` })
 		}

  }])

;
