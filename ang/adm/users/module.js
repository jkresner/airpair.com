angular.module("ADMUsers", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/users', 'Users', require('./list.html'))

})

.controller('UsersCtrl', function($scope, AdmDataService) {

  $scope.selectedUser = {}

  $scope.giveCredit = function(total, source) {
    AdmDataService.bookings.giveCredit({ total, source, toUser: $scope.selectedUser },
      function (result) { alert(`${total} credit applied and emailed to ${$scope.selectedUser.email}`) }
    )
  }

  $scope.selectUser = (user) => $scope.selectedUser = user
})


.directive('slackStatus', (AdmDataService) => {
  return {
    template: require('./slackStatus.html'),
    scope: {
      chat: '=member',
      userId: '=userid'
    },
    controller($scope, $element, $attrs) {
      console.log('slackStatus', $scope.chat)
      $scope.inviteToTeam = () =>
        AdmDataService.chats.inviteToTeam({_id:$scope.userId}, (r)=>
          $scope.invitedToSlackTeam = true
        )
    }
  }
})
