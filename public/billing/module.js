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

    $routeProvider.when('/billing/membership', {
      template: require('./membership.html'),
      controller: 'BillingMembershipCtrl',
      resolve: authd
    });

  })

  .controller('BillingCtrl', function($scope, SessionService, BillingService) {

    var err = (r) => console.log('err', r)

    BillingService.billing.getPaymethods((r) => {
      if (r.btoken) $scope.btoken = r.btoken
      else $scope.paymethods = r
    }, err)

    BillingService.billing.getMyOrders((r) => $scope.orders = r, err)

    // console.log('on settings billing')
    // this.submit = function(isValid, formData) {
    //   if (!isValid) return
    //   SessionService.login(formData,
    //     () => $window.location = '',
    //     (e) => $scope.signupFail = e.error
    //   )
    // }

    var orderSuccess = (r) => {
      $scope.orders = ($scope.orders) ? _.union($scope.orders,[r]) : [r]
    }

    $scope.buyFivehundred = function() {
      BillingService.billing.orderCredit({total:500,paymethodId:$scope.paymethods[0]._id}, orderSuccess, err)
    }

    $scope.buyThreeThousand = function() {
      BillingService.billing.orderCredit({total:3000,paymethodId:$scope.paymethods[0]._id}, orderSuccess, err)
    }

    $scope.buyFiveThousand = function() {
      BillingService.billing.orderCredit({total:5000,paymethodId:$scope.paymethods[0]._id, coupon: 'letspair'}, orderSuccess, err)
    }

    $scope.setChoice = (val) => {
      $scope.cardSubmitText = (val=='credit') ? "Puchase credit" : "Save card for later"
      $scope.choice = val
      console.log('val', val, $scope.cardSubmitText)
    }

  })


  .controller('BillingMembershipCtrl', function($scope, SessionService) {

    // console.log('in membership billing')

  })


;
