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
      templateUrl : 'airpairChatAdmin.html',
      controller: 'ChatAdminController'
    };
  }])

  .controller('ChatAdminController', ['$scope', '$firebase', '$firebaseSimpleLogin', function(scope, $firebase, $firebaseSimpleLogin) {

    scope.addMessage = function() {
      msg = {
        from: {
          email: scope.user.email,
          name: scope.user.displayName,
          first_name: scope.user.thirdPartyUserData.given_name,
          picture: scope.user.thirdPartyUserData.picture
        },
        user_id: scope.user.uid,
        content: scope.message,
        sent_at: Firebase.ServerValue.TIMESTAMP
      }
      scope.activeMessages.$add(msg);
      scope.message = "";
      $('#message').focus();
    }

    scope.checkAway = function(user) {
      if(user.last_seen) {
        var delta = (+new Date) - user.last_seen;
        console.log('checkAway', user.displayName, delta);
        if(delta > MAX_AWAY_OF_ACTIVE_USER) {
          return true;
        }
      }
    }

    scope.clearNotifications = function(channel, user) {
      rootRef.child("notifications").child(user.uid).child(channel.$id).remove()
    }

    scope.create = function() {
      createChannel(scope.name, scope);
      scope.newChannelName = "";
    }

    scope.lastSeen = function() {
      if(scope.user) {
        console.log("last seen being set");
        usersRef.child(scope.user.uid).child('last_seen').set(Firebase.ServerValue.TIMESTAMP);
      }
    }

    scope.load = function(slug) {
      if(scope.user) {
        var activeChannelRef = channelsRef.child(slug);
        scope.activeChannel = $firebase(activeChannelRef).$asObject();
        scope.activeMessages = $firebase(activeChannelRef.child('messages')).$asArray();

        // channel participation
        activeChannelRef.child("members").child(scope.user.uid).set(true);
        scope.clearNotifications(scope.activeChannel, scope.user);
        $('#message').focus();
      }
      else {
        alert('login first');
      }
    }

    scope.login = function() {
      $firebaseSimpleLogin(rootRef).$login('google',{rememberMe: true}).then(function(user){
        scope.user = user;
        console.log("Logged in as", user);

        // load channels
        scope.channels = $firebase(channelsRef).$asArray();

        // load notifications
        scope.notifications = $firebase(notificationsRef.child(user.uid)).$asObject();

        // site presence
        scope.user.active = true;
        usersRef.child(scope.user.uid).set(scope.user);

        // set user to inactive on disconnect
        usersRef.child(scope.user.uid).child('active').onDisconnect().set(false);

        // load people into sidebar
        scope.users = $firebase(usersRef).$asArray();
      });
    }

    scope.talkWith = function(otherUser) {
      var myFirstName = scope.user.thirdPartyUserData.given_name;
      var theirFirstName = otherUser.thirdPartyUserData.given_name;
      var name = myFirstName + " + " + theirFirstName;

      // todo: don't re-create if exists already, just load
      createChannel(name, scope);
    }

    // try triggering a login (auto-popup doesn't work on all browsers)
    scope.login();

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
  });

function createChannel(name, scope) {
  var slug = name.replace(/\W/g, '-');
  var newChannelRef = channelsRef.child(slug);

  newChannelRef.set({
    name: name,
    active: true,
    created_at: Firebase.ServerValue.TIMESTAMP
  }, function(err){
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
