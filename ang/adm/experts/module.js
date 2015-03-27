angular.module("ADMExperts", ['APRoutes'])

.config((apRouteProvider) => {

  var route = apRouteProvider.route
  route('/adm/experts', 'Experts', require('./list.html'))
  route('/adm/experts/:id', 'Expert', require('./item.html'))

})

.controller('ExpertsCtrl', ($scope, $location, AdmDataService, DateTime) => {

  // $scope.query = {
  //   user:     { _id: '' }
  // }

  $scope.selectExpert = (expert) =>
    $location.path(`/adm/experts/${expert._id}`)

  var setScope = (r) =>
    $scope.experts = r

  $scope.newest = () => AdmDataService.experts.getNew({}, setScope)
  $scope.active = () => AdmDataService.experts.getActive({}, setScope)
  $scope.newest()

})

.controller('ExpertCtrl', ($scope, $routeParams, ServerErrors, AdmDataService) => {

  var setScope = (r) =>
    $scope.expert = r

  $scope.fetch = () =>
    AdmDataService.experts.getBydId({_id:$routeParams.id}, setScope,
      ServerErrors.fetchFailRedirect('/adm/experts'))

  $scope.fetch()

})
