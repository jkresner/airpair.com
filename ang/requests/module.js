var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives', 'APTagInput', 'APInputs'])

.config(function($locationProvider, $routeProvider) {

  var authd = resolver(['session'])

  var actions = {
    list:   { resolve: authd, template: require('./list.html'), controller: 'RequestListCtrl' },
    create: { resolve: authd, template: require('./new.html'), controller: 'RequestCtrl' },
    edit: { resolve: authd, template: require('./edit.html'), controller: 'RequestEditCtrl' },
    review: { template: require('./review.html'), controller: 'ReviewCtrl' }
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
      $location.path('/dashboard')
    else
      $scope.request = r
  }, function(er) {
    $location.path('/help/request')
  })

})



.controller('ReviewCtrl', function($scope, $routeParams, $timeout, DataService, Shared, SessionService, PageHlpr) {
  $scope.requestId = $routeParams.id
  $scope.returnTo = window.location.pathname

  if (!$scope.requestId) return $location.path('/')

  if ($scope.session && $scope.session.authenticated == false) {
    $scope.r = $scope.request
    $scope.isAnon = true
    $scope.reviewClass = 'anon'
    $scope.r.by.name = "Login to view more detail"
    return
  }

  var getReview = () => DataService.requests.getReviewById($scope.requestId, function(r) {
    $scope.r = r
    $scope.isAdmin = Shared.roles.isAdmin($scope.session)
    $scope.isCustomer = Shared.roles.request.isCustomer($scope.session,r)
    $scope.replies = _.filter(r.suggested,(s)=>s.expertComment!=null)

    if ($scope.isCustomer) { // || $scope.isAdmin
      $scope.displayRate = r.budget

      // if (!$scope.session.emailVerified)
        // $scope.reviewClass = 'verifyEmail'
      // else (!$scope.session.primaryPayMethodId)
        // $scope.reviewClass = 'addPayMethod'

      $scope.data = {} // to collect location / timezone
      $scope.updateLocation = $scope.updateLocation = (locationData) => {
        SessionService.changeLocationTimezone(locationData, (r)=> {})
      }
    }
    else
    {
      if (r.status == 'canceled' || r.status == 'complete')
        $scope.reviewClass = 'inactive'

      if (r.status == 'booked')
        $scope.reviewClass = 'inactive booked'

      $scope.isExpert = Shared.roles.request.isExpert($scope.session,r)
      if ($scope.isExpert)
        window.location = `https://consult.airpair.com/job/${requestId}`

      $timeout(function(){ PageHlpr.highlightSyntax({ addCtrs: false })}, 500)
    }

  }, function(er) {
    console.log('request not found')
  })


  getReview();

})
