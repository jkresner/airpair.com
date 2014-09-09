var ChatService = function($rootScope, $firebase, $firebaseSimpleLogin) {
  // firebase refs
  var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");
  var channelsRef = rootRef.child('channels');
  var notificationsRef = rootRef.child('notifications');
  var usersRef = rootRef.child('users');
  var auth = $firebaseSimpleLogin(rootRef);

  var service = {
    login: function() {
      return auth.$login('google', {rememberMe: true});
    },

    logout: function() {
      return auth.$logout();
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

  // handle common login features
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    console.log("Logged in to chat as", user);

    service.currentUser = user;
    // site presence
    user.active = true;
    usersRef.child(user.uid).set(user);
    // set user to inactive on disconnect
    usersRef.child(user.uid).child('active').onDisconnect().set(false);
  });

  $rootScope.$on("$firebaseSimpleLogin:logout", function(event, user) {
    console.log("Logged out");
    service.currentUser = null;
  });

  return service;
}

AirPair.factory('chat', ['$rootScope', '$firebase', '$firebaseSimpleLogin', ChatService]);
