
angular.module("ADMBookings", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/adm/bookings', {
      template: require('./list.html'),
      controller: 'BookingsCtrl'
    });

    $routeProvider.when('/adm/bookings/:id', {
      template: require('./item.html'),
      controller: 'BookingCtrl'
    });

  })


  .controller('BookingCtrl', function($scope, $routeParams, $location, AdmDataService, ServerErrors) {
    $scope.booking = {}

    AdmDataService.bookings.getBooking($routeParams.id, function (r) {
      $scope.booking = r
      console.log('$scope.booking', $scope.booking)
    },
      () => $location.path('/adm/bookings')
    )

    // $scope.update = () => {
    //   AdmDataService.pipeline.updateBooking($scope.booking, function (r) {
    //     $scope.booking = r
    //   }, ServerErrors.add)
    // }
  })

  .controller('BookingsCtrl', function($scope, AdmDataService) {

    $scope.selectedUser = {}
    $scope.query = { start: moment().add(-15,'day'), end: moment().add(15,'day') }

    console.log('BookingsCtrl', $scope.query)

    AdmDataService.bookings.getBookings($scope.query, function (r) {
      $scope.bookings = r
    })


    // $scope.user = () => { return $scope.post.by }
    // $scope.selectUser = (user) => {
    //   $scope.selectedUser = user
    //   // AdmDataService.getUsersBookings($scope.selectedUser, function (r) {
    //   //   $scope.bookings = r
    //   // })
    // }

  })
