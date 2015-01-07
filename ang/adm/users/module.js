angular.module("ADMUsers", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/v1/adm/users', 'Users', require('./list.html'))
  route('/v1/adm/users/:id', 'User', require('./item.html'))

})

.controller('UsersCtrl', function($scope, AdmDataService) {

  $scope.role = "editor";
  $scope.selectedUser = {}

  AdmDataService.users.getInRole({role:'admin'}, (result) =>
    $scope.admins = result)

  AdmDataService.users.getInRole({role:'editor'}, (result) =>
    $scope.editors = result)

  AdmDataService.users.getInRole({role:'pipeliner'}, (result) =>
    $scope.pipeliners = result)

  $scope.toggleRole = function() {
    AdmDataService.users.toggleRole({_id: $scope.selectedUser._id, role: $scope.role }, function (result) {
      AdmDataService.users.getInRole({role:$scope.role}, function (result) {
        $scope[$scope.role+'s'] = result;
      })
    })
  }

  $scope.giveCredit = function() {
    AdmDataService.bookings.giveCredit({ total: $scope.credit, toUser: $scope.selectedUser, source: $scope.source },
      function (result) { alert(`${$scope.credit} credit applied and emailed to ${$scope.selectedUser.email}`) }
    )
  }

  // $scope.user = () => { return $scope.post.by }
  $scope.selectUser = (user) => $scope.selectedUser = user

})


.controller('UserCtrl', function($scope, AdmDataService) {


})
