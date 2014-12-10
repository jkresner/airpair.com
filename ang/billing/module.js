require('./directives');
var resolver = require('./../common/routes/helpers').resolveHelper
var OrdersUtil = require('./../../shared/orders')

angular.module("APBilling", ['ngRoute','APFormsDirectives','APPaymentDirectives','APAnalytics',
  'APFilters','APSvcSession','APSvcBilling', 'APBillingDirectives','APExpertsDirectives'])

  .config(function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/billing', {
      template: require('./welcome.html'),
      controller: 'BillingCtrl',
      resolve: authd
    });

    $routeProvider.when('/billing/top-up', {
      template: require('./topup.html'),
      controller: 'BillingTopUpCtrl',
      resolve: authd
    });

    $routeProvider.when('/billing/membership', {
      template: require('./membership.html'),
      controller: 'BillingMembershipCtrl',
      resolve: authd
    });

    $routeProvider.when('/experts', {
      template: require('./experts.html'),
      controller: 'BillingExpertsCtrl',
      resolve: authd
    });

    $routeProvider.when('/billing/book/:id', {
      template: require('./book.html'),
      controller: 'BillingBookExpertCtrl',
      resolve: authd
    });

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

  .controller('BillingCtrl', function($scope, ServerErrors, BillingService, submitPaymentText) {

    var err = (r) => console.log('err', r)
    $scope.orders = []

    var getPayMethods = function() {
      BillingService.billing.getPaymethods((r) => {
        if (r.btoken) {
          $scope.paymethods = null
          $scope.btoken = r.btoken
        }
        else $scope.paymethods = r
      }, err)
    }
    getPayMethods()

    BillingService.billing.getMyOrders((r) => $scope.orders = r, err)

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

    $scope.deletePayMethod = function(id) {
      BillingService.billing.deletePaymethod(id, function(r) {
        getPayMethods()
      }, ServerErrors.add)
    }
  })

  .controller('BillingTopUpCtrl', function($scope, $location, BillingService, ServerErrors, submitPaymentText) {

    BillingService.billing.getPaymethods((r) => {
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
        BillingService.billing.orderCredit({total:parseInt($scope.creditAmount),payMethodId,coupon}, success, ServerErrors.add)
      }
    }
  })


  .controller('BillingMembershipCtrl', function($scope, BillingService) {

    // console.log('in membership billing')

  })

  .controller('BillingExpertsCtrl', function($scope, BillingService) {

    BillingService.experts.getForExpertsPage((r) => {
      $scope.experts = r.experts
    }, () => {} )

  })

  .controller('BillingBookExpertCtrl', function($scope, $routeParams, $location, ServerErrors, BillingService) {

    $scope.booking = {
      credit: 0,
      minutes: 120,
      type: "private",
      time: moment().add(1, 'month'),
      payMethodId: null
    }

    $scope.calcSummary = function() {
      if (!$scope.expert) return
      var hrRate = $scope.expert.rate
      if ($scope.booking.type == "opensource") hrRate = hrRate + 20
      else if ($scope.booking.type == "private") hrRate = hrRate + 40
      else if ($scope.booking.type == "nda") hrRate = hrRate + 90
      $scope.hrRate = hrRate
      $scope.total = hrRate * $scope.booking.minutes/60
      //console.log('$scope.hrRate', $scope.hrRate, $scope.booking.type)

      if ($scope.booking.credit > $scope.total) {
        $scope.owe = 0
        $scope.remainingCredit = $scope.booking.credit - $scope.total
      }
      else {
        $scope.remainingCredit = 0
        $scope.owe = $scope.total - $scope.booking.credit
      }
    }

    BillingService.experts.getById({_id:$routeParams.id}, (r) => {
      $scope.expert = r
      $scope.booking.expertId = r._id
      $scope.calcSummary()
    }, ServerErrors.add)


    $scope.$watch('booking.payMethodId', function(val) {
      if (!val) return
      BillingService.billing.getMyOrdersWithCredit(val, (r) => {
        $scope.orders = r
        $scope.booking.credit = OrdersUtil.getAvailableCredit(OrdersUtil.linesWithCredit(r))
        $scope.calcSummary()
      }, ServerErrors.add)
    })

    BillingService.billing.getPaymethods((r) => {
      if (r.btoken) $location.path("/billing")
      else {
        $scope.paymethods = r
        $scope.booking.payMethodId = r[0]._id
      }
    }, ServerErrors.add)




    $scope.$watch('booking.minutes', $scope.calcSummary)

    $scope.submit = function() {
      BillingService.billing.bookExpert($scope.booking, (r) => $location.path("/billing"), ServerErrors.add)
    }

  })

