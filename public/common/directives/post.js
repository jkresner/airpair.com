
angular.module("APPost", [])

  .directive('apPostListItem', ['$parse', function($parse) {

    return {
      restrict: 'E',
      template: require('./postListItem.html'),
      link: function(scope, element, attrs) {
        scope.post = scope.$eval(attrs.post)
      }
    };

  }])

  .directive('apPost', function() {

    return {
      template: require('./post.html'),
      controller: function($scope,  $timeout, PostsService) {
        $timeout(function () {
          // Refactor this into a nicer angularjs way
          // console.log('DOM has finished rendering')
          postHlpr.highlightSyntax();
        }, 100);

      }
    };

  })

;
