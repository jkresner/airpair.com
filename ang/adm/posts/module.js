angular.module("ADMPosts", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/posts', 'Posts', require('./list.html'))
  route('/adm/posts/all', 'AllPosts', require('./list.html'))

})

.directive('apPostListItem', function($parse) {
  return {
    template: require('./item.html'),
    link: function(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post)
    }
  };
})

.controller('PostsCtrl', function($scope, AdmDataService) {

  AdmDataService.posts.getNewlyTouched({}, function (result) {
    $scope.recent = result;
  })

})


.controller('AllPostsCtrl', function($scope, AdmDataService, DataService) {

  AdmDataService.posts.getAll({}, function (result) {
    $scope.recent = result;
  })

  $scope.delete = (_id) =>
    DataService.posts.deletePost({_id}, (r) => window.location = '/adm/posts/all')

})
