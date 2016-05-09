var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives', 'APTagInput', 'APInputs'])

.config(function($locationProvider, $routeProvider) {

  var authd = resolver(['session'])

  var actions = {
    list:   { resolve: authd, template: require('./list.html'), controller: 'RequestListCtrl' },
    create: { resolve: authd, template: require('./new.html'), controller: 'RequestCtrl' },
    edit: { resolve: authd, template: require('./edit.html'), controller: 'RequestEditCtrl' },
    review: { template: require('./job.html'), controller: 'JobCtrl' }
  };

  $routeProvider
    .when('/requests', actions.list)
    .when('/help/request', actions.create)
    .when('/find-an-expert', actions.create)
    .when('/hire-software-developers', actions.create)
    .when('/meet-experts', actions.create)
    .when('/help/request/:id', actions.edit)
    .when('/meet-experts/:id', actions.edit)
    .when('/review/:id', actions.review)
    .when('/job/:id', actions.review)

})


.controller('RequestListCtrl', function($scope, $location, DataService, SessionService) {

  DataService.requests.getMyRequests({}, function(result) {
    $scope.requests = result
  })

})


.controller('RequestCtrl', function($rootScope, $scope, DataService, RequestHelper) {
  //-- In case the come through from request scope from another page like review
  if ($scope.request) return window.location = '/help/request'
})


.controller('RequestEditCtrl', function($scope, $routeParams, $location, DataService, SessionService, Shared, ServerErrors) {
  var _id = $routeParams.id;

  if ($location.search().verify)
  {
    SessionService.verifyEmail({hash:$location.search().verify}, function(r) {
      if ($scope.request && r.email != $scope.request.by.email)
        $scope.request.by.email = r.email
    }, ServerErrors.add)
  }

  DataService.requests.getById({_id}, function(r) {
    if (r.budget)
    {
      var currentBudgets = [300,210,150,100,70]
      if (!_.find(currentBudgets,(b)=> r.budget==b)) {
        $scope.existingBudget = r.budget
        $scope.nonCurrentBudget = true
      }
    }

    if (!Shared.roles.request.isCustomerOrAdmin($scope.session, r))
      $location.path('/')
    else
      $scope.request = r
  }, function(er) {
    $location.path('/help/request')
  })

})



.controller('JobCtrl', function($scope, $routeParams, $timeout, DataService, Shared, SessionService, PageHlpr) {
  $scope.requestId = $routeParams.id

  if (!$scope.requestId || !$scope.job) return window.location = '/'

  $scope.r = $scope.job
  $scope.isAnon = $scope.r.view == 'anon'
  $scope.replies = null
  if ($scope.r.suggested) $scope.replies =
    _.filter($scope.r.suggested,(s)=>s.expertComment!=null)

  if ($scope.r.view == 'customer' || $scope.r.view == 'admin') {
    $scope.displayRate = $scope.r.budget
    $scope.data = {} // to collect location / timezone
    $scope.updateLocation = $scope.updateLocation = (locationData) => {
      SessionService.changeLocationTimezone(locationData, (r)=> {})
    }
  }
  else
  {
    if ($scope.r.status == 'canceled' || $scope.r.status == 'complete')
      $scope.reviewClass = 'inactive'

    if ($scope.r.status == 'booked')
      $scope.reviewClass = 'inactive booked'

    $timeout(function(){ PageHlpr.highlightSyntax({ addCtrs: false })}, 500)
  }

})
