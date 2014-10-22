
var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APBilling", ['ngRoute','APFilters','APSvcSession','APAnalytics'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    var authd = resolver(['session']);

    $routeProvider.when('/billing', {
      template: require('./welcome.html'),
      resolve: authd
    });

    $routeProvider.when('/billing/membership', {
      template: require('./membership.html'),
      resolve: authd
    });

  }])

  .controller('BillingCtrl', ['$scope', '$window', 'SettingsService',
      function($scope, $window, SettingsService) {
    var self = this;

    console.log('in settings billing')
    // this.submit = function(isValid, formData) {
    //   if (!isValid) return
    //   SessionService.login(formData,
    //     () => $window.location = '',
    //     (e) => $scope.signupFail = e.error
    //   )
    // }
  }])

;
