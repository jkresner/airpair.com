require('./directives');
var resolver = require('./../common/routes/helpers').resolveHelper
var OrdersUtil = require('./../../shared/orders')

angular.module("APBilling", ['ngRoute', 'APPaymentDirectives', 'APBillingDirectives','APExpertsDirectives'])

.config(function(apRouteProvider) {

  var authd = resolver(['session']);

  var route = apRouteProvider.route

  route('/billing', 'Billing', require('./welcome.html'), { resolve: authd })
  route('/billing/top-up', 'BillingTopUp', require('./topup.html'), { resolve: authd })
  route('/billing/membership', 'BillingMembership', require('./membership.html'), { resolve: authd })
  route('/billing/book/:id', 'BillingBookExpert', require('./book.html'), { resolve: authd })
  route('/billing/book/:id/:rid', 'BillingBookExpert', require('./book.html'), { resolve: authd })
  route('/billing/deal/:id', 'BillingDeal', require('./deal.html'), { resolve: authd })

  route('/experts', 'BillingExperts', require('./experts.html'), { resolve: authd })
})

.factory('submitPaymentText', function submitPaymentTextFactory() {
  this.getText = (scope, val) => {
    // console.log('SubmitPaymentText', val)
    if (!val || val == "") scope.cardSubmitText = "Save card for later"
    else if (val == "500") scope.cardSubmitText = "Pay $500, get $500 Credit"
    else if (val == "1000") scope.cardSubmitText = "Pay $1000, get $1050 Credit"
    else if (val == "3000") scope.cardSubmitText = "Pay $3000, get $3300 Credit"
    else if (val == "5000") scope.cardSubmitText = "Pay $5000, get $6000 Credit"
  }
  return this
})

.controller('BillingCtrl', function($scope, ServerErrors, DataService, submitPaymentText) {

  var err = (r) => console.log('err', r)
  $scope.orders = []

  var getPayMethods = function() {
    DataService.billing.getPaymethods((r) => {
      if (r.btoken) {
        $scope.paymethods = null
        $scope.btoken = r.btoken
      }
      else $scope.paymethods = r
    }, err)
  }
  getPayMethods()

  DataService.billing.getMyOrders((r) => $scope.orders = r, err)

  $scope.orderSuccess = (r) => {
    $scope.orders = _.union($scope.orders,[r])
    console.log('orderSuccess', $scope.orders)
  }

  $scope.creditAmount = null
  $scope.setChoice = (val) => {
    if (val == 'alacart')
      $scope.creditAmount = null
    else
      $scope.creditAmount = "1000"

    $scope.choice = val
  }
  $scope.setPayMethods = function(val) { $scope.paymethods = val } // This is dumb

  $scope.setSubmitCardText = function(val) { submitPaymentText.getText($scope, val) }

  $scope.$watch("creditAmount", $scope.setSubmitCardText)

  $scope.deletePayMethod = function(_id) {
    DataService.billing.deletePaymethod({_id}, function(r) {
      getPayMethods()
    }, ServerErrors.add)
  }
})

.controller('BillingTopUpCtrl', function($scope, $location, DataService, ServerErrors, submitPaymentText) {

  DataService.billing.getPaymethods((r) => {
    if (r.btoken) $location.path("/billing")
    else {
      $scope.paymethods = r
      $scope.payMethodId = r[0]._id
    }
  }, ServerErrors.add)


  $scope.creditAmount = "1000"
  $scope.coupon = ""
  $scope.setSubmitCardText = function(val) { submitPaymentText.getText($scope, val) }
  $scope.$watch("creditAmount", $scope.setSubmitCardText)

  $scope.submit =  (formValid, data) => {
    if (formValid)
    {
      var success = () => $location.path("/billing")

      var {coupon,payMethodId} = $scope
      DataService.billing.orderCredit({total:parseInt($scope.creditAmount),payMethodId,coupon}, success, ServerErrors.add)
    }
  }
})


.controller('BillingMembershipCtrl', function($scope, DataService) {

  // console.log('in membership billing')

})

