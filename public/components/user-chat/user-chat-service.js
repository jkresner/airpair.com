var ChatService = function($rootScope, $firebase, $firebaseSimpleLogin) {
  // firebase refs
  var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");
  var activeChannelsRef = rootRef.child('channels/active');
  var inactiveChannelsRef = rootRef.child('channels/inactive');
  var notificationsRef = rootRef.child('notifications');
  var subscriptionsRef = rootRef.child('subscriptions');
  var activeUsersRef = rootRef.child('users/active');
  var inactiveUsersRef = rootRef.child('users/inactive');

  // results in login if user is already authenticated
  var auth = $firebaseSimpleLogin(rootRef);

  var service = {
    // initialized on login below
    currentUser: null,
    currentUserChannels: null,

    login: function() {
      return auth.$login('google', {rememberMe: true});
    },

    logout: function() {
      return auth.$logout();
    },

    allChannels: function() {
      return $firebase(activeChannelsRef).$asArray();
    },

    getChannel: function(id) {
      return $firebase(activeChannelsRef.child(id)).$asObject();
    },

    createChannel: function(name, cb) {
      data = {
        name: name,
        active: true,
        created_at: Firebase.ServerValue.TIMESTAMP
      };

      newChannelRef = activeChannelsRef.push();
      newChannelRef.setWithPriority(data, Firebase.ServerValue.TIMESTAMP, function(err){
        if(!err) {
          cb(null, $firebase(newChannelRef).$asObject(),
                   $firebase(newChannelRef.child('members')).$asArray(),
                   $firebase(newChannelRef.child('messages')).$asArray());
        }
        else {
          cb(err);
        }
      });
    },

    loadChannel: function(name, cb) {
      cRef = activeChannelsRef.child(name);
      cb($firebase(cRef).$asObject(),
         $firebase(cRef.child('members')).$asArray(),
         $firebase(cRef.child('messages')).$asArray());
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

      cRef = activeChannelsRef.child(channel.$id);

      // add it to the channel's messages object
      messages = $firebase(cRef.child('messages')).$asArray();

      // make the last active channel pop to the top of the admin list
      cRef.setPriority(Firebase.ServerValue.TIMESTAMP);

      // return the promise so that caller can do stuff then()
      return messages.$add(msg);
    },

    subscribe: function(channel, uid) {
      activeUsersRef.child(uid).once('value', function(u) {
        activeChannelsRef
          .child(channel.$id)
          .child("members")
          .child(uid).set(UserHelper.shrink(u.val()));
        subscriptionsRef
          .child(uid)
          .child(channel.$id).set(channel.$id);
      });
    },

    unsubscribe: function(channel, uid) {
      activeChannelsRef.child(channel.$id).child("members").child(uid).remove();
      return subscriptionsRef.child(uid).child(channel.$id).remove();
    },

    activeUsers: function() {
      return $firebase(activeUsersRef).$asArray();
    },

    inactiveUsers: function() {
      return $firebase(inactiveUsersRef).$asArray();
    },

    spy: function() {
      if(this.currentUser) {
        console.log('updating last_seen');
        activeUsersRef.child(this.currentUser.uid).child('last_seen').set(Firebase.ServerValue.TIMESTAMP);
      }
    },

    notifications: function() {
      $firebase(notificationsRef.child(this.currentUser.uid)).$asObject();
    },

    clearNotifications: function(channel, user) {
      return rootRef.child("notifications").child(user.uid).child(channel.$id).remove();
    }
  }

  // handle common login features
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    console.log("Logged in to chat as", user);
    // keep a reference to user
    service.currentUser = user;
    service.currentUserChannels = $firebase(subscriptionsRef.child(user.uid)).$asArray();

    // maintain users in active or inactive state
    activeUsersRef.child(user.uid).set(user);
    inactiveUsersRef.child(user.uid).remove();
    activeUsersRef.child(user.uid).onDisconnect().remove();
    inactiveUsersRef.child(user.uid).onDisconnect().set(user);
  });

  $rootScope.$on("$firebaseSimpleLogin:logout", function(event, user) {
    console.log("Logged out");
    service.currentUser = null;
  });

  return service;
}

AirPair.factory('chat', ['$rootScope', '$firebase', '$firebaseSimpleLogin', ChatService]);

UserHelper = {
  shrink: function(user) {
    return {
      name: user.displayName,
      picture: user.thirdPartyUserData.picture,
      uid: user.uid
    }
  }
}

