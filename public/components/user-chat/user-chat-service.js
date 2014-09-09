var ChatService = function($rootScope, $firebase, $firebaseSimpleLogin) {
  // firebase refs
  var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");
  var channelsRef = rootRef.child('channels');
  var notificationsRef = rootRef.child('notifications');
  var usersRef = rootRef.child('users');
  var auth = $firebaseSimpleLogin(rootRef);

  var service = {
    // initialized on login below
    currentUser: null,

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
          cb(null, $firebase(newChannelRef).$asObject(),
                   $firebase(newChannelRef.child('messages')).$asArray());
        }
        else {
          cb(err);
        }
      });
    },

    say: function(channel, message) {
      // create a message object
      msg = {
        from: {
          email: this.currentUser.email,
          name: this.currentUser.displayName,
          first_name: this.currentUser.thirdPartyUserData.given_name,
          picture: this.currentUser.thirdPartyUserData.picture
        },
        user_id: this.currentUser.uid,
        content: message,
        sent_at: Firebase.ServerValue.TIMESTAMP
      };

      // add it to the channel's messages object
      messages = $firebase(channelsRef.child(channel.$id).child('messages')).$asArray();
      messages.$add(msg);
    },

    subscribe: function(channel, uid) {
      channelsRef
        .child(channel.$id)
        .child("members")
        .child(uid).set(true);
    },

    users: function() {
      return $firebase(usersRef).$asArray();
    }
  }

  // handle common login features
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    console.log("Logged in to chat as", user);
    // keep a reference to user
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
