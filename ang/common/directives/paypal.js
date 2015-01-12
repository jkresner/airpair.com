angular.module("APPayPal", [])

.directive('paypalLogin', function() {

  return {
    template: '<a id="paypalLoginButton"><img src="//www.paypalobjects.com/webstatic/en_US/developer/docs/lipp/loginwithpaypalbutton.png"></a>',
    link: function(scope, element) {
      $.get('/v1/auth/paypal-loginurl?returnTo='+window.location.pathname).success((data)=>
        element.find('a').attr('href',data.url))
    }
  };

});
