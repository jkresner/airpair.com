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
    // initialize on login
    $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
      if($scope.autocreate) {
        var name = user.displayName + ' ' + Number(new Date);
        chat.createChannel(name, $scope.temporary, function(err, channel, messages) {
          if(!err) {
            $scope.activeChannel = channel;
            $scope.messages = messages;
            chat.subscribe(channel, user.uid);
            if($scope.other) {
              chat.subscribe(channel, $scope.other);
            }
          }
          else {
            console.log('problem auto creating channel', err);
          }
        });
      }
    });

    $scope.say = function(message) {
      chat.say($scope.activeChannel, message);
    };
  };

AirPair.controller('UserChatController',
  ['$rootScope', '$scope', 'chat', UserChatController]);
