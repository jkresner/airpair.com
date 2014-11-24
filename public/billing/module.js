require('./directives.js');
var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APBilling", ['ngRoute','APFormsDirectives','APPaymentDirectives','APAnalytics',
  'APFilters','APSvcSession','APSvcBilling', 'APBillingDirectives'])

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

    BillingService.billing.getPaymethods((r) => {
      if (r.btoken) $scope.btoken = r.btoken
      else $scope.paymethods = r
    }, err)

    BillingService.billing.getMyOrders((r) => $scope.orders = r, err)

    $scope.orderSuccess = (r) => {
      console.log('orderSuccess')
      $scope.orders = ($scope.orders) ? _.union($scope.orders,[r]) : [r]
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
      console.log('submit cred')
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


;
