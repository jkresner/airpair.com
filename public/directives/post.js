var marked = require('marked');

angular.module("APPost", [])

  .directive('apPost', function() {
    
    return {
      template: require('./post.html'),
      controller: function($scope, PostsService) {  
      }
    };

  });