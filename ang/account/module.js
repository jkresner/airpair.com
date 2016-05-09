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

  // if ($location.search().verify)
  // {
  //   SessionService.verifyEmail({hash:$location.search().verify}, function(result){
  //     $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! Next step setup your <a href="/billing">Billing info</a>.` }]
  //   }, function(e){
  //     $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e}` }]
  //   })
  // }

  if ($scope.session) {
    $scope.data = _.pick($scope.session, ['name','email','initials','username'])
  }

  $rootScope.$watch('session.location', () =>{
    if ($rootScope.session.location) {
      $scope.data.location = $scope.session.location.name,
      $scope.data.timeZoneId = $scope.session.location.timeZoneId
    }
  })

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


