AirPair.directive('airpairUserChat', [function() {
  return {
    controller: 'UserChatController',
    restrict: 'E',
    replace: true,
    templateUrl: '/components/user-chat/user-chat.html'
  };
}]);

AirPair.controller('UserChatController',
  ['$scope', 'chat', function($scope, chat) {
    $scope.loadChannel = function(id, $event) {
      chat.touch(id);
      if($event) {
        // todo: why isn't the dropdown function present?
        //$($event.target).closest(".dropdown").dropdown('toggle');
        // workaround: remove the open class to get it to close
        $($event.target).closest(".dropdown").removeClass('open');
      }
    };
  }]);

AirPair.directive('chatroom', [function() {
  return {
    controller: 'ChatroomController',
    restrict: 'E',
    replace: true,
    templateUrl: '/components/user-chat/chatroom.html',
    scope: {
      channel: '@',
      members: '@',
      messages: '@'
    }
  };
}]);

AirPair.controller('ChatroomController',
  ['$scope', 'chat', function($scope, chat) {
    $scope.chat = chat;
    chat.loadChannel($scope.$parent.channelId.$id, function(channel, members, messages) {
      $scope.channel = channel;
    });

    $scope.expand = function() {
      chat.touch(this.channel.$id);
      $('#chat').removeClass('collapsed');
    };

    $scope.say = function(message, $event) {
      chat.say($scope.channel, message);
      $($event.currentTarget).find('input').val('').focus();
    };

  }]);

AirPair.controller('ChatSelector', ['$scope', 'chat', function($scope, chat){
  $scope.chat = chat;

  $scope.collapse = function() {
    $('#chat').addClass("collapsed");
  }
}]);
