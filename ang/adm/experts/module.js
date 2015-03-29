angular.module("ADMExperts", ['APRoutes'])

.config((apRouteProvider) => {

  var route = apRouteProvider.route
  route('/adm/experts', 'Experts', require('./list.html'))
  route('/adm/experts/:id', 'Expert', require('./item.html'))

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

.controller('ExpertsCtrl', ($scope, $location, AdmDataService, DateTime) => {

  $scope.selectExpert = (expert) =>
    $location.path(`/adm/experts/${expert._id}`)

  var setScope = (r) =>
    $scope.experts = r

  $scope.newest = () => AdmDataService.experts.getNew({}, setScope)
  $scope.active = () => AdmDataService.experts.getActive({}, setScope)
  $scope.newest()

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
