module.exports = function($scope, $routeParams, API, PAGE) {

  var _id = $routeParams.id

  var setScope = r => {
    $scope.post = r
  }

//   $scope.setPublishedOverride = () => {
//     if (!$scope.data.publishedOverride)
//       $scope.data.publishedOverride = $scope.post.published || moment().format()
//   }

//   $scope.user = () => { return $scope.post.by }
//   $scope.selectUser = (user) => {
//     $scope.post.by = {
//       userId: user._id,
//       name: user.name,
//       avatar: user.avatar,
//       bio: user.bio,
//       username: user.username
//     };
//     $scope.data.by = $scope.post.by
//   }

//   var setScope = (r) => {
//     var isAdmin =  _.contains($scope.session.roles, 'admin')
//     var isEditor =  _.contains($scope.session.roles, 'editor')
//     $scope.post = r
//     $scope.data = _.pick(r, '_id', 'meta', 'tmpl', 'by')
//     $scope.$watch('data.meta.description', (value) => $scope.data.meta.ogDescription = value )
//     $scope.$watch('data.meta.ogImage', (value) => $scope.post.meta.ogImage = value )
//     $scope.canPublish = r.reviews && r.reviews.length > 0 || isAdmin || isEditor
//     $scope.canPropagate = isAdmin || isEditor || !r.published
//     $scope.canChangeAuthor = isAdmin
//     $scope.canSetTemplate = isAdmin
//     $scope.canOverrideCanonical = isAdmin
//     $scope.headPropagated = (r.mdHEAD) ? r.md == r.mdHEAD : true
//   }


//   $scope.propagate = () =>
//     DataService.posts.propagateFromHEAD({_id}, setScope)

  $scope.submitPublish = (formValid, data, postPublishForm) => {
    if (formValid) {}

  }

  API(`/author/publishing/${_id}`, setScope)

}
