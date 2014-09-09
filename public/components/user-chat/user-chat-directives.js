AirPair.directive('airpairUserChat', [function() {
  return {
    restrict: 'E',
    templateUrl : '/components/user-chat/user-chat.html',
    controller: 'UserChatController',
    scope: {
      autocreate: '=',
      other: '=',
      temporary: '=',
    }
  };
}])

var UserChatController =
  function($rootScope, $scope, chat) {
    $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
      if($scope.autocreate) {
        chat.createChannel(user.displayName + ' ' + Number(new Date), $scope.temporary, function(err, channel) {
          if(!err) {
            window.activeChannel = $scope.activeChannel = channel;
          }
          else {
            console.log('problem auto creating channel', err);
          }
        });
      }
    });
  };

AirPair.controller('UserChatController',
  ['$rootScope', '$scope', 'chat', UserChatController]);
