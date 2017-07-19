module.exports = function($scope, $routeParams, $q, API, PAGE) {

  var id = $routeParams.id

  $scope.submitDeferred = () => {
    var deferred = $q.defer()
    API(`/author/fork/${id}`, $scope.data,
      r => {
        window.location = `/editor/${id}`
        deferred.resolve(r)
      },
      e => {
        deferred.reject(e)
      })
  }

  API(`/author/forking/${id}`, r =>
    PAGE.main($scope).setData(r, data =>
      $scope.isOwner = data.by._id == $scope.session._id
    ))

}
