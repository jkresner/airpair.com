var customers = [
  {
    name: 'Nigel Tunnacliffe',
    review: 'Very knowledgable expert that could quickly get to the bottom of what I was trying to figure out. I\'ve asked for help from colleagues before, and it usually takes a lot longer to get to a solution.',
    avatar: '//pbs.twimg.com/profile_images/1107452397/For_twitter.jpg',
    youtubeId: '3Hb5WtvAK3c'
  },
  {
    name: 'Nicholas Jayanty',
    review: 'We got a lot done in a short amount of time.  I wish I had spent the money I spent on the Swift class I\'m taking at Art Center College of Design on AirPair.  Much better use of time and money.',
    avatar: '//0.gravatar.com/avatar/ae0ecff35e8b1e2e8f0caf1f638097bes?s=100',
    youtubeId: 'lI_JoAooPSo'
  },
  { name: 'David Anderton',
    review: 'I was paired with someone who could understand the issues I was facing and come alongside me to work out a solution together. At first I was a little concerned that it would just be handing over the controls to a pro, I couldn\'t have been more wrong. This was the perfect match of empathy and expert. Thanks guys.',
    avatar: '//media.licdn.com/mpr/mpr/shrink_200_200/p/4/005/05f/32d/21aecb1.jpg',
    youtubeId: 'WvCk9bG1OUw'
  },
]

var reviews = [
  {
    name: 'Timothy O\'Reilly',
    review: 'Exactly what I wanted and more. Michael Perranord is patient, great at explaining and didn\'t my mind dumb questions.',
    avatar: '//0.gravatar.com/avatar/03d7c69330facea80a0109b9154bceee?s=100',
    expertId: '53cfe315a60ad902009c5954'
  },
  {
    name: 'Nathan Clark',
    review: 'I had several ember.js question to which Michael Grassotti was able to help answer in a single hour. That\'s golden to me.',
    avatar: '//0.gravatar.com/avatar/b4ec694f9d955bee753559037aa1805a?s=100',
    expertId: '52267f2a7087f90200000008'
  }
]

var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives', 'APTagInput', 'APInputs'])

.config(function($locationProvider, $routeProvider) {

  var authd = resolver(['session']);

  var actions = {
    list:   { template: require('./list.html'), controller: 'RequestListCtrl' },
    create: { template: require('./new.html'), controller: 'RequestCtrl' },
    edit: { resolve: authd, template: require('./edit.html'), controller: 'RequestEditCtrl' },
    help: { resolve: authd, template: require('./types.html'), controller: 'RequestTypesCtrl' },
    review: { template: require('./review.html'), controller: 'ReviewCtrl' }
  };

  $routeProvider
    .when('/', actions.list)
    .when('/dashboard', actions.list)
    .when('/help/request', actions.create)
    .when('/meet-experts', actions.create)
    .when('/help/types', actions.help)
    .when('/help/request/:id', actions.edit)
    .when('/meet-experts/:id', actions.edit)
    .when('/reviews', actions.review)
    .when('/review/:id', actions.review)

})

.run(function($rootScope, SessionService) {})


.controller('RequestListCtrl', function($scope, $location, DataService, SessionService) {

  SessionService.onAuthenticated(function() {
    if (!$scope.session._id) $location.path(`/about`)
  })

  DataService.requests.getMyRequests({}, function(result) {
    $scope.requests = result
  })

})


.controller('RequestCtrl', function($rootScope, $scope, RequestHelper) {

  angular.element('#side').addClass('collapse')

  $scope.customers = customers;
  $scope.reviews = reviews;

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


.controller('RequestTypesCtrl', function($scope) {

})



.controller('ReviewCtrl', function($scope, $routeParams, $location, DataService, Shared, ServerErrors) {
  $scope.requestId = $routeParams.id;

  if (!$scope.requestId) return $location.path('/')

  if ($scope.session && $scope.session.authenticated == false) {
    $scope.r = $scope.request
    $scope.isAnon = true
    $scope.reviewClass = 'anon'
    $scope.r.by.name = "Login to view more detail"
    $scope.returnTo = window.location.pathname
    return
  }

  DataService.requests.getReviewById($scope.requestId, function(r) {
    $scope.r = r
    $scope.isAdmin = Shared.roles.isAdmin($scope.session)
    $scope.isCustomer = Shared.roles.request.isCustomer($scope.session,r)
    $scope.replies = _.where(r.suggested,(s)=>s.expertComment!=null)

    if (r.status == 'canceled' || r.status == 'completed')
      $scope.reviewClass = 'inactive'
    // console.log('$scope.session.primaryPayMethodId', $scope.session.primaryPayMethodId)

    if ($scope.isCustomer) { // || $scope.isAdmin
      $scope.displayRate = r.budget

      if (!$scope.session.emailVerified)
        $scope.reviewClass = 'verifyEmail'
      // else (!$scope.session.primaryPayMethodId)
        // $scope.reviewClass = 'addPayMethod'
    }
    else
    {
      if (r.status == 'booked')
        $scope.reviewClass = 'inactive booked'

      $scope.isExpert = Shared.roles.request.isExpert($scope.session,r)
      if ($scope.isExpert) {
        var sug = r.suggested[0]
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
    }

    $scope.setExpertEdit = () => $scope.expertEdit = true

    $scope.submit = (formValid, data) => {
      if (formValid)
      {
        if ($scope.data.expertStatus != 'available')
          $scope.data.expertAvailability = "Not available"

        var expertId = $scope.r.suggested[0].expert._id
        DataService.requests.replyByExpert($scope.r._id, expertId, $scope.data,
          (result) => {
            $scope.r = result;
            $scope.expertEdit = false;
        }, ServerErrors.add)
      }

    }

  }, function(er) {
    console.log('request not found')
  })


})


;
