angular.module("ADMTags", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/tags/:id', 'Tag', require('./item.html'))
  route('/adm/tags', 'Tags', require('./list.html'))

})

.controller('TagCtrl', ($scope, $routeParams, ServerErrors, AdmDataService) => {
  $scope.data = {}

  var setScope = function(r) {
    if (!r.meta) r.meta = {}
    $scope.data = r
  }

  AdmDataService.tags.getById({_id:$routeParams.id}, setScope,
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
