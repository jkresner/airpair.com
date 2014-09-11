AirPair.directive('airpairUserChat', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/components/user-chat/user-chat.html'
  };
}]);

AirPair.directive('chatroom', [function() {
  return {
    controller: 'UserChatController',
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="chatroom" ng-transclude></div>'
  };
}]);

AirPair.controller('UserChatController',
  ['$scope', 'chat', function($scope, chat) {
    $scope.chat = chat;

    chat.loadChannel($scope.channelId.$id, function(channel, members, messages) {
      $scope.channel = channel;
      $scope.members = members;
      $scope.messages = messages;
    });

    $scope.say = function(message, $event) {
      chat.say($scope.channel, message);
      $($event.currentTarget).find('input').val('').focus();
    };
  }]);

AirPair.controller('ChatSelector', ['$scope', 'chat', function($scope, chat){
  $scope.chat = chat;
}]);
