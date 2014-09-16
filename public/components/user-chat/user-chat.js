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
      chat.loadChannel(id, function(channel, members, messages) {
        $scope.channel = channel;
        $scope.members = members;
        $scope.messages = messages;
      });
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
    transclude: true,
    replace: true,
    template: '<div class="chatroom" ng-transclude></div>'
  };
}]);

AirPair.controller('ChatroomController',
  ['$scope', 'chat', function($scope, chat) {
    $scope.chat = chat;
    $scope.loadChannel($scope.channelId.$id);

    $scope.expand = function() {
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
