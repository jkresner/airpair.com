angular.module("APProfile", [])

.config((apRouteProvider) => {

  var authd = apRouteProvider.resolver(['session']);
  var route = apRouteProvider.route
  route('/me/password', 'Password', require('./password.html'))
  route('/me', 'Account', require('./account.html'),{resolve: authd})
})


.controller('AccountCtrl', function($rootScope, $scope, $location, ServerErrors, SessionService) {

  if ($location.search().verify)
  {
    SessionService.verifyEmail({hash:$location.search().verify}, function(result){
      $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! Next step setup your <a href="/billing">Billing info</a>.` }]
    }, function(e){
      $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e}` }]
    })
  }

  if ($scope.session)
    $scope.data = _.pick($scope.session, 'name','email','initials','username')

  $scope.updateEmail = function(model) {
    if (!model.$valid || $scope.data.email == $scope.session.email) return
    $scope.emailChangeFailed = ""

    SessionService.changeEmail({ email: $scope.data.email },
      (result) => {
        $scope.data.email = result.email
      }
      ,
      (e) => {
        $scope.emailChangeFailed = e.message
        $scope.data.email = null
      }
    )
  }

  $scope.sendVerificationEmail = function() {
    SessionService.changeEmail({email:$scope.session.email}, function(result){
      $scope.emailAlerts = [{ type: 'success', msg: `Verification email sent to ${$scope.session.email}` }]
    }, function(e){
      console.log('sendVerificationEmail.back', e, e.message)
      $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e} failed` }]
    })
  };

  $scope.sendPasswordChange = function() {
    SessionService.requestPasswordChange({email:$scope.session.email}, function(result){
      $scope.passwordAlerts = [{ type: 'success', msg: `Password reset sent to ${$scope.session.email}` }]
    }, ServerErrors.add)
  }

})


.controller('PasswordCtrl', function($scope, $location, ServerErrors, SessionService) {

  $scope.alerts = []

  $scope.data = { password: '', hash: $location.search().token };

  $scope.savePassword = function() {
    SessionService.changePassword($scope.data, function(result){
      var msg = `New password set`
      if (!$scope.session._id) msg = `New password set. Return to <a href="/login">Login</a>`

      $scope.alerts = [{ type: 'success', msg }]
      $scope.done = true

    }, ServerErrors.add)
  }

  if (!$scope.data.hash)
    $scope.alerts.push({ type: 'danger', msg: `Password token expired` })

})
