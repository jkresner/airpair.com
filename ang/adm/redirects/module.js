
angular.module("ADMRedirects", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/adm/redirects', {
      template: require('./list.html'),
      controller: 'RedirectsCtrl as redirects'
    });

  })

  .controller('RedirectsCtrl', function($scope, AdmDataService) {

    AdmDataService.getRedirects(function (result) {
      $scope.redirects = result;
    })

    $scope.createRedirect = function() {
      var d = { previous: $scope.previous, current: $scope.current, type: $scope.type }
      AdmDataService.createRedirect(d, function (result) {

        $scope.redirects = _.union([result],$scope.redirects)
      })
    }

    $scope.deleteRedirect = function(id) {
      AdmDataService.deleteRedirect(id, function () {
        var r = _.find($scope.redirects, (r) => r._id == id )
        $scope.redirects = _.without($scope.redirects, r)
      })
    }

  })
