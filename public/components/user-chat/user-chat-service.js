var ChatService = function($rootScope, $firebase, $firebaseSimpleLogin, $cookies) {
  // firebase refs
  var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");
  var activeChannelsRef = rootRef.child('channels/active');
  var inactiveChannelsRef = rootRef.child('channels/inactive');
  var notificationsRef = rootRef.child('notifications');
  var subscriptionsRef = rootRef.child('subscriptions');
  var activeUsersRef = rootRef.child('users/active');
  var inactiveUsersRef = rootRef.child('users/inactive');

  // todo: remove once local login not needed anymore
  var auth = null;

  // this cookie is set by middleware.js on the server side upon login
  if($cookies.FBT) {
    rootRef.auth($cookies.FBT, function(error, result) {
      if (error) {
        console.log('Login Failed!', error);
      } else {
        console.log('Authenticated successfully with payload:', result.auth);
        console.log('Auth expires at:', new Date(result.expires * 1000));
        $rootScope.$broadcast("$firebaseSimpleLogin:login", result.auth);
      }
    });
  }
  else {
    // todo: left in temporarily for testing purposes
    auth = $firebaseSimpleLogin(rootRef);
  }

  var service = {
    // initialized on login below
    activeChannel: null,
    currentUser: null,
    currentUserNotifications: null,
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
      var self = this;

      data = {
        title: title,
        active: true,
        created_at: Firebase.ServerValue.TIMESTAMP
      };

      newChannelRef = activeChannelsRef.push();
      newChannelRef.setWithPriority(data, Firebase.ServerValue.TIMESTAMP, function(err) {
        if(!err) {
          $firebase(newChannelRef).$asObject().$loaded(function(newChannel) {
            // we assume that caller will want to use the channel object right away
            // and that is why we wait on the promise to resolve before calling back
            cb(null,
               newChannel,
               $firebase(newChannelRef.child('members')).$asArray(),
               $firebase(newChannelRef.child('messages')).$asArray(),
               $firebase(notificationsRef.child(self.currentUser.uid).child(newChannel.$id)).$asArray());
          });
        }
        else {
          console.log('ERROR CREATING CHANNEL', err);
          cb(err);
        }
      });
    },

    loadChannel: function(name, cb) {
      cRef = activeChannelsRef.child(name);
      var self = this;
      $firebase(cRef).$asObject().$loaded(function(channel) {
        self.activeChannel = channel;
        self.clearNotifications();
        // we assume that caller will want to use the channel object right away
        // and that is why we wait on the promise to resolve before calling back
        cb(channel,
           $firebase(cRef.child('members')).$asArray(),
           $firebase(cRef.child('messages')).$asArray(),
           $firebase(notificationsRef.child(self.currentUser.uid).child(channel.$id)).$asArray());
      });
    },

    touch: function(channel) {
      // update priority to move it to the top of the list
      subscriptionsRef.child(this.currentUser.uid).child(channel.$id).setPriority(Firebase.ServerValue.TIMESTAMP);
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
        activeUsersRef.child(this.currentUser.uid).child('last_seen').set(Firebase.ServerValue.TIMESTAMP);
      }
    },

    notifications: function() {
      return $firebase(notificationsRef.child(this.currentUser.uid)).$asObject();
    },

    clearNotifications: function(channel) {
      if(this.currentUser && channel) {
        notificationsRef.child(this.currentUser.uid).child(channel.$id).remove();
      }
      else if(this.currentUser && this.activeChannel) {
        notificationsRef.child(this.currentUser.uid).child(this.activeChannel.$id).remove();
      }
    }
  }

  // handle common login features
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    console.log("Logged in to chat as", user);
    // keep a reference to user
    service.currentUser = user;
    service.currentUserChannels = $firebase(subscriptionsRef.child(user.uid)).$asArray();
    service.currentUserNotifications = $firebase(notificationsRef.child(user.uid)).$asArray();

    // maintain users in active or inactive state
    activeUsersRef.child(user.uid).set(user);
    inactiveUsersRef.child(user.uid).remove();
    activeUsersRef.child(user.uid).onDisconnect().remove();
    inactiveUsersRef.child(user.uid).onDisconnect().set(user);
  });

  // todo: this event is not broadcast right now, unless it gets tied into rest of app
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event, user) {
    console.log("Logged out");
    service.currentUser = null;
    service.currentUserChannels = null;
  });

  return service;
}

AirPair.factory('chat', ['$rootScope', '$firebase', '$firebaseSimpleLogin','$cookies', ChatService]);

UserHelper = {
  shrink: function(user) {
    return {
      name: user.displayName,
      picture: user.thirdPartyUserData.picture,
      uid: user.uid
    }
  }
}

