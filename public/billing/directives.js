var ordersUtil = require('./../../shared/orders')


angular.module("APBillingDirectives", [])

.directive('transactionList', function() {

  return {
    template: require('./transactions.html'),
    link(scope, element, attrs) {
    },
    controller($scope) {
      $scope.$parent.$watch('orders', function(val) {
        $scope.transactions = ordersUtil.ordersToLinesWithRunningBalance($scope.orders)
        $scope.balance = $scope.transactions[0].runningBalance
      })
    }
  };

})

