
angular.module("ADMUsers", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/users', {
      template: require('./list.html'),
      controller: 'UsersCtrl as users'
    });

  })

  .controller('UsersCtrl', function($scope, AdmDataService) {

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
      AdmDataService.bookings.giveCredit({ total: $scope.credit, toUser: $scope.selectedUser, source: $scope.source },
        function (result) { alert(`${$scope.credit} credit applied and emailed to ${$scope.selectedUser.email}`) },
        function (err) { alert(err) }
      )
    }

    // $scope.user = () => { return $scope.post.by }
    $scope.selectUser = (user) => $scope.selectedUser = user

  })
