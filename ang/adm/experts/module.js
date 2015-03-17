angular.module("ADMExperts", ['APRoutes'])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/experts', 'Experts', require('./list.html'))
  // route('/adm/experts/:id', 'Expert', require('./item.html'))

})

.controller('ExpertsCtrl', function($scope, AdmDataService, DateTime) {

  $scope.query = {
    // start:    DateTime.firstOfMonth(0),
    // end:      DateTime.firstOfMonth(1),
    user:     { _id: '' }
  }

  var setScope = (r) => {
    $scope.experts = r

    // var summary = { total: 0, byCount: 0, profit: 0, count: r.length }
    // var customers = {}
    // for (var i = 0;i<r.length;i++) {
    //   summary.total += r[i].total
    //   summary.profit += r[i].profit
    //   if (!customers[r[i].userId]) {
    //     summary.byCount += 1
    //     customers[r.userId] = true
    //   }
    // }

    // $scope.summary = summary
  }

  $scope.selectUser = (user) => $scope.query.user = user
  $scope.fetch = () => AdmDataService.experts.getNew({}, setScope)
  $scope.fetch()

})

// .controller('ExpertCtrl', function($scope, $routeParams, ServerErrors, AdmDataService) {

//   var setScope = (r) =>
//     $scope.order = r

//   $scope.fetch = () =>
//     AdmDataService.bookings.getOrder({_id:$routeParams.id}, setScope,
//       ServerErrors.fetchFailRedirect('/adm/experts'))

//   $scope.fetch()

// })
