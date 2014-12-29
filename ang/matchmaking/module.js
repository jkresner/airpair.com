var util = require('../../shared/util.js');
var requestsUtil = require('../../shared/requests.js');

angular.module("APMatchmaking", ["APProfileDirectives","APSvcMM"])

.config(function($locationProvider, $routeProvider) {

  $routeProvider.when('/matchmaking', {
    template: require('./list.html'),
    controller: 'MatchmakingCtrl'
  });

  $routeProvider.when('/matchmaking/:id', {
    template: require('./item.html'),
    controller: 'MatchingCtrl'
  });

})

.controller('MatchingCtrl', function($scope, $routeParams, $location, MMDataService, MessageFns, ServerErrors) {
  var errCB = ServerErrors.add

  $scope.request = {}
  $scope.select = {}

  $scope.highlightedTag = (tagId) => {
    return _.find($scope.focusTagIds,(id)=>id==tagId)
  }

  $scope.getMatches = () => {
    MMDataService.pipeline.getRequestMatches($scope.request._id, function (experts) {
      $scope.matches = experts;
      console.log('$scope.matches', $scope.matches.length)
    })
  }

  $scope.$watch('request', function(r) {
    if (!$scope.user) return
    var created = util.ObjectId2Moment(r._id)
    var submitted = (r.adm && r.adm.submitted) ? moment(r.adm.submitted) : false
    var meta = {
      created, submitted,
      moreThan1HourOld: (submitted) ? submitted.isBefore(moment().add('-1','hours')) : submitted,
      moreThan2HourOld: (submitted) ? submitted.isBefore(moment().add('-2','hours')) : submitted,
      moreThan1DayOld: (submitted) ? submitted.isBefore(moment().add('-1','days')) : submitted,
      moreThan2DayOld: (submitted) ? submitted.isBefore(moment().add('-2','days')) : submitted,
      shortBrief: r.brief.length < 100,
      okToDelete: r.suggested.length == 0,
      trustedLevel: ($scope.user.emailVerified) ?  1 : 0
    }
    if (submitted)
      meta.timeToSubmit = moment.duration(submitted.diff(created)).humanize()
    if (submitted && r.adm.received)
      meta.timeToReceived = moment.duration(submitted.diff(r.adm.received)).humanize()
    if (submitted && r.adm.reviewable)
      meta.timeToReviewable = moment.duration(submitted.diff(r.adm.reviewable)).humanize()

    meta.timeToCancelFromWaiting = r.status == 'waiting' && meta.moreThan1DayOld
    meta.trustedLevel += ($scope.user.googleId) ? 1 : 0
    $scope.meta = meta
    $scope.focusTagIds = _.pluck(r.tags,'_id')
  })


  MMDataService.pipeline.getRequest($routeParams.id, function (r) {
    $scope.user = r.user
    $scope.request = r
    $scope.getMatches()
  },
    () => $location.path('/matchmaking')
  )

  $scope.addSuggestion = (expertId) => {
    var expert = _.find($scope.matches, (e) => e._id == expertId)
    MMDataService.pipeline.addSuggestion({_id:$scope.request._id, expertId}, function (r) {
      $scope.request = r
      $scope.matches = _.without($scope.matches, expert)
      $scope.selected = null
    }, errCB)
  }

  $scope.selectExpert = (expert) =>
  {
    MMDataService.pipeline.matchifyExpert({expertId:expert._id,requestId:$scope.request._id}, function(r) {
      $scope.selected = r
    })
  }

})


.controller('MatchmakingCtrl', function($scope, MMDataService) {

  MMDataService.pipeline.getWaiting((requests) => {
    var count = 1;
    _.each(requests, (r) =>
      r.created = util.ObjectId2Moment(r._id) )
    console.log('requests', requests.length)
    $scope.requests = requests
  })

})
