var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives',
  'APTagInput', 'APTypeAheadInputs'])

  .config(function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/help/request', {
      template: require('./new.html'),
      controller: 'RequestCtrl',
      resolve: authd
    });

    $routeProvider.when('/get-help/:id', {
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

  .controller('RequestCtrl', function($rootScope, $scope, SessionService) {
    angular.element('#sideNav').addClass('collapse')

    SessionService.onAuthenticated(function() {
      if (!$scope.request || !$scope.request.tags)
        $scope.request = {
          // time: 'rush',
          // hours: '1',
          // brief: "Mentoring me in JavaScript",
          // type: "Mentoring",
          // experience: 'beginner',
          tags: $rootScope.session.tags };
    })

  })

  .controller('RequestEditCtrl', function($scope, $routeParams) {
    $scope.requestId = $routeParams.id;

  })


  .controller('RequestTypesCtrl', function($scope, $window) {

    $scope.back = function() {
      $window.history.back();
    }

  })

;
