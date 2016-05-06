angular.module("APDashboard", ['APFilters', 'APSvcSession',
  'APRequestDirectives', 'APTagInput', 'APInputs'])

.config(function($locationProvider, $routeProvider) {

  var actions = {
    list:   { template: require('./list.html'), controller: 'DashboardCtrl' }
  };

  $routeProvider
    .when('/home', actions.list)
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



.controller('DashboardCtrl', function($scope,  DataService, SessionService, BookingsUtil) {

  if (!$scope.session._id)
    return window.location = "/"

  $scope.util = BookingsUtil

  $scope.$watch('reqsAuthd', (granted) => {
    if (granted) {
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
    }
  })


})
