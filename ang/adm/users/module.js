angular.module("ADMUsers", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/users', 'Users', require('./list.html'))
  route('/adm/users/:id', 'User', require('./item.html'))

})

.controller('UsersCtrl', function($scope, AdmDataService) {

  $scope.selectedUser = {}

  AdmDataService.users.getInRole({role:'admin'}, (result) =>
    $scope.admins = result)

  AdmDataService.users.getInRole({role:'editor'}, (result) =>
    $scope.editors = result)

  AdmDataService.users.getInRole({role:'pipeliner'}, (result) =>
    $scope.pipeliners = result)

  AdmDataService.users.getInRole({role:'spinner'}, (result) =>
    $scope.spinners = result)

  AdmDataService.users.getInRole({role:'reviewer'}, (result) =>
    $scope.reviewers = result)


  $scope.toggleRole = function(_id, role) {
    AdmDataService.users.toggleRole({_id,role}, function (r) {
      AdmDataService.users.getInRole({role}, function (result) {
        $scope[role+'s'] = result;
      })
    })
  }

  $scope.giveCredit = function(total, source) {
    AdmDataService.bookings.giveCredit({ total, source, toUser: $scope.selectedUser },
      function (result) { alert(`${total} credit applied and emailed to ${$scope.selectedUser.email}`) }
    )
  }

  $scope.selectUser = (user) => $scope.selectedUser = user
})


.controller('UserCtrl', function($scope, AdmDataService) {


})
