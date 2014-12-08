
angular.module("ADMOrders", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/orders', {
      template: require('./list.html'),
      controller: 'OrdersCtrl as orders'
    });

  })

  .controller('OrdersCtrl', function($scope, AdmDataService) {

    $scope.selectedUser = {}
    $scope.query = { start: moment().add(-30,'day'), end: moment() }

    AdmDataService.getOrders($scope.query, function (result) {
      $scope.orders = result;
    })

    // $scope.user = () => { return $scope.post.by }
    $scope.selectUser = (user) => {
      $scope.selectedUser = user
      // AdmDataService.getUsersViews($scope.selectedUser, function (result) {
      //   $scope.views = result;
      // })
    }

  })
