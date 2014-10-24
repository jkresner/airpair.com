
angular.module('APTagInput', ['ui.bootstrap'])

  .value('acceptableTagsSearchQuery', function(value) {
    return value && (value.length >= 2 || /r/i.test(value));
  })

  .directive('tagInput', ['acceptableTagsSearchQuery', function(acceptableTagsSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./tagInput.html'),
      controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {

        $scope.getTags = function(q) {
          if (!acceptableTagsSearchQuery(q)) {
            return [];
          }

          return $http.get('v1/api/tags/search/'+q).then(function(res){
            var tags = [];
            angular.forEach(res.data, function(item){
              tags.push(item);
            });

            $scope.matches = tags;
            return tags;
          });
        };

        $scope.selectMatch = function (index) {
          var tag = $scope.matches[index]
          $scope.selectTag(tag)
          $scope.q = ""
        };

        $scope.deselectMatch = function (match) {
          this.deselectTag(match)
        };

      }]
    }
  }])

;
