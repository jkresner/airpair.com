angular.module("APDashboard", ['APFilters', 'APSvcSession',
  'APRequestDirectives', 'APTagInput', 'APInputs'])

.config(function($locationProvider, $routeProvider) {

  var actions = {
    list:   { template: require('./list.html'), controller: 'DashboardCtrl' }
  };

  $routeProvider
    .when('/', actions.list)
    .when('/dashboard', actions.list)
})

.directive('dashboardRebook', function(Util) {
  return { template: require('./rebook.html'),
    controller($scope) {
      $scope.firstName = Util.firstName
    }
  }
})
.directive('dashboardRequests', function() {
  return {
    restrict: 'E',
    template: require('./requests.html'),
  }
})
.directive('dashboardBookings', function() {
  return {
    restrict: 'E',
    template: require('./bookings.html'),
  }
})


.controller('DashboardCtrl', function($scope, $location, DataService,
  SessionService, StaticDataService, BookingsUtil) {

  SessionService.onAuthenticated(function() {

    if (!$scope.session._id)
      return window.location = "/"

    $scope.util = BookingsUtil

    DataService.bookings.getBookings({}, (r) => {
      $scope.bookings = _.take(r,4)
      var rebookings = {}
      r.forEach((b)=>{
        if (!rebookings[b.expertId]) rebookings[b.expertId] = b
      })
      $scope.rebookings = _.values(rebookings)
    })

    DataService.requests.getMyRequests({}, (r) => {
      $scope.requests = r
    })

    var setSeen = (r) => {
      $scope.seen = []
      r.forEach((n)=>$scope.seen[n.name] = true)
    }

  })

})



