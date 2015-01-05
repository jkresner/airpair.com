
angular.module('APTagInput', ['ui.bootstrap'])

  .value('badTagsSearchQuery', function(value) {
    var lengthOk = value && (value.length >= 2 || /r/i.test(value));
    var regexMatch = /\[|\]|\{|\}/g.test(value);
    var searchBad = !lengthOk || regexMatch;
    angular.element('.tag-input-group').toggleClass('has-error',searchBad)
    return searchBad;
  })

  .directive('tagInput', function(badTagsSearchQuery) {

    return {
      restrict: 'EA',
      template: require('./tagInput.html'),
      scope: {
      },
      controller: function($scope, $attrs, $http) {

        $scope.tags = $scope.$parent.tags
        $scope.selectTag = $scope.$parent.selectTag
        $scope.deselectTag = $scope.$parent.deselectTag
        $scope.updateTags = $scope.$parent.updateTags
        $scope.sortSuccess = $scope.$parent.sortSuccess
        $scope.sortFail = $scope.$parent.sortFail

        //-- stupid broken angular ui, this fixes it though
        $scope.templateUrl = "tagMatch.html"

        $scope.getTags = function(q) {
          if (badTagsSearchQuery(q)) {
            return [];
          }

          q = encodeURIComponent(q);
          return $http.get('/v1/api/tags/search/'+q).then(function(res){
            var tags = [];
            angular.forEach(res.data, function(item){
              tags.push(item);
            });

            $scope.matches = tags;
            return tags;
          });
        };

        $scope.keypressSelect = function(val) {
          if (!val || $scope.matches.length == 0) return null;
          $scope.selectMatch(0);
        }

        $scope.selectMatch = function (index) {
          var tag = $scope.matches[index]
          $scope.selectTag(tag)
          $scope.q = ""
        };

        $scope.deselectMatch = function (match) {
          $scope.deselectTag(match)
        };

      }
    }
  })

;
