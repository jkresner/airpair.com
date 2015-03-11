angular.module("APProfile", ['ngRoute', 'APFilters', 'APSvcSession', 'APTagInput','APPayPal'])

.config((apRouteProvider) => {

  var authd = apRouteProvider.resolver(['session']);
  var route = apRouteProvider.route
  route('/me/password', 'Password', require('./password.html'))
  route('/me', 'Account', require('./account.html'),{resolve: authd})
  route('/payouts', 'Payouts', require('./payouts.html'),{resolve: authd})
  route('/be-an-expert', 'ExpertApplication', require('./beanexpert.html'),{resolve: authd})
  route('/me/profile-preview', 'ProfilePreview', require('./profilepreview.html'),{resolve: authd})
})

.directive('userInfo', function() {

  return {
    restrict: 'E',
    template: require('./userInfo.html'),
    controller($rootScope, $scope, $location, ServerErrors, SessionService) {

      var updateInfo = function(targetName) {
        $scope.profileAlerts = []
        var propName = targetName.toLowerCase()
        if ($scope.data[propName] && $scope.data[propName] != '' &&
            $scope.session[propName] != $scope.data[propName])
        {
          var up = {}
          up[propName] = $scope.data[propName]
          SessionService[`update${targetName}`](up, function(result){
            $scope.profileAlerts.push({ type: 'success', msg: `${targetName} updated` })
          }, function(e){
            $scope.data.username = $scope.session.username
            $scope.profileAlerts.push({ type: 'danger', msg: e.message })
          })
        }
      }

      $rootScope.$watch('session', (session) => {
        $scope.data = _.extend($scope.data||{},_.pick(session, 'name','email','initials','username','bio'))
        if (session.localization)
        {
          $scope.data.location = session.localization.location
          $scope.data.timezone = session.localization.timezone
        }

        if (!$scope.data.username && $scope.session.social) {
          var social = $scope.session.social
          if (social.gh) $scope.data.username = social.gh.username
          else if (social.tw) $scope.data.username = social.tw.username
          $scope.updateUsername()
        }
      })

      // $scope.updateBio = () => updateInfo('Bio')
      $scope.updateName = () => updateInfo('Name')
      $scope.updateInitials = () => updateInfo('Initials')
      $scope.updateUsername = () => updateInfo('Username')

      $scope.updateLocation = (locationData) => {
        SessionService.changeLocationTimezone(locationData, (r)=> {})
      }
    }
  }

})


.controller('AccountCtrl', function($rootScope, $scope, $location, ServerErrors, SessionService) {

  if ($location.search().verify)
  {
    SessionService.verifyEmail({hash:$location.search().verify}, function(result){
      $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! Next step, <a href="/posts/new">Start authoring post</a> or setup your <a href="/billing">Billing info</a>.` }]
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
  };

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


.controller('PayoutsCtrl', ($scope, $location, $q, DataService, ServerErrors, OrdersUtil) => {

  if ($location.search().fail)
    ServerErrors.add({message:$location.search().fail})

  $scope.checkedOrders = {}
  $scope.data = { orders: { total: 0 } }

  var setPayoutmethodsScope = (r) => {
    var has = {
      paypal:_.some(r, (pm)=>pm.type=='payout_paypal'),
      venmo:_.some(r, (pm)=>pm.type=='payout_paypal'),
      coinbase:_.some(r, (pm)=>pm.type=='payout_paypal')
    }
    $scope.has = has
    $scope.payoutmethods = r
    if (r.length == 1)
      $scope.data.payoutmethodId = r[0]._id
  }

  DataService.billing.getPayoutmethods({},setPayoutmethodsScope)

  $scope.deletePaymethod = (_id) => {
    DataService.billing.deletePaymethod({_id}, (r) => {
      setPayoutmethodsScope(_.reject($scope.payoutmethods,(p)=>p._id==_id))
    })
  }

  DataService.billing.getOrdersForPayouts({},(r)=>{
    $scope.payoutOrders = r
    $scope.summary = OrdersUtil.payoutSummary(r)
  })

  $scope.watchOrdersToPayout = () => {
    var total = 0

    $scope.data.orders = _.map(_.keys($scope.checkedOrders),(key) => {
      console.log('$scope.checkedOrders[key])', $scope.checkedOrders[key])
      if (key != 'total' && $scope.checkedOrders[key])
      {
        var o = _.find($scope.payoutOrders,(o)=>o._id==key)
        total += o.lineItems[0].owed
        return key
      }
    })
    console.log('checkedOrders', $scope.checkedOrders)
    $scope.checkedOrders.total = total
  }


  $scope.collectPaymentDeferred = () => {
    var deferred = $q.defer()
    console.log('*****clicked', $scope.data)
    DataService.billing.payoutOrders($scope.data, (r) => {
      window.location = window.location
      deferred.resolve(r)
    },
    deferred.reject)

    return deferred.promise
  }

})


.controller('ExpertApplicationCtrl', ($rootScope, $scope, DataService, SessionService, Util) => {

  $scope.formRequires = () => {
    var d = $scope.data, requires = false;
    if (!d.initials) requires = "Initials required"
    if (!d.timezone) requires = "Timezone not selected"
    if (!d.username) requires = "Username required"
    if (!d.rate) requires = "Rate not selected"
    if (!d.bio || d.bio.length < 100) requires = "Min 100 character bio required"
    if (!d.tags || d.tags.length == 0) requires = "Select at least 1 tag"
    $scope.requires = requires
    return requires
  }

  $scope.tags = () => $scope.data ? $scope.data.tags : null;
  $scope.updateTags = (scope, newTags) => {
    if (!$scope.expert) return
    $scope.data.tags = newTags;
  }
  $scope.selectTag = function(tag) {
    var tags = $scope.data.tags;
    if ( _.contains(tags, tag) ) $scope.data.tags = _.without(tags, tag)
    else $scope.data.tags = _.union(tags, [tag])
  };
  $scope.deselectTag = (tag) => $scope.data.tags = _.without($scope.data.tags, tag)

  $scope.updateBio = (valid, bio) => {
    if (valid && bio!=$scope.session.bio) {
      SessionService.updateBio({bio}, function(result){
        $rootScope.session = result
      })
    }
  }

  if (!$scope.data) $scope.data = { bio: $scope.session.bio }
  $scope.socialCount = _.keys($scope.session.social||{}).length

  DataService.experts.getMe({}, (expert) => {
    $scope.expert = expert
    if (expert.hours) {
      $scope.v0expert = true
      $scope.firstName = Util.firstName(expert.name)
    } else {
      $scope.data = expert,_.extend(expert, $scope.data||{})
      // console.log($scope.session.social.tw)
      // if (!$scope.data.bio && $scope.session.social
      //   && $scope.session.social.tw)
      //   $scope.data.bio = $scope.session.social.tw._json.description
      console.log($scope.data.brief)
    }
  })

  $scope.save = () => {
    if ($scope.data._id)
      DataService.experts.updateMe(_.pick($scope.data,'_id','userId','tags','rate','brief'), (expert) => {
        window.location = '/posts/me'
      })
    else
      DataService.experts.create(_.pick($scope.data,'tags','rate','brief'), (expert) => {
        window.location = '/posts/me'
      })
  }
})


.controller('ProfilePreviewCtrl', ($scope, $location, $q, SessionService) => {


})
