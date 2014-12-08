
angular.module("ADMPosts", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/posts', {
      template: require('./list.html'),
      controller: 'PostsCtrl as posts'
    });

  })

  .directive('apPostListItem', function($parse) {
    return {
      template: require('./item.html'),
      link: function(scope, element, attrs) {
        scope.post = scope.$eval(attrs.post)
      }
    };
  })

  .controller('PostsCtrl', function($scope, PostsService, AdmDataService) {

    AdmDataService.getPosts(function (result) {
      $scope.recent = result;
    })

  })
