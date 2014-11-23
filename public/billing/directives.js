var ordersUtil = require('./../../shared/orders')


angular.module("APBillingDirectives", [])

.directive('transactionList', function() {

  console.log('transactionslist', ordersUtil)

  return {
    template: require('./transactions.html'),
    link(scope, element, attrs) {
    },
    controller($scope) {
      $scope.$watch('orders', function(val) {
        $scope.transactions = ordersUtil.ordersToLinesWithRunningBalance($scope.orders)
      })
    }
  };

})

