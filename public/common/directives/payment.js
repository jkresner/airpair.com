angular.module("APPaymentDirectives", ['angularLoad','APSvcBilling'])

  .directive('paymentInfo', function(angularLoad, BillingService) {

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

            // console.log('card', $scope.card)

          })

          $scope.submit = (formValid, data) => {
            if (formValid)
            {
              // console.log('isValid', $scope.card)
              $scope.client.tokenizeCard(_.pick($scope.card,'cardholderName','number','expirationMonth','expirationYear'), function (err, nonce) {
                // console.log('isValid', err, nonce)
                if (nonce)
                {
                  var pm = { type: 'braintree', token: nonce, name: $scope.card.cardNickName, makeDefault: true }

                  var err = (e) => console.log(e)
                  var suc = (r) => {
                    if (!$scope.paymethods) $scope.paymethods = [r]
                    else $scope.paymethods = _.union($scope.paymethods,[r])
                  }

                  BillingService.billing.addPaymethod(pm, suc, err)
                }
              });
            }
          }

        });

      }
    };
  });
