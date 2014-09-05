angular.module("APWorkshops", ['ngRoute'])

	.constant('API', '/api')

  .run(['$rootScope', function($rootScope) {
		// $rootScope.title = 'Hello Airpair';
  }])

	.controller('WorkshopsCtrl', ['$scope', '$http', 'API', function($scope, $http, API) {
		var self = this;
		var upcomingStart = moment(new Date());
		var upcomingEnd = moment(new Date()).add('days', 14);
		$http.get(API+'/workshops').success(function (data) {
			self.entries = data;
			self.upcoming = _.where(data,function(w) { 
				return moment(w.time).isAfter(upcomingStart) && 
							 moment(w.time).isBefore(upcomingEnd);
			});
		});
	}])

	.controller('WorkshopCtrl', ['$scope', '$http', '$routeParams', 'API', function($scope, $http, $routeParams, API) {	
		$http.get(API+'/workshops/'+$routeParams.id).success(function (data) {
			$scope.entry = data;
		});
	}])

	.config(['$locationProvider', '$routeProvider', 
			function($locationProvider, $routeProvider) {
		
		$locationProvider.html5Mode(true);

		$routeProvider.when('/workshops', {
			templateUrl: '/workshops/list.html',
			controller: 'WorkshopsCtrl as workshops'
		});

		$routeProvider.when('/workshops/:id', {
			templateUrl: '/workshops/show.html',
			controller: 'WorkshopCtrl as workshop'
		});

	}])

;