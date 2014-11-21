angular.module("APPaymentDirectives", ['angularLoad','APSvcSession'])

  .directive('paymentInfo', function(angularLoad, SessionService) {

    var src = 'https://js.braintreegateway.com/v2/braintree.js';

    var ngLoadPromise = angularLoad.loadScript(src);


    return {
      template: require('./paymentInfo.html'),
      link: function(scope, element) {
        ngLoadPromise.then(function(){

        });
      }
    };
  });
