
angular.module("ADMUsers", ['ngRoute', 'APSvcAdmin', 'APFilters','APUserInput'])

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
    $scope.selectedUser = {}

    AdmDataService.getUsersInRole({role:'admin'}, function (result) {
      $scope.admins = result;
    })

    AdmDataService.getUsersInRole({role:'editor'}, function (result) {
      $scope.editors = result;
    })

    AdmDataService.getUsersInRole({role:'pipeliner'}, function (result) {
      $scope.pipeliners = result;
    })

    $scope.toggleRole = function() {
      AdmDataService.toggleRole({_id: $scope.selectedUser._id, role: $scope.role }, function (result) {
        AdmDataService.getUsersInRole({role:$scope.role}, function (result) {
          $scope[$scope.role+'s'] = result;
        })
      })
    }

    $scope.giveCredit = function() {
      AdmDataService.giveCredit({ total: $scope.credit, toUserId: $scope.selectedUser._id, source: $scope.source },
        function (result) { alert('credit applied') },
        function (err) { alert(err.message) }
      )
    }

    // $scope.user = () => { return $scope.post.by }
    $scope.selectUser = (user) => $scope.selectedUser = user

  }])
