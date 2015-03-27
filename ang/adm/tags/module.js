angular.module("ADMTags", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/tags/:id', 'Tag', require('./item.html'))
  route('/adm/tags', 'Tags', require('./list.html'))

})

.controller('TagCtrl', ($scope, $routeParams, ServerErrors, AdminService) => {
  $scope.data = {}

  var setScope = function(r) {
    $scope.tag = r
    $scope.data = r
  }

  AdminService.tags.getById({slug:$routeParams.id}, setScope,
    ServerErrors.fetchFailRedirect('/adm/tags'))

  $scope.update = () =>
    AdmDataService.tags.updateTag($scope.data,setScope)

})

.controller('TagsCtrl', ($scope, AdmDataService) => {
  $scope.query = {
    term: ''
  }

  var setScope = (r) => {
    $scope.tags = r
  }

  AdmDataService.tags.getAllTags($scope.query,setScope)
})
