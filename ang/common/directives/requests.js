var util = require('../../../shared/util')

angular.module("APRequestDirectives", [])

.directive('request', function($timeout, ServerErrors, DataService, SessionService) {

  return {
    template: require('./request.html'),
    scope: true,
    link(scope, element, attrs) {

    },
    controllerAs: 'RequestFormCtrl',
    controller($rootScope, $scope, $element) {

      $scope.sortSuccess = function() {}
      $scope.sortFail = function() {}
      $scope.tags = () => $scope.request.tags ? $scope.request.tags : null;
      $scope.updateTags = (scope, newTags) =>
        $scope.request.tags = newTags;

      $scope.selectTag = function(tag) {
        var tags = $scope.request.tags;
        var updated = []
        if ( _.contains(tags, tag) ) updated = _.without(tags, tag)
        else updated = _.union(tags, [tag])
        if (updated.length > 3) return alert('You are allowed up to 3 tags for a request.')
        else
          for (var i=0;i<updated.length;i++) { updated[i].sort = i }

        $scope.request.tags = updated
      };

      $scope.deselectTag = (tag) =>
        $scope.request.tags = _.without($scope.request.tags, tag);

      $scope.tagsString = () =>
        util.tagsString($scope.request.tags)

      var setDone = (step) => $scope.done[step] = true
      var setCurrent = (step) => $scope.done.current = step
      var setDoneAndCurrent = (done, current) => {
        if (!$scope.done[done]) {
          var props = {
            type: 'request',
            step: done,
            location: window.location.pathname // $location.path() no good...
          };
          var trackEventName = 'Save'
          if (done == 'type' || done == 'submit') { trackEventName = "Request" }
          analytics.track(trackEventName, props);
          setDone(done);
        }
        if (done == $scope.done.current) {
          setCurrent(current);
        }
      }

      $scope.setCurrent = setCurrent;

      $scope.stepClass = (step) => {
        if ($scope.done.current == step) return `${step} current`
        else if ($scope.done[step]) return `${step} done`
        return step
      }

      $scope.setType = function(val) {
        if ($scope.request) $scope.request.type = val
        else $scope.request = { type: val }
        setDoneAndCurrent('type', 'tags')
      }

      $scope.setTime = () => setDoneAndCurrent('time', 'budget')
      $scope.setHours = () => setDoneAndCurrent('hours', 'time')
      $scope.setBuget = () => setDoneAndCurrent('budget', 'submit')
      $scope.setExperience = () => setDoneAndCurrent('experience', 'brief')
      $scope.doneBrief = () => setDoneAndCurrent('brief', 'hours')
      $scope.doneTags = () => {
        setDoneAndCurrent('tags', 'experience')
        if (!$rootScope.session.tags || $rootScope.session.tags.length == 0)
          SessionService.tags($scope.request.tags, ()=>{},()=>{});
      }

      // $timeout(() => {
      //   $scope.setType('mentoring')
      //   $scope.doneTags()
      //   $scope.request.experience = "beginner"
      //   $scope.setExperience()
      //   $scope.request.brief = "beginner"
      //   $scope.doneBrief()
      //   $scope.request.hours = "1"
      //   $scope.setHours()
      //   $scope.request.time = "rush"
      //   $scope.setTime()
      //   $scope.request.budget = "90"
      //   $scope.setBuget()
      // }, 300)

      $scope.$watch('request._id', function(val) {
        var done = (val) ? true : false
        $scope.done = {
          type: done,
          tags: done,
          brief: done,
          experience: done,
          hours: done,
          time: done,
          budget: done,
          current: (val) ? 'submit' : 'type'
        }
      })

      $scope.save = function() {
        if ($scope.request._id) {
          DataService.requests.update($scope.request, function() {
            analytics.track('Save', { type:'request', step: 'update' });
            $timeout(() => { window.location = '/dashboard'}, 250)
          }, ServerErrors.add)
        } else {
          DataService.requests.create($scope.request, function() {
            analytics.track('Save', { type:'request', step: 'submit' });
            if ($rootScope.emailVerified) $timeout(() => { window.location = '/billing'}, 250)
            else $timeout(() => { window.location = '/billing'}, 250)
          }
          , ServerErrors.add)
        }
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
