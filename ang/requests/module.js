var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives', 'APTagInput', 'APInputs'])

.config(function($locationProvider, $routeProvider) {

  var authd = resolver(['session']);

  var actions = {
    list:   { template: require('./list.html'), controller: 'RequestListCtrl' },
    create: { resolve: authd, template: require('./new.html'), controller: 'RequestCtrl' },
    edit: { resolve: authd, template: require('./edit.html'), controller: 'RequestEditCtrl' },
    // help: { resolve: authd, template: require('./types.html'), controller: 'RequestTypesCtrl' },
    review: { template: require('./review.html'), controller: 'ReviewCtrl' }
  };

  $routeProvider
    .when('/requests', actions.list)
    // .when('/help/types', actions.help)
    .when('/help/request', actions.create)
    .when('/find-an-expert', actions.create)
    .when('/hire-software-developers', actions.create)
    .when('/meet-experts', actions.create)
    .when('/help/request/:id', actions.edit)
    .when('/meet-experts/:id', actions.edit)
    // .when('/reviews', actions.review)
    .when('/review/:id', actions.review)

})

.run(function($rootScope, SessionService) {})


.controller('RequestListCtrl', function($scope, $location, DataService, SessionService) {

  SessionService.onAuthenticated(function() {
    if (!$scope.session._id) $location.path(`/`)
  })

  DataService.requests.getMyRequests({}, function(result) {
    $scope.requests = result
  })

})


.controller('RequestCtrl', function($rootScope, $scope, StaticDataService, RequestHelper) {
  //-- In case the come through from request scope from another page like review
  if ($scope.request) return window.location = '/help/request'

  $scope.customers = StaticDataService.getRecentCustomers();
  $scope.reviews = StaticDataService.getRecentReviews();

  RequestHelper.setRequestTagsFromSession($scope)

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



.controller('ReviewCtrl', function($scope, $routeParams, $location, $timeout, DataService, Shared, ServerErrors, SessionService, PageHlpr) {
  $scope.requestId = $routeParams.id;
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

    // console.log('$scope.session.primaryPayMethodId', $scope.session.primaryPayMethodId)

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
      if ($scope.isExpert) {
        var sug = r.suggested[0]

        console.log('sug', sug.expert, sug.expert.timezone)
        // if (!sug.expert.timezone)
          // window.location = `/be-an-expert?review=${window.location.pathname}`

        $scope.displayRate = sug.suggestedRate.expert
        $scope.notYetReplied = !sug.expertStatus || sug.expertStatus == 'waiting'
        if ($scope.notYetReplied)
        {
          $scope.data = {expertStatus:"",expertComment:"",expertAvailability:""}
          $scope.expertEdit = true;
        }
        else {
          var {expertStatus,expertComment,expertAvailability} = sug
          $scope.data = {expertStatus,expertComment,expertAvailability}
          $scope.expertEdit = false;
        }
        // console.log('$scope', $scope.isExpert, $scope.expertEdit, $scope.data, sug)
      }

      $timeout(function(){ PageHlpr.highlightSyntax({ addCtrs: false })}, 500)
    }

  }, function(er) {
    console.log('request not found')
  })


  $scope.setExpertEdit = () => $scope.expertEdit = true

  $scope.submit = (formValid, data) => {
    if (formValid)
    {
      if ($scope.data.expertStatus != 'available')
        $scope.data.expertAvailability = "Not available"

      var expertId = $scope.r.suggested[0].expert._id
      DataService.requests.replyByExpert($scope.r._id, expertId, $scope.data,
        (result) => {
          // $scope.r = result;
          // $scope.expertEdit = false;
          // console.log('$scope.expertEdit', $scope.expertEdit, $scope.isExpert)
          getReview();
      }, ServerErrors.add)
    }

  }

  getReview();

})
