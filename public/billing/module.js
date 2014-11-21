
var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APBilling", ['ngRoute','APFilters','APSvcSession','APAnalytics', 'APPaymentDirectives'])

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

  .controller('BillingCtrl', function($scope, SessionService) {

    var success = (r) => {
      console.log('suc', r)
      if (r.btoken) $scope.broken = r.btoken
      else $scope.paymethods = r
    }

    var err = (r) => {
      console.log('err', r)
    }

    SessionService.getPaymethods(success, err)

    // console.log('on settings billing')
    // this.submit = function(isValid, formData) {
    //   if (!isValid) return
    //   SessionService.login(formData,
    //     () => $window.location = '',
    //     (e) => $scope.signupFail = e.error
    //   )
    // }
  })


  .controller('BillingMembershipCtrl', function($scope, SessionService) {

    console.log('in membership billing')

  })


;
