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


.controller('DashboardCtrl', function($scope, $location, DataService, SessionService) {

  SessionService.onAuthenticated(function() {
    if (!$scope.session._id) $location.path(`/about`)
  })

  DataService.requests.getMyRequests({}, function(result) {
    $scope.requests = result
  })

  var setSeen = (siteNotifications) => {
    $scope.seen = []
    siteNotifications.forEach((n)=>$scope.seen[n.name] = true)
  }

  SessionService.getSiteNotifications({}, setSeen)

  $scope.closeNotification = (name) =>
    SessionService.toggleSiteNotification({name}, setSeen)
})


.directive('dashboardStack', function() {

  return {
    restrict: 'E',
    template: require('./stack.html'),
    link(scope, element, attrs) {
    }
  }

})


.directive('dashboardRequests', function() {

  return {
    restrict: 'E',
    template: require('./requests.html'),
    link(scope, element, attrs) {
    }
  }

})
