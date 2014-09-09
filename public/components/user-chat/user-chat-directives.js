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
