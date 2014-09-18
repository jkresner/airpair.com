
angular.module("APPost", [])

  .directive('apPostListItem', ['$parse', function($parse) {
    
    return {
      restrict: 'E',
      template: require('./postListItem.html'),
      scope: {
        p: '=post'
      },
      link: function(scope, element, attrs) {
        // scope.p = $parse(attrs.post)(scope)
        // console.log('post', scope.p);
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
      controller: function($scope, PostsService) {  
      }
    };

  })


;