angular.module("AirPair", [])

  .run(['$rootScope', function($rootScope) {
		// $rootScope.title = 'Hello Airpair';
  }])

	.controller('UserSettingsCtrl', function($scope) {
		$scope.tags = [];
		$scope.add = function(tag) {
			$scope.tags.push({name:tag});
		}
	})

  .directive('sideNav', function() {
	  return {
		  restrict: 'E',
		  templateUrl : '/sidenav.html',
		  controller : ['$attrs', '$scope', function($attrs, $scope) {
	  		$scope.mytags = $scope.$eval($attrs.tags);
	  	}]
	  };
	});
