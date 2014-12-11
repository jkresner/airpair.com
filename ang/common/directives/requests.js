var util = require('../../../shared/util')

angular.module("APRequestDirectives", [])

.directive('request', function($timeout, ServerErrors, DataService) {

  return {
    template: require('./request.html'),
    scope: true,
    link(scope, element, attrs) {

    },
    controllerAs: 'RequestFormCtrl',
    controller($rootScope, $scope) {

      $scope.tags = () => $scope.request.tags ? $scope.request.tags : null;
      $scope.updateTags = (scope, newTags) =>
        $scope.request.tags = newTags;

      $scope.selectTag = function(tag) {
        var tags = $scope.request.tags;
        var updated = []
        if ( _.contains(tags, tag) ) updated = _.without(tags, tag)
        else updated = _.union(tags, [tag])
        if (updated.length > 3) return alert('You are allowed up to 3 tags for a request.')
        $scope.request.tags = updated
      };

      $scope.deselectTag = (tag) =>
        $scope.request.tags = _.without($scope.request.tags, tag);

      $scope.setDoneTags = function() {
        $scope.doneTags = true;
      }

      $scope.setType = function(val) {
        if ($scope.request)
          $scope.request.type = val
        else
          $scope.request = { type: val }
      }

      $scope.tagsString = function() {
        return util.tagsString($scope.request.tags)
      }

      // $scope.doneTags = true;

      $scope.done = function() {
        DataService.requests.create($scope.request, function() {
          if ($rootScope.emailVerified) $timeout(() => { window.location = '/billing'}, 250)
          else $timeout(() => { window.location = '/billing'}, 250)
        }
        , ServerErrors.add)
      }
    }
  };

})


.directive('requestListItem', function() {

  return {
    template: require('./requestListItem.html'),
    scope: {
        r: '=req'
    },
    link(scope, element, attrs) {
    },
    controller($scope, $attrs) {
    }
  };

})
