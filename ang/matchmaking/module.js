angular.module("APMatchmaking", ["APProfileDirectives","APSvcMM"])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/matchmaking', 'Matchmaking', require('./list.html'))
  route('/matchmaking/:id', 'Matching', require('./item.html'))

})

.controller('MatchingCtrl', ($scope, $routeParams, $location, MMDataService, RequestsUtil) => {
  var _id = $routeParams.id
  $scope.request = {}
  $scope.select = {}

  $scope.highlightedTag = (tagId) =>
    _.find($scope.focusTagIds,(id)=>id==tagId)

  $scope.getMatches = (request) => {
    var query = RequestsUtil.mojoQuery(request)
    MMDataService.matchmaking.getRanked({_id, query}, function (experts) {
      $scope.matches = experts;
      // console.log('$scope.matches', $scope.matches.length)
    })
  }

  $scope.$watch('request', function(r) {
    if (!$scope.user) return
    $scope.meta = RequestsUtil.calcMeta(r)
    $scope.focusTagIds = _.pluck(r.tags,'_id')
  })


  MMDataService.matchmaking.getRequest({_id}, function (r) {
    $scope.user = r.user
    $scope.request = r
    $scope.getMatches(r)
  },
    () => $location.path('/matchmaking')
  )

  $scope.addSuggestion = (expertId) => {
    var expert = _.find($scope.matches, (e) => e._id == expertId)
    var msg = $scope.selected.suggest
    MMDataService.matchmaking.addSuggestion({_id, expertId, msg}, function (r) {
      $scope.request = r
      $scope.matches = _.without($scope.matches, expert)
      $scope.selected = null
    })
  }

  $scope.selectExpert = (expert) =>
    MMDataService.matchmaking.matchifyExpert({expertId:expert._id,requestId:_id}, function(r) {
      $scope.selected = r
    })

})


.controller('MatchmakingCtrl', ($scope, MMDataService, Util) => {

  MMDataService.matchmaking.getWaiting({}, (requests) => {
    var count = 1;
    _.each(requests, (r) =>
      r.created = Util.ObjectId2Moment(r._id) )
    // console.log('requests', requests.length)
    $scope.requests = requests
  })

})
