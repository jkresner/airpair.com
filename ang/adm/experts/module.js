angular.module("ADMExperts", ['APDealsDirectives'])

.config((apRouteProvider) => {

  var route = apRouteProvider.route
  route('/adm/experts', 'Experts', require('./list.html'))
  route('/adm/experts/:id', 'Expert', require('./item.html'))
  route('/adm/experts/:id/deals', 'Deals', require('./deals.html'))

})

.directive('userInfo', () => {
  return { template: require('./userInfo.html'), scope: { info: '=info' } }
})

.directive('expertAvailability', () => {
  return {
    template: require('./availability.html'),
    controller($scope, $attrs) {
      console.log('$expertSettings.p')
    }
  }
})

.controller('ExpertsCtrl', ($scope, $location, AdmDataService, RequestsUtil, DateTime, MMDataService) => {

  $scope.selectExpert = (expert) =>
    $location.path(`/adm/experts/${expert._id}`)

  var setScope = (r) =>
    $scope.experts = r

  $scope.request = { type:'resources',
    tags:[{_id:"5149dccb5fc6390200000013",slug:'angularjs'}]
  }
  $scope.query = null
  $scope.newest = () => AdmDataService.experts.getNew({}, setScope)
  $scope.active = () => AdmDataService.experts.getActive({}, setScope)
  $scope.newest()

  $scope.$watch('request.tags', function(req) {
    if ($scope.request.tags.length < 1) return
    // console.log('req', $scope.request.tags)
    $scope.query = RequestsUtil.mojoQuery($scope.request)
    MMDataService.matchmaking.getRanked({_id:null, query:$scope.query}, function (experts) {
      $scope.experts = experts;
    })
  })
})

.controller('ExpertCtrl', ($scope, $routeParams, ServerErrors, AdmDataService, DataService) => {

  var _id = $routeParams.id

  var setScope = (r) => {
    $scope.expert = r
    $scope.data = r
  }

  $scope.fetch = () =>
    AdmDataService.experts.getBydId({_id}, setScope,
      ServerErrors.fetchFailRedirect('/adm/experts'))

  $scope.fetch()

  var setHistoryScope = (history) => {
    $scope.requests = history.requests
    $scope.bookings = history.bookings
  }

  DataService.experts.getHistory({_id}, setHistoryScope)
})


.controller('DealsCtrl', ($scope, $routeParams, ServerErrors, AdmDataService) => {

  var _id = $routeParams.id

  var setScope = (r) => {
    $scope.expert = r
    $scope.deals = r.deals
    $scope.selected = null
    $scope.expired = _.filter(r.deals,(d)=>d.expiry&&moment(d.expiry).isBefore(moment()))
    $scope.current = _.filter(r.deals,(d)=>d.expiry==null||moment(d.expiry).isAfter(moment()))
  }
  $scope.setScope = setScope

  AdmDataService.experts.getBydId({_id}, setScope,
    ServerErrors.fetchFailRedirect('/adm/experts'))

})
