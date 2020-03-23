module.exports = function($scope, API, PAGE) {

  PAGE.main($scope,{loading:false})
      .setData({data:$scope.session})
      .toggleLoading(false)

  // console.log('user', $scope.data)

  // if ($location.search().verify)
  // {
  //   SessionService.verifyEmail({hash:$location.search().verify}, function(result){
  //     $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! Next step setup your <a href="/billing">Billing info</a>.` }]
  //   }, function(e){
  //     $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e}` }]
  //   })
  // }

  // var updateInfo = targetName => function() {
  //   $scope.profileAlerts = []
  //   var propName = targetName.toLowerCase()
  //   if ($scope.data[propName]
  //     && $scope.data[propName] != ''
  //     && $scope.session[propName] != $scope.data[propName])
  //   {
  //     var up = {}
  //     up[propName] = $scope.data[propName]
  //     SessionService[`update${targetName}`](up, function(r) {
  //       $rootScope.session = _.pick(r, 'name','email','initials','username', 'avatar')
  //       if (r.location) {
  //         $scope.data.location = r.location.name
  //         $scope.data.timeZoneId = r.location.timeZoneId
  //       }
  //       $scope.profileAlerts.push({ type: 'success', msg: `${targetName} updated` })
  //     }, function(e){
  //       $scope.data.username = $rootScope.session.username
  //       $scope.profileAlerts.push({ type: 'danger', msg: e.message })
  //     })
  //   }

  //   if (!$scope.data.username && $scope.session.auth) {
  //     var social = $scope.session.auth
  //     if (social.gh && social.gh.login || social.gh.username)
  //     {
  //       var username = social.gh.login || social.gh.username
  //       SessionService.updateUsername({username}, function(result){
  //         $scope.data.username = username
  //       }, function(e){})
  //     }
  //   }
  // }

  // console.log('watching the change....', $rootScope.session.location)

  // if (user.location)
  // {
  //   $scope.data.location = user.location.name
  //   $scope.data.timeZoneId = user.location.timeZoneId
  // }

  // $scope.updateName = updateInfo('Name')
  // $scope.updateInitials = updateInfo('Initials')
  // $scope.updateUsername = updateInfo('Username')
  // $scope.updateLocation = (locationData) => {
  //   SessionService.changeLocationTimezone(locationData, (r) => {
  //     // $scope.data.location = r.location.name
  //     $scope.data.timezone = r.location.timeZoneId
  //   }, (e)=> {})
  // }

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

  // }, () => {})

}