.controller('BillingBookExpertCtrl', function($scope, $routeParams, $location,
  ServerErrors, DataService) {

  $scope.booking = {
    credit: 0,
    minutes: 120,
    type: "private",
    time: moment().add(1, 'month'),
    payMethodId: null
  }

  $scope.calcSummary = function() {
    if (!$scope.expert || !$scope.booking) return

    var hrRate = $scope.expert.rate + 30

    if ($scope.suggestion)
      hrRate = $scope.suggestion.suggestedRate.total

    if ($scope.booking.type == "opensource") hrRate = hrRate - 10

    $scope.hrRate = hrRate
    $scope.total = hrRate * $scope.booking.minutes/60

    if ($scope.booking.credit > $scope.total) {
      $scope.owe = 0
      $scope.remainingCredit = $scope.booking.credit - $scope.total
    }
    else {
      $scope.remainingCredit = 0
      $scope.owe = $scope.total - $scope.booking.credit
    }
  }

  var _id = $routeParams.id
  if ($routeParams.rid)
  {
    var expertId = $routeParams.id.toString()
    DataService.requests.getRequestForBookingExpert($routeParams.rid,expertId, (r) => {
      $scope.suggestion = _.find(r.suggested,(s)=>s.expert._id==expertId)
      $scope.expert = $scope.suggestion.expert
      $scope.booking.request = { requestId: r._id, suggestion: $scope.suggestion }
      $scope.booking.expertId = $scope.expert._id
      $scope.calcSummary()
    }, ServerErrors.add)
  }
  else
  {
    DataService.experts.getById({_id}, (r) => {
      $scope.expert = r
      $scope.booking.expertId = r._id
      $scope.calcSummary()
    }, ServerErrors.add)
  }

  $scope.$watch('booking.payMethodId', function(val) {
    if (!val) return
    DataService.billing.getMyOrdersWithCredit(val, (r) => {
      $scope.orders = r
      $scope.booking.credit = OrdersUtil.getAvailableCredit(OrdersUtil.linesWithCredit(r))
      $scope.calcSummary()
    }, ServerErrors.add)
  })


  DataService.billing.getMyOrdersForExpert({_id},(r) => {
    var lines = OrdersUtil.linesWithMinutesRemaining(r)
    $scope.availableMinutes = OrdersUtil.getAvailableMinutesRemaining(lines)
    console.log('getMyOrdersForExpert', $scope.availableMinutes)

    // $scope.paymethods = r
    // $scope.booking.payMethodId = r[0]._id
  })


  DataService.billing.getPaymethods((r) => {
    if (r.btoken) $location.path("/billing")
    else {
      $scope.paymethods = r
      $scope.booking.payMethodId = r[0]._id
    }
  }, ServerErrors.add)


  $scope.$watch('booking.minutes', $scope.calcSummary)

  $scope.submit = function() {
    DataService.billing.bookExpert($scope.booking, (r) => $location.path("/billing"), ServerErrors.add)
  }

})


.controller('BillingExpertsCtrl', function($scope, DataService) {

  DataService.experts.getForExpertsPage({}, (r) => {
    $scope.experts = r.experts
  })

})



.controller('BillingDealCtrl', ($scope, DataService, $routeParams, $location, ServerErrors) => {
  var _id = $routeParams.id
  DataService.experts.getDeal({_id}, (r) => {
    $scope.expert = r
    $scope.deal = _.find(r.deals,(d)=>d._id==_id)
    if (!$scope.deal) $location.path("/billing")
  })

  DataService.billing.getPaymethods((r) => {
    if (r.btoken) $location.path("/billing")
    else {
      $scope.paymethods = r
      $scope.payMethodId = r[0]._id
    }
  }, ServerErrors.add)


  $scope.orderDeal = () => {
    var o = { expertId: $scope.expert._id, payMethodId: $scope.payMethodId, dealId: $scope.deal._id }
    DataService.billing.orderDeal(o, (r) => {
      console.log('deal ordered', r)
      $location.path("/billing/book/"+$scope.expert._id)
    })
  }

})

