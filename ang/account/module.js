angular.module("APProfile", ['ngRoute', 'APFilters', 'APSvcSession', 'APTagInput','APPayPal'])

.config((apRouteProvider) => {

  var authd = apRouteProvider.resolver(['session']);
  var route = apRouteProvider.route
  route('/me/password', 'Password', require('./password.html'))
  route('/me', 'Account', require('./account.html'),{resolve: authd})
  route('/payouts', 'Payouts', require('./payouts.html'),{resolve: authd})

})


.controller('AccountCtrl', function($rootScope, $scope, $location, ServerErrors, SessionService) {

  if ($location.search().verify)
  {
    SessionService.verifyEmail({hash:$location.search().verify}, function(result){
      $scope.emailAlerts = [{ type: 'success', msg: `${$scope.session.email} verified ! <b>Next step, go to <a href="/billing">BILLING</a></b>` }]
    }, function(e){
      $scope.emailAlerts = [{ type: 'danger', msg: `${e.message||e}` }]
    })
  }

  $rootScope.$watch('session', (session) =>
    $scope.data = _.pick(session, 'name','email','initials','username')
  )

  if ($scope.session)
    $scope.data = _.pick($scope.session, 'name','email','initials','username')

  var updateInfo = function(targetName) {
    $scope.profileAlerts = []
    var propName = targetName.toLowerCase()
    if ($scope.session[propName] != $scope.data[propName])
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

  $scope.updateBio = () => updateInfo('Bio')
  $scope.updateName = () => updateInfo('Name')
  $scope.updateInitials = () => updateInfo('Initials')
  $scope.updateUsername = () => updateInfo('Username')


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


  //-- this will be refactored out of the posts module
  // .controller('ProfileCtrl', function($scope, PostsService, $routeParams) {

  //     $scope.username = $routeParams.username;

  //     PostsService.getByUsername($routeParams.username, (posts) => {
  //       $scope.posts = posts;
  //     });

  // })


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
