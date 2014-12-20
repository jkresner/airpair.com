var resolver = require('./../common/routes/helpers.js').resolveHelper;

angular.module("APRequests", ['APFilters', 'APSvcSession',
  'APRequestDirectives',
  'APTagInput', 'APTypeAheadInputs'])

.config(function($locationProvider, $routeProvider) {

  var authd = resolver(['session']);

  $routeProvider.when('/', {
    template: require('./list.html'),
    controller: 'RequestListCtrl',
  });

  $routeProvider.when('/dashboard', {
    template: require('./list.html'),
    controller: 'RequestListCtrl',
  });


  $routeProvider.when('/help/request', {
    template: require('./new.html'),
    controller: 'RequestCtrl',
    resolve: authd
  });

  $routeProvider.when('/meet-experts', {
    template: require('./new.html'),
    controller: 'RequestCtrl',
    resolve: authd
  });

  $routeProvider.when('/help/types', {
    template: require('./types.html'),
    controller: 'RequestTypesCtrl'
  });

  $routeProvider.when('/help/request/:id', {
    template: require('./edit.html'),
    controller: 'RequestEditCtrl',
    resolve: authd
  });

  $routeProvider.when('/review/:id', {
    template: require('./review.html'),
    controller: 'ReviewCtrl',
  });

})

.run(function($rootScope, SessionService) {})


.controller('RequestListCtrl', function($scope, $location, DataService, SessionService) {

  SessionService.onAuthenticated(function() {
    if (!$scope.session._id) $location.path(`/about`)
  })

  DataService.requests.getMyRequests(function(result) {
    $scope.requests = result
  })

})


.controller('RequestCtrl', function($rootScope, $scope, SessionService) {

  angular.element('#side').addClass('collapse')

  SessionService.onAuthenticated(function() {
    if (!$scope.request || !$scope.request.tags)
      $scope.request = { tags: _.first($rootScope.session.tags,3) };
  })

})

.controller('RequestEditCtrl', function($scope, $routeParams, $location, DataService) {
  $scope.requestId = $routeParams.id;

  DataService.requests.getById($scope.requestId, function(result) {
    if (result.userId != $scope.session._id) $location.path('/dashboard')
    else $scope.request = result
  }, function(er) {
    $location.path('/help/request')
  })

})


.controller('RequestTypesCtrl', function($scope, $window) {

})

.controller('ReviewCtrl', function($scope, $routeParams, $location, DataService, Shared, ServerErrors) {

  $scope.requestId = $routeParams.id;

  if ($scope.session && $scope.session.authenticated == false) {
    $scope.r = $scope.request
    $scope.isAnon = true
    $scope.r.by.name = "Login to view more detail"
    $scope.returnTo = window.location.pathname
    return
  }

  DataService.requests.getReviewById($scope.requestId, function(r) {
    $scope.r = r
    // console.log('r.userId', r.userId, $scope.session)
    $scope.isCustomer = Shared.roles.request.isCustomer($scope.session,r)

    if ($scope.isCustomer) {
      $scope.displayRate = r.budget
    }
    else
    {
      $scope.isExpert = Shared.roles.request.isExpert($scope.session,r)
      if ($scope.isExpert) {
        var sug = r.suggested[0]
        $scope.displayRate = sug.suggestedRate.private.expert
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
