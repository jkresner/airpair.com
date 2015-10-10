angular.module("ADMChat", [])

.directive('slackStatus', (AdmDataService) => {
  return {
    template: require('./slackStatus.html'),
    scope: {
      chat: '=member',
      userId: '=userid'
    },
    controller($scope, $element, $attrs) {
      $scope.inviteToTeam = () =>
        AdmDataService.chats.inviteToTeam({_id:$scope.userId}, (r)=>
          $scope.invitedToSlackTeam = true
        )
    }
  }
})
