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

  $scope.getMatches = () => {
    MMDataService.pipeline.getRequestMatches({_id}, function (experts) {
      $scope.matches = experts;
      console.log('$scope.matches', $scope.matches.length)
    })
  }

  $scope.$watch('request', function(r) {
    if (!$scope.user) return
    $scope.meta = RequestsUtil.calcMeta(r)
    $scope.focusTagIds = _.pluck(r.tags,'_id')
  })


  MMDataService.pipeline.getRequest({_id}, function (r) {
    $scope.user = r.user
    $scope.request = r
    $scope.getMatches()
  },
    () => $location.path('/matchmaking')
  )

  $scope.addSuggestion = (expertId) => {
    var expert = _.find($scope.matches, (e) => e._id == expertId)
    MMDataService.pipeline.addSuggestion({_id, expertId}, function (r) {
      $scope.request = r
      $scope.matches = _.without($scope.matches, expert)
      $scope.selected = null
    })
  }

  $scope.selectExpert = (expert) =>
    MMDataService.pipeline.matchifyExpert({expertId:expert._id,requestId:_id}, function(r) {
      console.log('setting selected', r)
      $scope.selected = r
    })

})


.controller('MatchmakingCtrl', ($scope, MMDataService, Util) => {

  MMDataService.pipeline.getWaiting({}, (requests) => {
    var count = 1;
    _.each(requests, (r) =>
      r.created = Util.ObjectId2Moment(r._id) )
    console.log('requests', requests.length)
    $scope.requests = requests
  })

})
