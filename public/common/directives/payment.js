angular.module("APPaymentDirectives", ['angularLoad','APSvcSession'])

  .directive('paymentInfo', function(angularLoad, SessionService) {

    var src = 'https://js.braintreegateway.com/v2/braintree.js';

    var ngLoadPromise = angularLoad.loadScript(src);

    return {
      template: require('./paymentInfo.html'),
      link(scope, element) {
        ngLoadPromise.then(function(){

        });
      },
      controller($scope) {

        $scope.$watch('btoken', function(clientToken) {
          if (!clientToken) return
          if (braintree) {
            $scope.client = new braintree.api.Client({clientToken});
            // client.tokenizeCard({number: "4111111111111111", expirationDate: "10/20"}, function (err, nonce) {
            //   // Send nonce to your server
            // });
            console.log('setup', $scope.client)
            $scope.card = {
              cardholderName: $scope.session.name,
              number:"4111111111111111",
              expirationMonth:"12",
              expirationYear: 2016,
              cardNickName: "Personal united visa"
            }

            // braintree.setup(token, "custom", {id: "cardinfoForm"});
          }

        })

        $scope.submit = (formValid, data) => {
          console.log('formValid', formValid, data)
          if (formValid)
          {
            console.log('isValid')
            $scope.client.tokenizeCard($scope.card, function (err, nonce) {
              console.log('isValid', err, nonce)
              var pm = { type: 'braintree', token: nonce, name: $scope.card.cardNickName, makeDefault: true }

              var err = (e) => console.log(e)
              var suc = (r) => console.log('suc', r)

              SessionService.addPaymethod(pm, suc, err)
              // Send nonce to your server
            });

            // SessionService.signup(data,
            //   (result) => {
            //   //$modalInstance.close();
            // },
            //   (e) => $scope.signupFail = e.error
            // )
          }
        }

      }
    };
  });
