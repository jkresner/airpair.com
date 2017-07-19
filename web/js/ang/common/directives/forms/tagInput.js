
angular.module('APTagInput', [])

  .value('badTagsSearchQuery', function(value) {
    var lengthOk = value && (value.length >= 2 || /r|c/i.test(value));
    var regexMatch = /\[|\]|\{|\}/g.test(value);
    var searchBad = !lengthOk || regexMatch;
    angular.element('.tag-input-group').toggleClass('has-error',searchBad)
    return searchBad;
  })

  .directive('tagInput', function(badTagsSearchQuery, DataService) {

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
          $scope.addErrorMsg = false
          $scope.none = null
          if (badTagsSearchQuery(q)) {
            return [];
          }

          q = encodeURIComponent(q);
          return $http.get('/v1/api/tags/search/'+q).then(function(res){
            var tags = [];
            angular.forEach(res.data, function(item) {
              if (item)
                tags.push(item)
            });

            $scope.matches = tags;
            if (tags.length == 0) $scope.none = decodeURIComponent(q)

            return tags;
          });
        };

        $scope.keypressSelect = function(val) {
          if (!val || $scope.matches.length == 0) return null;
          $scope.selectMatch(0);
        }

        $scope.selectMatch = function (index) {
          var tag = $scope.matches[index]
          if (tag) $scope.selectTag(tag)
          $scope.q = ""
        };

        $scope.deselectMatch = function (match) {
          $scope.deselectTag(match)
        };

        $scope.addTag = function(q) {
          $scope.adding = true
          DataService.tags.create({ tagfrom3rdparty: q }, function(tag) {
            $scope.adding = false
            if (tag) $scope.selectTag(tag)
            $scope.q = ""
          },
          function(e) {
            // console.log(e)
            $scope.adding = false
            $scope.addErrorMsg = true
          })
        };

      }
    }
  })

;
