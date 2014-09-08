MAX_AGE_OF_ACTIVE_CHATS = 1000000000
MAX_AWAY_OF_ACTIVE_USER = 300000

var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");
var channelsRef = rootRef.child('channels');
var notificationsRef = rootRef.child('notifications');
var usersRef = rootRef.child('users');

angular.module("AirPair", ['firebase','angularMoment'])
  .run(['$rootScope', function($rootScope) {
    // set globals we want available in ng expressions
    $rootScope._ = window._;
    $rootScope.moment = window.moment;
  }])

  .directive('airpairChatAdmin', [function() {
    // an overall directive so that all rendering is client-side
    return {
      restrict: 'A',
      templateUrl : 'airpair-chat-admin.html',
      controller: 'ChatAdminController'
    };
  }])

  .controller('ChatAdminController', ['$rootScope', '$scope', '$firebase', '$firebaseSimpleLogin', function($rootScope, $scope, $firebase, $firebaseSimpleLogin) {
    // for debugging
    window.scope = $scope;

    // Create a Firebase Simple Login object
    $scope.auth = $firebaseSimpleLogin(rootRef);

    // Start with no user logged in
    $scope.user = null;

    // Upon successful login, set the user object
    // happens automatically when rememberMe is enabled
    $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
      $scope.user = user;
      console.log("Logged in as", user);

      // load channels
      $scope.channels = $firebase(channelsRef).$asArray();

      // autosubscribe if you're an admin
      if(isAdmin(user)) {
        channelsRef.on('child_added', function(channelSnapshot) {
          channel = channelSnapshot.val();
          if(channel.active) {
            channelSnapshot.ref().child("members").child(user.uid).set(true);
          }
        });
      }

      // load notifications
      $scope.notifications = $firebase(notificationsRef.child(user.uid)).$asObject();

      // site presence
      $scope.user.active = true;
      usersRef.child($scope.user.uid).set($scope.user);

      // set user to inactive on disconnect
      usersRef.child($scope.user.uid).child('active').onDisconnect().set(false);

      // load people into sidebar
      $scope.users = $firebase(usersRef).$asArray();
    });

    // Upon successful logout, reset the user object
    $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
      $scope.user = null;
    });

    $scope.addMessage = function() {
      msg = {
        from: {
          email: $scope.user.email,
          name: $scope.user.displayName,
          first_name: $scope.user.thirdPartyUserData.given_name,
          picture: $scope.user.thirdPartyUserData.picture
        },
        user_id: $scope.user.uid,
        content: $scope.message,
        sent_at: Firebase.ServerValue.TIMESTAMP
      }

      // add the message
      $scope.activeMessages.$add(msg).then(function(){
        // make the last active channel pop to the top of the list
        channelsRef.child($scope.activeChannel.$id).setPriority(Firebase.ServerValue.TIMESTAMP);
        // clear the input field
        $scope.message = "";
        // ...and give it focus
        $('#message').focus();
      });
    }

    $scope.checkAway = function(user) {
      if(user.last_seen) {
        var delta = (+new Date) - user.last_seen;
        console.log('checkAway', user.displayName, delta);
        if(delta > MAX_AWAY_OF_ACTIVE_USER) {
          return true;
        }
      }
    }

    $scope.clearNotifications = function(channel, user) {
      if(!channel) return;
      rootRef.child("notifications").child(user.uid).child(channel.$id).remove()
    }

    $scope.create = function() {
      createChannel(prompt("Enter name for new channel"), $scope);
    }

    $scope.isLoaded = function(channel) {
      return $scope.activeChannel && $scope.activeChannel.$id === channel.$id
    }

    $scope.lastSeen = function() {
      if($scope.user) {
        console.log("last seen being set");
        usersRef.child($scope.user.uid).child('last_seen').set(Firebase.ServerValue.TIMESTAMP);
      }
    }

    $scope.load = function(slug) {
      if($scope.user) {
        var activeChannelRef = channelsRef.child(slug);
        $scope.activeChannel = $firebase(activeChannelRef).$asObject();
        $scope.activeMessages = $firebase(activeChannelRef.child('messages')).$asArray();

        // channel participation
        activeChannelRef.child("members").child($scope.user.uid).set(true);
        $scope.clearNotifications($scope.activeChannel, $scope.user);
        $('#message').focus();
      }
      else {
        alert('login first');
      }
    }

    $scope.login = function() {
      $firebaseSimpleLogin(rootRef).$login('google',{rememberMe: true});
    }

    $scope.talkWith = function(otherUser) {
      var myFirstName = $scope.user.thirdPartyUserData.given_name;
      var theirFirstName = otherUser.thirdPartyUserData.given_name;
      var name = myFirstName + " + " + theirFirstName;

      // todo: don't re-create if exists already, just load
      createChannel(name, $scope);
    }
  }])

  .directive('scrollGlue', function(){
    return {
      priority: 1,
      require: ['?ngModel'],
      restrict: 'A',
      link: function(scope, $el, attrs, ctrls){
        var el = $el[0],
            ngModel = ctrls[0] || fakeNgModel(true);

        function scrollToBottom() {
          el.scrollTop = el.scrollHeight;
        }

        function shouldActivateAutoScroll() {
          return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
        }

        scope.$watch(function() {
          if(ngModel.$viewValue){
            scrollToBottom();
          }
        });

        $el.bind('scroll', function() {
          var activate = shouldActivateAutoScroll();
          if(activate !== ngModel.$viewValue){
            scope.$apply(ngModel.$setViewValue.bind(ngModel, activate));
          }
        });
      }
    };
  })

  .filter('reverse', function() {
    function toArray(list) {
      var k, out = [];
      if( list ) {
        if( angular.isArray(list) ) {
          out = list;
        }
        else if( typeof(list) === 'object' ) {
          for (k in list) {
            if (list.hasOwnProperty(k)) { out.push(list[k]); }
          }
        }
      }
      return out;
    }
    return function(items) {
      return toArray(items).slice().reverse();
    };
  });

function createChannel(name, scope) {
  var slug = name.replace(/\W/g, '-');
  var newChannelRef = channelsRef.child(slug);

  newChannelRef.setWithPriority({
    name: name,
    active: true,
    created_at: Firebase.ServerValue.TIMESTAMP
  }, Firebase.ServerValue.TIMESTAMP, function(err){
    if(!err) {
      scope.load(slug);
    }
    else {
      console.log("unable to create channel", err);
    }
  });
}

function fakeNgModel(initValue){
  return {
    $setViewValue: function(value) {
      this.$viewValue = value;
    },
    $viewValue: initValue
  };
}

function isAdmin(user) {
  return user.thirdPartyUserData.hd === 'airpair.com';
}
