
angular.module("ADMPipeline", ["APRequestDirectives"])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/request/:id', {
      template: require('./item.html'),
      controller: 'RequestCtrl'
    });

  })

  .controller('RequestCtrl', function($scope, $routeParams, AdmDataService) {

    $scope.request = {}

    AdmDataService.pipeline.getRequest($routeParams.id, function (r) {
      $scope.request = r;
      AdmDataService.billing.getUserPaymethods(r.userId, function (pms) {
        $scope.paymethods = pms;
      })
    })

  })
