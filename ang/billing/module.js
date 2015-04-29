require('./directives');
var OrdersUtil = require('./../../shared/orders')

angular.module("APBilling", ['ngRoute', 'APPaymentDirectives', 'APBillingDirectives','APExpertsDirectives'])

.config(function(apRouteProvider) {

  var authd = apRouteProvider.resolver(['session'])
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

.controller('BillingCtrl', function($scope, DataService, submitPaymentText) {

  $scope.orders = []

  var getPayMethods = function() {
    DataService.billing.getPaymethods({},(r) => {
      if (r.btoken) {
        $scope.paymethods = null
        $scope.btoken = r.btoken
      }
      else $scope.paymethods = r
    })
  }
  getPayMethods()

  DataService.billing.getMyOrders({}, (r) => $scope.orders = r)

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
    DataService.billing.deletePaymethod({_id}, (r) => getPayMethods())
  }
})

.controller('BillingTopUpCtrl', function($scope, $location, DataService, ServerErrors, submitPaymentText) {

  DataService.billing.getPaymethods({}, (r) => {
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


.directive('bookExpert', function() {

  return {
    template: require('./bookExpert.html'),
    link() { },
    controller($rootScope, $scope, $q, $routeParams, $location, DataService) {
      $scope.booking = { // payMethodId: null,
        credit: 0, minutes: 120, type: "private", time: moment().add(1, 'month')
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
        var expertId = _id
        DataService.requests.getRequestForBookingExpert({requestId:$routeParams.rid,expertId}, (r) => {
          $scope.suggestion = _.find(r.suggested,(s)=>s.expert._id==_id)
          $scope.expert = $scope.suggestion.expert
          $scope.booking.request = { requestId: r._id, suggestion: $scope.suggestion }
          $scope.booking.expertId = $scope.expert._id
          $scope.calcSummary()
        })
      }

      var setExpert = (expert) => {
        _id = expert._id
        $scope.expert = expert
        $scope.booking.expertId = expert._id
        $scope.calcSummary()
      }

      if ($rootScope.expert) {//-- come form server /book/username
        if (!$rootScope.notFirstBookLoad) return $rootScope.notFirstBookLoad = true
        setExpert($rootScope.expert)
      }
      else
        DataService.experts.getById({_id}, setExpert)


      $scope.$watch('booking.payMethodId', function(val) {
        if (!val) return
        DataService.billing.getMyOrdersWithCredit({payMethodId:val}, (r) => {
          $scope.orders = r
          $scope.booking.credit = OrdersUtil.getAvailableCredit(OrdersUtil.linesWithCredit(r))
          $scope.calcSummary()
        })
      })

      DataService.billing.getMyOrdersForExpert({_id},(r) => {
        var lines = OrdersUtil.linesWithMinutesRemaining(r)
        if (!lines || lines.length == 0) return
        $scope.availableMinutes = OrdersUtil.getAvailableMinutesRemaining(lines)
        if ($scope.availableMinutes > 0) $scope.redeemableTime = [{val:30,name:'30 mins'}]
        if ($scope.availableMinutes > 59) $scope.redeemableTime.push({val:60,name:'60 min'})
        if ($scope.availableMinutes > 89) $scope.redeemableTime.push({val:90,name:'180 min'})
        if ($scope.availableMinutes > 119) $scope.redeemableTime.push({val:120,name:'2 hr'})
        if ($scope.availableMinutes > 170) $scope.redeemableTime.push({val:180,name:'3 hr'})
        $scope.booking.dealId = lines[0].info.deal._id
      })


      DataService.billing.getPaymethods({}, (r) => {
        if (r.btoken) $location.path("/billing")
        else {
          $scope.booking.payMethodId = r[0]._id.toString()
          $scope.paymethods = _.map(r,(p)=>{return {name:p.name,_id:p._id.toString()} })
        }
      })


      $scope.$watch('booking.minutes', $scope.calcSummary)

      $scope.submitDeferred = () => {
        var deferred = $q.defer()
        DataService.billing.bookExpert($scope.booking, (r) => {
          console.log('booked', r._id, r)
          $location.path(`/bookings/${r._id}`)
          deferred.resolve(r)
        },
        deferred.reject)

        return deferred.promise
      }
    }
  };

})


.controller('BillingBookExpertCtrl', ($scope) => {

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

  DataService.billing.getPaymethods({}, (r) => {
    if (r.btoken) $location.path("/billing")
    else {
      $scope.paymethods = r
      $scope.payMethodId = r[0]._id
    }
  }, ServerErrors.add)


  $scope.orderDeal = () => {
    var o = { expertId: $scope.expert._id, payMethodId: $scope.payMethodId, dealId: $scope.deal._id }
    DataService.billing.orderDeal(o, (r) => {
      $location.path("/billing/book/"+$scope.expert._id)
    })
  }

})

