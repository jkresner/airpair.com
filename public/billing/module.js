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
      else if (val == "3000") scope.cardSubmitText = "Pay $3000, get $3300 Credit"
      else if (val == "5000") scope.cardSubmitText = "Pay $5000, get $6000 Credit"
    }
    return this
  })

  .controller('BillingCtrl', function($scope, BillingService, submitPaymentText) {

    var err = (r) => console.log('err', r)
    $scope.orders = []

    BillingService.billing.getPaymethods((r) => {
      if (r.btoken) $scope.btoken = r.btoken
      else $scope.paymethods = r
    }, err)

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
        $scope.creditAmount = "3000"

      $scope.choice = val
    }

    $scope.setSubmitCardText = function(val) { submitPaymentText.getText($scope, val) }

    $scope.$watch("creditAmount", $scope.setSubmitCardText)

  })

  .controller('BillingTopUpCtrl', function($scope, $location, BillingService, submitPaymentText) {

    var err = (r) => console.log('err', r)

    BillingService.billing.getPaymethods((r) => {
      if (r.btoken) $location.path("/billing")
      else {
        $scope.paymethods = r
        $scope.paymethodId = r[0]._id
      }
    }, err)


    $scope.creditAmount = "3000"
    $scope.coupon = ""
    $scope.setSubmitCardText = function(val) { submitPaymentText.getText($scope, val) }
    $scope.$watch("creditAmount", $scope.setSubmitCardText)

    $scope.submit =  (formValid, data) => {
      if (formValid)
      {
        var success = () => $location.path("/billing")

        var {coupon,paymethodId} = $scope
        BillingService.billing.orderCredit({total:parseInt($scope.creditAmount),paymethodId,coupon}, success, err)
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

  .controller('BillingBookExpertCtrl', function($scope, $routeParams, BillingService) {

    $scope.booking = {
      minutes: 120,
      type: "private",
      time: moment().add(1, 'month')
    }

    $scope.calcSummary = function() {
      if (!$scope.expert) return
      var hrRate = $scope.expert.rate
      if ($scope.type == "opensource") hrRate = hrRate - 20
      $scope.total = hrRate * $scope.booking.minutes/60

      if ($scope.credit > $scope.total) {
        $scope.owe = 0
        $scope.remainingCredit = $scope.credit - $scope.total
      }
      else {
        $scope.owe = $scope.total - $scope.credit
      }
    }

    BillingService.experts.getById({_id:$routeParams.id}, (r) => {
      $scope.expert = r
      $scope.booking.expertId = r._id
      $scope.calcSummary()
    }, () => {})

    BillingService.billing.getMyOrdersWithCredit((r) => {
      $scope.orders = r
      // console.log(OrdersUtil.linesWithCredit(r))
      $scope.credit = OrdersUtil.getAvailableCredit(OrdersUtil.linesWithCredit(r))

      // console.log('$scope.credit', $scope.credit)
      $scope.calcSummary()

      if ($scope.credit == 0) {
        BillingService.billing.getPaymethods((r) => {
          if (r.btoken) $location.path("/billing")
          else {
            $scope.paymethods = r
            $scope.booking.paymethodId = r[0]._id
          }
        }, () => {})
      }
    }, () => {})

    $scope.$watch('booking.minutes', $scope.calcSummary)

    $scope.submit = function() {
      if ($scope.remainingCredit >= 0) {
        BillingService.billing.bookExpertWithCredit($scope.booking, (r) => $location.path("/billing"), () => {})
      }
    }

  })

