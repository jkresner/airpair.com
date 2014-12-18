
angular.module("ADMPipeline", ["APRequestDirectives"])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/pipeline', {
      template: require('./list.html'),
      controller: 'PipelineCtrl'
    });

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
        $scope.paymethods = (pms.btoken) ? [] : pms;
      })
      AdmDataService.getUsersViews({_id:r.userId}, function (views) {
        $scope.views = views
      })
    })

  })


  .controller('PipelineCtrl', function($scope, AdmDataService) {
    console.log('PipelineCtrl')
    $scope.request = {}

    AdmDataService.pipeline.getActive((r) => $scope.active = r)
    AdmDataService.pipeline.getIncomplete((r) => $scope.incomplete = r)


  })
