
var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APBilling", ['ngRoute','APFormsDirectives','APPaymentDirectives','APAnalytics',
  'APFilters','APSvcSession','APSvcBilling'])

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

    var success = (r) => {
      if (r.btoken) $scope.btoken = r.btoken
      else $scope.paymethods = r
    }

    var err = (r) => console.log('err', r)


    BillingService.billing.getPaymethods(success, err)
    BillingService.billing.getMyOrders(success, err)

    // console.log('on settings billing')
    // this.submit = function(isValid, formData) {
    //   if (!isValid) return
    //   SessionService.login(formData,
    //     () => $window.location = '',
    //     (e) => $scope.signupFail = e.error
    //   )
    // }

    $scope.buyFivehundred = function() {
      console.log('buyFivehundred', $scope.paymethods[0]._id)
      var orderSuccess = (r) => {
        console.log('r.success', r)
      }

      BillingService.billing.orderCredit({total:500,paymethodId:$scope.paymethods[0]._id}, orderSuccess, err)
    }

  })


  .controller('BillingMembershipCtrl', function($scope, SessionService) {

    // console.log('in membership billing')

  })


;
