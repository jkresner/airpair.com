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


.controller('DashboardCtrl', function($scope, $location, DataService, SessionService, StaticDataService) {

  SessionService.onAuthenticated(function() {
    if (!$scope.session._id) $location.path(`/about`)

    if ($scope.session.tags && $scope.session.tags.length > 0) {
      // DataService.experts.getForDashboard({}, function(r) {
      //   $scope.experts = r
      // })
    }
  })

  $scope.posts = { newest: [StaticDataService.getNewestPost()] }

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
    link(scope, element, attrs) {
    }
  }
})
