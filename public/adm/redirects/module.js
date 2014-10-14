
angular.module("ADMRedirects", ['ngRoute', 'APSvcAdmin', 'APFilters'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/redirects', {
      template: require('./list.html'),
      controller: 'RedirectsCtrl as redirects'
    });

  }])

  .controller('RedirectsCtrl', ['$scope', 'AdmDataService',
      function($scope, AdmDataService) {

    AdmDataService.getRedirects(function (result) {
      $scope.redirects = result;
    })

    $scope.createRedirect = function() {
      var d = { previous: $scope.previous, current: $scope.current }
      AdmDataService.createRedirect(d, function (result) {
        $scope.redirects.push(result);
      })
    }

    $scope.deleteRedirect = function(id) {
      AdmDataService.deleteRedirect(id, function () {
        var r = _.find($scope.redirects, (r) => r._id == id )
        $scope.redirects = _.without($scope.redirects, r)
      })
    }

  }])
