angular.module("APExpert", ['APTagInput','APPayPal'])

.config((apRouteProvider) => {

  var authd = apRouteProvider.resolver(['session'])
  var exprd = apRouteProvider.resolver(['expert'])
  var route = apRouteProvider.route
  route('/be-an-expert', 'ExpertApplication', require('./beanexpert.html'),{resolve: authd})
  route('/me/profile-preview', 'ProfilePreview', require('./profilepreview.html'),{resolve: authd})
  route('/payouts', 'Payouts', require('./payouts.html'),{resolve: exprd})
  route('/office', 'ExpertDashboard', require('./office.html'),{resolve: exprd})
})



.directive('officeBookings', function() {
  return {
    restrict: 'E',
    template: require('./bookings.html'),
  }
})


.controller('ExpertDashboardCtrl', function($scope, DataService, BookingsUtil) {

  $scope.util = BookingsUtil

  DataService.bookings.getExpertBookings({}, (r) => {
    $scope.bookings = _.take(r,10)
  })

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

    var slack = $scope.session.social.sl
    $scope.connectedSlack = slack && slack.username
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
    if (!d.location) requires = "Location not selected"
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
    expert.username= $scope.session.username
    $scope.expert = expert
    $scope.data = expert,_.extend(expert, $scope.data||{})
  })

  $scope.save = () => {
    if ($scope.requires) return alert($scope.requires)

    if ($scope.data._id)
      DataService.experts.updateMe(_.pick($scope.data,'_id','userId','tags','rate','brief'), (expert) => {
        window.location = '/office'
      })
    else
      DataService.experts.create(_.pick($scope.data,'tags','rate','brief'), (expert) => {
        window.location = '/office'
      })
  }
})


.controller('ProfilePreviewCtrl', ($scope, $location, $q, SessionService) => {


})
