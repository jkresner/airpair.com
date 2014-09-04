MAX_AGE_OF_ACTIVE_CHATS = 1000000000

function fakeNgModel(initValue){
  return {
    $setViewValue: function(value) {
      this.$viewValue = value;
    },
    $viewValue: initValue
  };
}

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
    // todo: remove.. for debugging
    window.scope = scope;

    var rootRef = new Firebase("https://airpair-chat.firebaseio.com/");

    // todo: change to google
    $firebaseSimpleLogin(rootRef).$login('google',{rememberMe: true}).then(function(user){
      scope.user = user;

      console.log(user);

      // load notifications
      scope.notifications = $firebase(rootRef.child('notifications').child(user.uid)).$asObject();
    });

    scope.load = function(slug) {
      if(scope.user) {
        var activeChannelRef = rootRef.child('channels').child(slug);
        scope.activeChannel = $firebase(activeChannelRef).$asObject();
        scope.activeMessages = $firebase(activeChannelRef.child('messages')).$asArray();

        // presence
        activeChannelRef.child("members").child(scope.user.uid).set(true);
        // cool stuff - onDisconnect logs stuff to do on the server side
        activeChannelRef.child("members").child(scope.user.uid).onDisconnect().remove()

        // clear notifications for this channel
        rootRef.child("notifications").child(scope.user.uid).child(scope.activeChannel.$id).remove()
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
