
angular.module("ADMOrders", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/orders', {
      template: require('./list.html'),
      controller: 'OrdersCtrl as orders'
    });

  })

  .controller('OrdersCtrl', function($scope, AdmDataService) {

    var startQuery = moment(moment().format('YYYY MMM'), 'YYYY MMM')
    var endQuery = moment(startQuery).add(1,'months')

    $scope.selectedUser = {}
    $scope.query = {
      start: startQuery,
      end: endQuery,
      user: { _id: '' }
    }

    var setScope = (r) => {
      $scope.orders = r
      var summary = { total: 0, byCount: 0, profit: 0, count: r.length }
      var customers = {}
      for (var i = 0;i<r.length;i++) {
        summary.total += r[i].total
        summary.profit += r[i].profit
        if (!customers[r[i].userId]) {
          summary.byCount += 1
          customers[r.userId] = true
        }
        // summary.time += r[i].minutes
      }
      $scope.summary = summary
    }

    $scope.fetch = () => AdmDataService.bookings.getOrders($scope.query,setScope)
    $scope.selectUser = (user) => $scope.query.user = user
    $scope.fetch()
  })
