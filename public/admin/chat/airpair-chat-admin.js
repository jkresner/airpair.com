MAX_AGE_OF_ACTIVE_CHATS = 1000000000
MAX_AWAY_OF_ACTIVE_USER = 300000

AirPair.directive('airpairChatAdmin', [function() {
  // an overall directive so that all rendering is client-side
  return {
    restrict: 'A',
    templateUrl : 'airpair-chat-admin.html',
    controller: 'ChatAdminController'
  };
}])

AirPair.controller('ChatAdminController', ['$rootScope', '$scope', '$firebase', 'chat',
 function($rootScope, $scope, $firebase, chat) {
  // store chat service reference for UI
  $scope.chat = chat;

  // Upon successful login, set the user object
  // happens automatically when rememberMe is enabled
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    // load all channels
    $scope.channels = chat.allChannels();

    // load my notifications
    console.log('loading notifications');
    $scope.notifications = chat.notifications();

    // load people
    $scope.activeUsers = chat.activeUsers();
    $scope.inactiveUsers = chat.inactiveUsers();
  });

  $scope.addMessage = function() {
    chat.say($scope.activeChannel, $scope.message).then(function() {
      // clear the input field
      $scope.message = "";

      // ...and finally, give it focus
      $('#message').focus();
    });
  };

  $scope.checkAway = function(user) {
    if(user && user.last_seen) {
      var delta = (+new Date) - user.last_seen;
      console.log('checkAway', user.displayName, delta);
      if(delta > MAX_AWAY_OF_ACTIVE_USER) {
        return true;
      }
    }
  }

  $scope.create = function() {
    chat.createChannel(prompt("Enter title for new channel"), function(err, channel) {
      if(err) {
        console.log(err);
      }
      else {
        chat.subscribe(channel, chat.currentUser.uid);
        $scope.load(channel);
      }
    });
  }

  $scope.deactivate = function(channel) {
    chat.deactivate($scope.channels, channel);
  }

  $scope.isLoaded = function(channel) {
    return $scope.activeChannel && $scope.activeChannel.$id === channel.$id
  }

  $scope.load = function(channel) {
    if(chat.currentUser) {
      chat.loadChannel(channel.$id, function(channel, members, messages) {
        $scope.activeChannel = channel;
        $scope.activeMessages = messages;

        // channel participation
        chat.subscribe(channel, chat.currentUser.uid);
        $('#message').focus();
      });
    }
    else {
      alert('login first');
    }
  }

  $scope.talkWith = function(otherUser) {
    var myFirstName = chat.currentUser.thirdPartyUserData.given_name;
    var theirFirstName = otherUser.thirdPartyUserData.given_name;
    var title = myFirstName + " + " + theirFirstName;

    chat.createChannel(title, function(err, channel, members, messages) {
      if(err) {
        console.log(err);
      }
      else {
        $scope.load(channel);
        chat.subscribe(channel, chat.currentUser.uid);
        chat.subscribe(channel, otherUser.uid);
      }
    });
  }
}]);

function isAdmin(user) {
  return user.thirdPartyUserData.hd === 'airpair.com';
}
