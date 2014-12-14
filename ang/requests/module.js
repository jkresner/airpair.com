var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives',
  'APTagInput', 'APTypeAheadInputs'])

  .config(function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/', {
      template: require('./list.html'),
      controller: 'RequestListCtrl',
    });

    $routeProvider.when('/dashboard', {
      template: require('./list.html'),
      controller: 'RequestListCtrl',
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


  .controller('RequestListCtrl', function($scope, $location, DataService, SessionService) {

    SessionService.onAuthenticated(function() {
      if (!$scope.session._id) $location.path(`/about`)
    })

    DataService.requests.getMyRequests(function(result) {
      $scope.requests = result
    })

  })


  .controller('RequestCtrl', function($rootScope, $scope, SessionService) {

    angular.element('#side').addClass('collapse')

    SessionService.onAuthenticated(function() {
      if (!$scope.request || !$scope.request.tags)
        $scope.request = { tags: _.first($rootScope.session.tags,3) };
    })

  })

  .controller('RequestEditCtrl', function($scope, $routeParams, $location, DataService) {
    $scope.requestId = $routeParams.id;

    DataService.requests.getById($scope.requestId, function(result) {
      if (result.userId != $scope.session._id) $location.path('/dashboard')
      else $scope.request = result
    }, function(er) {
      $location.path('/help/request')
    })

  })


  .controller('RequestTypesCtrl', function($scope, $window) {

    $scope.back = function() {
      $window.history.back();
    }

  })

;
