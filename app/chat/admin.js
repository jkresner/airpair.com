MAX_AGE_OF_ACTIVE_CHATS = 1000000000

angular.module("AirPair", ['firebase'])
  .filter('activeChats', function() {
    return function(chats) {
      var out = [];
      chats.forEach(function(chatroom){
        Object.keys(chatroom).some(function(key){
          var message = chatroom[key];
          if(message && message.hasOwnProperty('sent_at')) {
            var delta = (+new Date) - message.sent_at
            if(delta < MAX_AGE_OF_ACTIVE_CHATS) {
              out.push(chatroom);
              console.log(delta);
              return true;
            }
          }
        });
      });
      return out;
    }
  })
  .directive('chats', ['$firebase', function($firebase) {
    return {
      restrict: 'E',
      templateUrl : 'chats.html',
      link: function(scope, element, attributes) {
        var root = new Firebase("https://airpair-chat.firebaseio.com/chat");
        scope.chats = $firebase(root).$asArray();
      }
    };
  }]);

