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

})
