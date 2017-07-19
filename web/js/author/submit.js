module.exports = function($scope, $routeParams, $timeout, $q, API, PAGE) {

  var MAIN = PAGE.main($scope)
  var _id = $routeParams.id

  var setScope = r => {
    // console.log('setScope', r)
    MAIN.toggleLoading(false)
    $scope.post = r
    if (r.submission)
      $scope.submission = r.submission
    else
      $scope.ui = { moreReviews: 3 - r.reviews.length }
  }

  var setScopeError =  e => {
    MAIN.toggleLoading(false)
    PAGE.ERR.clear()
    if (e.message.match('previously submitted'))
      API(`/author/forreview/${_id}`, setScope)
    else
      PAGE.ERR.addServerError(e)
  }


  API(`/author/submitting/${_id}`, setScope, setScopeError)

  function refresh() {
    API(`/author/submitting/${_id}?slug=${$scope.post.slug}`, setScope, setScopeError)
  }

  var timer = null
  $scope.refreshSubmission = () => {
    $scope.submission.valid = null
    if (timer) {
      $timeout.cancel(timer)
      timer = null
    }
    timer = $timeout(refresh, 2000)
  }

  $scope.submitDeferred = () => {
    var deferred = $q.defer()
    var slug = $scope.post.slug
    if (slug.length > 50) {
      alert('Use a slug smaller than 50 chars');
      $timeout(deferred.reject, 10)
    }
    else if (slug.indexOf('--') != -1){
      alert('Clean up that slug url! No double -- please :)');
      $timeout(deferred.reject, 10)
    }
    else {
      PAGE.ERR.clear()
      API(`/author/updatesubmit/${_id}`,
        $scope.post,
        r => {
          window.location = `/collaborate/${r._id}`
          deferred.resolve(r)
        },
        e => {
          deferred.reject(e)
        })
    }
    return deferred.promise
  }

}
