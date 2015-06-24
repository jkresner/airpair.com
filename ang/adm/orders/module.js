angular.module("ADMOrders", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/orders', 'Orders', require('./list.html'))
  route('/adm/orders/:id', 'Order', require('./item.html'))

})

.controller('OrdersCtrl', function($scope, AdmDataService, OrdersUtil, DateTime) {

  $scope.query = {
    start:    DateTime.firstOfMonth(0),
    end:      DateTime.firstOfMonth(1),
    user:     { _id: '' }
  }

  var setScope = (r) => {
    $scope.orders = r
    $scope.summary = OrdersUtil.getOrdersListSummary(r)

    $scope.monthProjection = (DateTime.firstOfMonth(0).isSame($scope.query.start))
      ? moment().endOf('month').date() / moment().date() : null
  }

  $scope.selectUser = (user) => $scope.query.user = user
  $scope.fetch = () => AdmDataService.bookings.getOrders($scope.query,setScope)
  $scope.fetch()

})

.controller('OrderCtrl', function($scope, $routeParams, ServerErrors, AdmDataService) {

  var setScope = (r) =>
    $scope.order = r

  $scope.fetch = () =>
    AdmDataService.bookings.getOrder({_id:$routeParams.id}, setScope,
      ServerErrors.fetchFailRedirect('/adm/orders'))

  $scope.fetch()

})
