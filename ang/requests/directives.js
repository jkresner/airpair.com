
angular.module("APRequestDirectives", [])

.directive('request', function() {

  return {
    template: require('./request.html'),
    scope: true,
    link(scope, element, attrs) {
      angular.element('#sideNav').addClass('collapse')
    },
    controllerAs: 'RequestFormCtrl',
    controller($rootScope, $scope) {

      if (!$scope.data || !$scope.data.tags)
        $scope.data = { tags: $rootScope.session.tags }

      $scope.tags = () => $scope.data.tags ? $scope.data.tags : null;
      $scope.updateTags = (scope, newTags) =>
        $scope.data.tags = newTags;

      $scope.selectTag = function(tag) {
        var tags = $scope.data.tags;
        if ( _.contains(tags, tag) ) $scope.data.tags = _.without(tags, tag)
        else $scope.data.tags = _.union(tags, [tag])
      };

      $scope.deselectTag = (tag) =>
        $scope.data.tags = _.without($scope.data.tags, tag);

      $scope.setDoneTags = function() {
        $scope.doneTags = true;
      }

    }
  };

})

