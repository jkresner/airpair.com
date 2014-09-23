
angular.module('APTagInput', ['ui.bootstrap'])


  .value('acceptableTagsSearchQuery', function(value) {
    return value && (value.length >= 2 || /r/i.test(value));
  })

  .directive('tagInput', ['acceptableTagsSearchQuery',
                     function(acceptableTagsSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./tagInput.html'),
      controller : ['$attrs', '$scope', '$http', function($attrs, $scope, $http) {

        $scope.getTags = function(q) {
          if (!acceptableTagsSearchQuery(q)) {
            return [];
          }
          
          return $http.get('v1/api/tags/search/'+q).then(function(res){
            var tags = [];
            angular.forEach(res.data, function(item){
              tags.push(item);
            });
            // console.log('val', q, tags.length)
            $scope.matches = tags;
            return tags;
          });
        };

        $scope.selectMatch = function (index) {
          var tag = $scope.matches[index]
          var tags = $scope.post.tags
          if ( _.contains(tags, tag) )
            $scope.post.tags = _.without(tags, tag)
          else 
            $scope.post.tags = _.union(tags, [tag])

          $scope.q = ""
        };

        $scope.deselectMatch = function (match) {
          $scope.post.tags = _.without($scope.post.tags, match)
        };

      }]
    }
  }])

;