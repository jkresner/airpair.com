var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives',
  'APTagInput', 'APTypeAheadInputs'])

  .config(function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/', {
      template: require('./list.html'),
      controller: 'RequestListCtrl',
      resolve: authd
    });

    $routeProvider.when('/dashboard', {
      template: require('./list.html'),
      controller: 'RequestListCtrl',
      resolve: authd
    });


    $routeProvider.when('/help/request', {
      template: require('./new.html'),
      controller: 'RequestCtrl',
      resolve: authd
    });


    $routeProvider.when('/help/request/:id', {
      template: require('./edit.html'),
      controller: 'RequestEditCtrl',
      resolve: authd
    });

    $routeProvider.when('/help/types', {
      template: require('./types.html'),
      controller: 'RequestTypesCtrl'
    });


  })

  .run(function($rootScope, SessionService) {})


  .controller('RequestListCtrl', function($scope, $window, DataService) {

    DataService.requests.getMyRequests(function(result) {
      $scope.requests = result
    })

  })


  .controller('RequestCtrl', function($rootScope, $scope, SessionService) {

    angular.element('#side').addClass('collapse')

    SessionService.onAuthenticated(function() {
      if (!$scope.request || !$scope.request.tags)
        $scope.request = {
          // time: 'rush',
          // hours: '1',
          // brief: "Mentoring me in JavaScript",
          // type: "Mentoring",
          // experience: 'beginner',
          tags: $rootScope.session.tags
        };
    })

  })

  .controller('RequestEditCtrl', function($scope, $routeParams, DataService) {
    $scope.requestId = $routeParams.id;

    DataService.requests.getById($scope.requestId, function(result) {
      $scope.request = result
    })

  })


  .controller('RequestTypesCtrl', function($scope, $window) {

    $scope.back = function() {
      $window.history.back();
    }

  })

;
