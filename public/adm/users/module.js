
angular.module("ADMUsers", ['ngRoute', 'APSvcAdmin', 'APFilters'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/users', {
      template: require('./list.html'),
      controller: 'UsersCtrl as users'
    });

  }])

  .controller('UsersCtrl', ['$scope', 'AdmDataService',
      function($scope, AdmDataService) {

    $scope.role = "editor";

    AdmDataService.getUsersInRole({role:'admin'}, function (result) {
      $scope.admins = result;
    })

    AdmDataService.getUsersInRole({role:'editor'}, function (result) {
      $scope.editors = result;
    })

    $scope.toggleRole = function() {
      AdmDataService.toggleRole({_id: $scope._id,role: $scope.role }, function (result) {
        AdmDataService.getUsersInRole({role:$scope.role}, function (result) {
          $scope[$scope.role+'s'] = result;
        })
      })
    }

  }])
