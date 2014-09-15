angular.module("APPostsList", [])

  .directive('apPostsList', function() {
    
    return {
      template: require('./postsList.html'),
      controller: function($scope) {  
        console.log('in postsList')
      }
    };

  });
  