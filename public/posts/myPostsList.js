angular.module("APMyPostsList", [])

  .directive('apMyPostsList', function() {

    return {
      template: require('./myPostsList.html'),
      controller: function($scope) {
      }
    };

  })

;

