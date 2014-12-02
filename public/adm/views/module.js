
angular.module("ADMViews", ['ngRoute', 'APSvcAdmin', 'APFilters','APUserInput'])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/views', {
      template: require('./list.html'),
      controller: 'ViewsCtrl as views'
    });

  })

  .controller('ViewsCtrl', function($scope, ServerErrors, AdmDataService) {

    $scope.selectedUser = {}

    // $scope.user = () => { return $scope.post.by }
    $scope.selectUser = (user) => {
      $scope.selectedUser = user
      AdmDataService.getUsersViews($scope.selectedUser, function (result) {
        console.log('v1', result[0].utc)
        $scope.views = result.reverse();
      },
      ServerErrors.add)
    }

  })
