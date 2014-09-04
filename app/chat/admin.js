MAX_AGE_OF_ACTIVE_CHATS = 1000000000
MAX_AWAY_OF_ACTIVE_USER = 300000

angular.module("AirPair", ['firebase','angularMoment'])
  .run(['$rootScope', function($rootScope) {
    $rootScope._ = window._;
    $rootScope.moment = window.moment;
  }])
  .directive('airpairChatAdmin', [function() {
    return {
      restrict: 'A',
      templateUrl : 'airpairChatAdmin.html',
      controller: 'ChatAdminController'
    };
  }])
  .controller('ChatAdminController', ['$scope', '$firebase', '$firebaseSimpleLogin', function(scope, $firebase, $firebaseSimpleLogin) {
    var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");

    $firebaseSimpleLogin(rootRef).$login('google',{rememberMe: true}).then(function(user){
      scope.user = user;

      console.log("Logged in as", user);

      // load notifications
      scope.notifications = $firebase(rootRef.child('notifications').child(user.uid)).$asObject();

      // site presence
      scope.user.active = true;
      rootRef.child('users').child(scope.user.uid).set(scope.user);

      // set user to inactive on disconnect
      rootRef.child('users').child(scope.user.uid).child('active').onDisconnect().set(false);

      // load people into sidebar
      scope.users = $firebase(rootRef.child('users')).$asArray();
    });

    scope.checkAway = function(user) {
      if(user.last_seen) {
        var delta = (+new Date) - user.last_seen;
        console.log('checkAway', user.displayName, delta);
        if(delta > MAX_AWAY_OF_ACTIVE_USER) {
          return true;
        }
      }
    }

    scope.lastSeen = function() {
      if(scope.user) {
        console.log("last seen being set");
        rootRef.child('users').child(scope.user.uid).child('last_seen').set(Firebase.ServerValue.TIMESTAMP);
      }
    }

    scope.load = function(slug) {
      if(scope.user) {
        var activeChannelRef = rootRef.child('channels').child(slug);
        scope.activeChannel = $firebase(activeChannelRef).$asObject();
        scope.activeMessages = $firebase(activeChannelRef.child('messages')).$asArray();

        // channel participation
        activeChannelRef.child("members").child(scope.user.uid).set(true);
        $('#message').focus();
      }
      else {
        alert('login first');
      }
    }

    scope.create = function() {
      var slug = scope.name.replace(/\W/g, '-');
      var channel = new Firebase("https://airpair-chat.firebaseio.com/channels/" + slug);
      channel.set({
        name: scope.name,
        unread: true,
        created_at: Firebase.ServerValue.TIMESTAMP,
      }, function(err){
        if(!err) {
          scope.load(slug);
        }
      });

      scope.newChannelName = "";
    }

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

    scope.clearNotifications = function(channel, user) {
      rootRef.child("notifications").child(user.uid).child(channel.$id).remove()
    }

  }])

  // todo - is this the best way of reducing this collection? (prob not)
  .filter('activeChats', function() {
    return function(channels) {
      var out = [];
      channels.forEach(function(channel){
        if(channel.unread) {
          out.push(channel)
        }
        else {
          if(channel.messages) {
            messages.some(function(msg) {
              if(msg.hasOwnProperty('sent_at')) {
                var delta = (+new Date) - msg.sent_at
                if(delta < MAX_AGE_OF_ACTIVE_CHATS) {
                  out.push(channel);
                  return true;
                }
              }
            });
          }
        }
      });
      return out;
    }
  })

  .directive('chats', ['$firebase', function($firebase) {
    return {
      restrict: 'E',
      templateUrl : 'channels.html',
      link: function(scope, element, attributes) {
        var rootRef = new Firebase("https://airpair-chat.firebaseio.com/channels");
        scope.channels = $firebase(rootRef).$asArray();

        var updatesQuery = rootRef.endAt(null);
        //updatesQuery.on('child_added', function(newChild){ console.log(newChild)});
      }
    };
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

function fakeNgModel(initValue){
  return {
    $setViewValue: function(value) {
      this.$viewValue = value;
    },
    $viewValue: initValue
  };
}
