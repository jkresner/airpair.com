angular.module("APPosts", ['APShare'])

.config(function(apRouteProvider) {

  var authd = apRouteProvider.resolver(['session'])
  var route = apRouteProvider.route

  route('/posts/tag/:tagslug', 'PostsTagList', require('./listTag.html'))
  route('/reactjs', 'PostsTagList', require('./listTag.html'))
  route('/python', 'PostsTagList', require('./listTag.html'))
  route('/node.js', 'PostsTagList', require('./listTag.html'))
  route('/ember.js', 'PostsTagList', require('./listTag.html'))
  route('/keen-io', 'PostsTagList', require('./listTag.html'))
  route('/rethinkdb', 'PostsTagList', require('./listTag.html'))
  route('/ionic', 'PostsTagList', require('./listTag.html'))
  route('/swift', 'PostsTagList', require('./listTag.html'))
  route('/android', 'PostsTagList', require('./listTag.html'))
  route('/ruby', 'PostsTagList', require('./listTag.html'))
})

.controller('PostsTagListCtrl', function($scope, $routeParams, $location, DataService) {
  console.log('PostsTagListCtrl')

  if ($routeParams.tagslug)
    $scope.tagslug = $routeParams.tagslug
  else
    $scope.tagslug = $location.url().replace('/','')

  DataService.posts.getTagsPosts({tagSlug:$scope.tagslug}, function (result) {
    $scope.tag = result.tag;
    $scope.tagposts = result.posts;
  })

})
