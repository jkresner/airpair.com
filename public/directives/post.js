
angular.module("APPost", [])

  .directive('apPostListItem', ['$parse', function($parse) {
    
    return {
      restrict: 'E',
      template: require('./postListItem.html'),
      scope: {
        p: '=post'
      },
      link: function(scope, element, attrs) {
        scope.url = scope.p.url;
        scope.title = scope.p.title;
        scope.published = scope.p.published;
        scope.publishedFormat = moment(scope.p.published).format('d0 MMM, YYYY');
        scope.by = { 
          name: scope.p.by.name,                        
          avatar: scope.p.by.avatar };                        
        scope.meta = { description: scope.p.meta.description };                      
        scope.tags = scope.p.tags;  
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