var UserChatController =
  function($rootScope, $scope, chat) {
    $scope.auth = chat.login();

    // Start with no user logged in
    $scope.user = null;

    // Upon successful login, set the user object
    // happens automatically if rememberMe is enabled
    $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
      $scope.user = user;
      console.log("Logged in to user chat as", user);

      if($scope.autocreate) {
        chat.createChannel(user.displayName + ' ' + Number(new Date), $scope.temporary, function(err, channel) {
          if(!err) {
            window.activeChannel = $scope.activeChannel = channel;
          }
          else {
            console.log('problem auto creating channel', err);
          }
        });
      }
    });



  };

AirPair.controller('UserChatController',
  ['$rootScope', '$scope', 'chat', UserChatController]);
