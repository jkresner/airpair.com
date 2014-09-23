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
    $scope.loadChannel = function(channel, $event) {
      console.log('loadChannel', channel);
      chat.touch(channel);
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
    chat.loadChannel($scope.$parent.channel.$id, function(channel, members, messages) {
      $scope.channel = channel;
    });

    $scope.expand = function(channel) {
      chat.touch(channel);
      $('#chat').removeClass('collapsed');
    };

    $scope.say = function(message, $event) {
      chat.say($scope.channel, message);
      $($event.currentTarget).find('input').val('').focus();
    };
  }]);

AirPair.controller('ChatSelector', ['$scope', 'chat', function($scope, chat){
  $scope.chat = chat;

  $scope.collapse = function($event) {
    $('#chat').addClass("collapsed");
    $($event.target).closest(".dropdown").removeClass('open');
    return true;
  }
}]);
