module.exports = function($scope, $routeParams, API, PAGE) {

  API(`/author/collaborations/${$routeParams.id}`, r =>
    PAGE.main($scope).setData(r, data => {
      $scope.post = data
      $scope.ui = { moreReviews: 3 - data.stats.reviews }
    })
  )

}
