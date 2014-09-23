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
    activeChannel: null,
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

    createChannel: function(title, cb) {
      data = {
        title: title,
        active: true,
        created_at: Firebase.ServerValue.TIMESTAMP
      };

      newChannelRef = activeChannelsRef.push();
      newChannelRef.setWithPriority(data, Firebase.ServerValue.TIMESTAMP, function(err){
        if(!err) {
          $firebase(newChannelRef).$asObject().$loaded(function(newChannel) {
            // we assume that caller will want to use the channel object right away
            // and that is why we wait on the promise to resolve before calling back
            cb(null,
               newChannel,
               $firebase(newChannelRef.child('members')).$asArray(),
               $firebase(newChannelRef.child('messages')).$asArray());
          });
        }
        else {
          console.log('ERROR CREATING CHANNEL', err);
          cb(err);
        }
      });
    },

    loadChannel: function(name, cb) {
      console.log('loading channel', name);
      cRef = activeChannelsRef.child(name);
      var self = this;
      $firebase(cRef).$asObject().$loaded(function(channel) {
        console.log('setting activeChannel to', channel);
        self.activeChannel = channel;
        self.clearNotifications();
        // we assume that caller will want to use the channel object right away
        // and that is why we wait on the promise to resolve before calling back
        cb(channel,
           $firebase(cRef.child('members')).$asArray(),
           $firebase(cRef.child('messages')).$asArray());
      });
    },

    touch: function(channelId) {
      subscriptionsRef.child(this.currentUser.uid).child(channelId).setPriority(Firebase.ServerValue.TIMESTAMP);
    },

    deactivate: function(list, channel) {
      channel.active = false;
      list.$save(channel);
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

      // clear red notification icons in case they were not already
      this.clearNotifications();

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
          .child(channel.$id).setWithPriority({title: channel.title}, Firebase.ServerValue.TIMESTAMP);
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

        if(this.activeChannel) {
          this.clearNotifications();
        }
      }
    },

    notifications: function() {
      var n = $firebase(notificationsRef.child(this.currentUser.uid)).$asObject();
      n.$loaded(function(notifications){
        console.log(notifications);
      });
      return n;
    },

    clearNotifications: function() {
      if(this.currentUser && this.activeChannel) {
        rootRef.child("notifications").child(this.currentUser.uid).child(this.activeChannel.$id).remove();
      }
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
    service.currentUserChannels = null;
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

