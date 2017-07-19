angular.module("APAccount", [])

.config((apRouteProvider) => {

  var authd = apRouteProvider.resolver(['session']);
  var route = apRouteProvider.route
  route('/login', 'Login', require('./login.html'))
  route('/account', 'Account', require('./account.html'),{resolve: authd})
  // route('/me/password', 'Password', require('./password.html'))
  // route('/password-reset', 'PasswordResetCtrl', require('./passwordreset.html'))
})


.controller('LoginCtrl', function($rootScope, $scope, $window, $timeout, $location, SessionService) {
  var self = this;

  $scope.returnTo = $location.search().returnTo;
  $scope.data = {};

  if ($location.search().as)
    $scope.data.email = $location.search().as

  this.submit = function(isValid, formData) {
    if (!isValid) return
    SessionService.login(formData,
      (result) => {
       // $window.location = '',
        $timeout(() => { window.location = $scope.returnTo || '/'}, 250)
      },
      (e) => {
        $scope.loginFail = e.message || e
      }
    )
  }
})


.controller('AccountCtrl', function($rootScope, $scope, $location, ServerErrors, SessionService) {

  SessionService.getAccount(function(user) {
    // console.log('user', user)

  // if ($location.search().verify)
  // {
  //   SessionService.verifyEmail({hash:$location.search().verify}, function(result){
  //     $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! Next step setup your <a href="/billing">Billing info</a>.` }]
  //   }, function(e){
  //     $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e}` }]
  //   })
  // }

    var updateInfo = targetName => function() {
      $scope.profileAlerts = []
      var propName = targetName.toLowerCase()
      if ($scope.data[propName]
        && $scope.data[propName] != ''
        && $scope.session[propName] != $scope.data[propName])
      {
        var up = {}
        up[propName] = $scope.data[propName]
        SessionService[`update${targetName}`](up, function(r) {
          $rootScope.session = _.pick(r, 'name','email','initials','username', 'avatar')
          if (r.location) {
            $scope.data.location = r.location.name
            $scope.data.timeZoneId = r.location.timeZoneId
          }
          $scope.profileAlerts.push({ type: 'success', msg: `${targetName} updated` })
        }, function(e){
          $scope.data.username = $rootScope.session.username
          $scope.profileAlerts.push({ type: 'danger', msg: e.message })
        })
      }

      if (!$scope.data.username && $scope.session.auth) {
        var social = $scope.session.auth
        if (social.gh && social.gh.login || social.gh.username)
        {
          var username = social.gh.login || social.gh.username
          SessionService.updateUsername({username}, function(result){
            $scope.data.username = username
          }, function(e){})
        }
      }
    }

    $scope.data = _.pick(user, 'name','email','initials','username','avatar')
      // console.log('watching the change....', $rootScope.session.location)

    if (user.location)
    {
      $scope.data.location = user.location.name
      $scope.data.timeZoneId = user.location.timeZoneId
    }


    $scope.updateName = updateInfo('Name')
    $scope.updateInitials = updateInfo('Initials')
    $scope.updateUsername = updateInfo('Username')
    $scope.updateLocation = (locationData) => {
      SessionService.changeLocationTimezone(locationData, (r) => {
        // $scope.data.location = r.location.name
        $scope.data.timezone = r.location.timeZoneId
      }, (e)=> {})
    }


  // $scope.updateEmail = function(model) {
  //   if (!model.$valid || $scope.data.email == $scope.session.email) return
  //   $scope.emailChangeFailed = ""

  //   SessionService.changeEmail({ email: $scope.data.email },
  //     (result) => {
  //       $scope.data.email = result.email
  //     }
  //     ,
  //     (e) => {
  //       $scope.emailChangeFailed = e.message
  //       $scope.data.email = null
  //     }
  //   )
  // }

  // $scope.sendVerificationEmail = function() {
  //   SessionService.changeEmail({email:$scope.session.email}, function(result){
  //     $scope.emailAlerts = [{ type: 'success', msg: `Verification email sent to ${$scope.session.email}` }]
  //   }, function(e){
  //     console.log('sendVerificationEmail.back', e, e.message)
  //     $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e} failed` }]
  //   })
  // };

  // $scope.sendPasswordChange = function() {
  //   SessionService.requestPasswordChange({email:$scope.session.email}, function(result){
  //     $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${$scope.session.email}` }]
  //   }, ServerErrors.add)
  // }

  }, () => {})
})


// .controller('PasswordCtrl', function($scope, $location, ServerErrors, SessionService) {

//   $scope.alerts = []

//   $scope.data = { password: '', hash: $location.search().token, email: $location.search().email };

//   $scope.savePassword = function() {
//     SessionService.changePassword($scope.data, function(result){
//       var msg = `New password set`
//       if (!$scope.session._id) msg = `New password set. Return to <a href="/login">Login</a>`

//       $scope.alerts = [{ type: 'success', msg }]
//       $scope.done = true

//     }, ServerErrors.add)
//   }

//   if (!$scope.data.hash)
//     $scope.alerts.push({ type: 'danger', msg: `Password token expired` })

// })

  // .controller('PasswordResetCtrl', function($scope, ServerErrors, SessionService) {

  //   SessionService.onAuthenticated(() => { if ($scope.session._id) $location.path('/')})

  //   $scope.data = { email: "" }

  //   var self = this;
  //   self.submitReset = function(isValid, formData) {
  //     if (!isValid) return
  //     SessionService.requestPasswordChange(formData, function(result){
  //       $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${result.email}` }]
  //     }, ServerErrors.add)
  //   };
  // })

angular.module("APProfileDirectives", [])


.directive('socialLinks', function() {

  return {
    template: require('./socialLinks.html'),
    scope: { p: '=profile' },
    link(scope, element, attrs) { },
    controller($scope, $attrs) {
      $scope.$watch('p', ()=>{
        if (!$scope.p) return
        if ($scope.p.so)
          $scope.p.so.link =
            $scope.p.so.link.replace('http://stackoverflow.com/users/','')
      })
    }
  };

})


.directive('socialScores', function() {

  return {
    template: require('./socialScores.html'),
    scope: { p: '=profile' },
    link(scope, element, attrs) { },
    controller($scope, $attrs) {
    }
  };

})


.directive('socialConnect', function($rootScope, $location) {

  return {
    template: require('./socialConnect.html'),
    scope: {
      returnTo: '=returnTo',
    },
    controller($scope, $attrs) {
      $scope.data = {}
      $scope.return = $scope.returnTo || $location.path()

      $rootScope.$watch('session', (session) => {
        if (session.auth) {
          if (session.auth.gh) $scope.data.gh = session.auth.gh.login
          if (session.auth.tw) $scope.data.tw = session.auth.tw.screen_name
          if (session.auth.so) $scope.data.so = session.auth.so.link
          if (session.auth.in) $scope.data.in = session.auth.in.id
          if (session.auth.bb) $scope.data.bb = session.auth.bb.username
          if (session.auth.gp) $scope.data.gp =
            session.auth.gp.link || session.auth.gp.url || session.auth.gp.id
          if (session.auth.al) $scope.data.al =
            session.auth.al.username || session.auth.al.angellist_url
        }
      })

    }
  };

})


