var resolver = require('./../common/routes/helpers.js').resolveHelper;
require('./directives.js');

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

  .controller('RequestCtrl', function($scope, SessionService) {
    $scope.data = {}

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
