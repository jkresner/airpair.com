var ChatService = function($rootScope, $firebase, $firebaseSimpleLogin) {
  // firebase refs
  var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");
  var channelsRef = rootRef.child('channels');
  var notificationsRef = rootRef.child('notifications');
  var usersRef = rootRef.child('users');

  return {
    login: function() {
      // handle common login features
      $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
        // site presence
        $scope.user.active = true;
        usersRef.child($scope.user.uid).set($scope.user);
        // set user to inactive on disconnect
        usersRef.child($scope.user.uid).child('active').onDisconnect().set(false);
      });

      return $firebaseSimpleLogin(rootRef);
    },

    channels: function() {
      return $firebase(channelsRef).$asArray();
    },

    createChannel: function(name, isTemporary, cb) {
      var slug = name.replace(/\W/g, '-');
      var newChannelRef = channelsRef.child(slug);

      newChannelRef.setWithPriority({
        name: name,
        active: true,
        created_at: Firebase.ServerValue.TIMESTAMP
      }, Firebase.ServerValue.TIMESTAMP, function(err){
        if(!err) {
          if(isTemporary) {
            newChannelRef.onDisconnect().remove();
          }
          cb(null, $firebase(newChannelRef).$asObject());
        }
        else {
          cb(err);
        }
      });
    },

    users: function() {
      return $firebase(usersRef).$asArray();
    }
  }
}

AirPair.factory('chat', ['$rootScope', '$firebase', '$firebaseSimpleLogin', ChatService]);
