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


.controller('DashboardCtrl', function($scope, $location, DataService,
  SessionService, StaticDataService, BookingsUtil) {

  SessionService.onAuthenticated(function() {

    if (!$scope.session._id)
      return window.location = "/"

    $scope.util = BookingsUtil

    DataService.bookings.getBookings({}, (r) => {
      $scope.bookings = _.take(r,4)
    })

    DataService.requests.getMyRequests({}, (r) => {
      $scope.requests = r
    })

    var setSeen = (siteNotifications) => {
      $scope.seen = []
      siteNotifications.forEach((n)=>$scope.seen[n.name] = true)
    }

    SessionService.getSiteNotifications({}, setSeen)

    $scope.closeNotification = (name) =>
      SessionService.toggleSiteNotification({name}, setSeen)

    // if ($scope.session.tags && $scope.session.tags.length > 0) {
      // DataService.experts.getForDashboard({}, function(r) {
      //   $scope.experts = r
      // })
    // }
  })

})


.directive('dashboardStack', function() {
  return { template: require('./stack.html') }
})
.directive('dashboardBookmarks', function() {
  return { template: require('./bookmarks.html') }
})
.directive('dashboardPosts', function() {
  return { template: require('./posts.html') }
})
.directive('dashboardExperts', function() {
  return { template: require('./experts.html') }
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

