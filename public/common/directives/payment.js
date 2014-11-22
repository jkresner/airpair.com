angular.module("APPaymentDirectives", ['angularLoad','APSvcSession'])

  .directive('paymentInfo', function(angularLoad, SessionService) {

    var src = 'https://js.braintreegateway.com/v2/braintree.js';

    var ngLoadPromise = angularLoad.loadScript(src);

    return {
      template: require('./paymentInfo.html'),
      link(scope, element) {

      },
      controller($scope) {
        ngLoadPromise.then(function(){

          $scope.$watch('btoken', function(clientToken) {
            if (!clientToken || !braintree) return

            $scope.client = new braintree.api.Client({clientToken});

            console.log('setup', $scope.client)
            $scope.card = {
              cardholderName: $scope.session.name,
              number:"4111111111111111",
              expirationMonth:"12",
              expirationYear: 2016,
              cardNickName: "Personal united visa"
            }

          })

          $scope.submit = (formValid, data) => {
            console.log('formValid', formValid, data)
            if (formValid)
            {
              console.log('isValid', $scope.card)
              $scope.client.tokenizeCard(_.pick($scope.card,'cardholderName','number','expirationMonth','expirationYear'), function (err, nonce) {
                console.log('isValid', err, nonce)
                if (nonce)
                {
                  var pm = { type: 'braintree', token: nonce, name: $scope.card.cardNickName, makeDefault: true }

                  var err = (e) => console.log(e)
                  var suc = (r) => {
                    if (!$scope.paymethods) $scope.paymethods = [r]
                    else $scope.paymethods.push(r)
                  }

                  SessionService.addPaymethod(pm, suc, err)
                }
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

        });

      }
    };
  });
