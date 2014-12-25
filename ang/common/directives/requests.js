var util = require('../../../shared/util')

angular.module("APRequestDirectives", [])

.factory('RequestHelper', function requestHelperFactory(SessionService) {
  this.setRequestTagsFromSession = ($scope) =>
    SessionService.onAuthenticated(() => {
      if (!$scope.request || !$scope.request.tags) {
        $scope.request = {
          tags: _.first(_.map($scope.session.tags,(t)=>{
            t._id = t.tagId
            return t
        }),3) };
      }
    })

  return this
})

.factory('StepHelper', function StepHelper() {

  this.setDefaultState = (scope) => {
    scope.done = {
      type: false,
      tags: false,
      brief: false,
      experience: false,
      hours: false,
      time: false,
      budget: false,
      current: 'type'
    }
  }

  this.setUpdatedState = (scope, r) => {
    if (scope.done.current == 'type' && r && r._id)
    {
      scope.done.type = (r.type) ? true : false,
      scope.done.tags = (r.tags && r.tags.length > 0) ? true : false,
      scope.done.experience = (r.experience) ? true : false,
      scope.done.brief = (r.brief) ? true : false,
      scope.done.hours = (r.hours) ? true : false,
      scope.done.time = (r.time) ? true : false,
      scope.done.budget = (r.budget) ? true : false

      var current = 'submit'
      if (!scope.done.tags) current = 'tags'
      else if (!scope.done.experience) current = 'experience'
      else if (!scope.done.brief) current = 'brief'
      else if (!scope.done.hours) current = 'hours'
      else if (!scope.done.time) current = 'time'
      else if (!scope.done.budget) current = 'budget'
      scope.done.current = current
    }
  }

  return this;
})


.directive('requestProgress', function() {
  return {
    template: require('./requestProgress.html'),
    scope: false,
    controller($rootScope, $scope) {

      $scope.setCurrent = (step) => {
        $scope.done.current = step
      }

      $scope.stepClass = (step) => {
        if ($scope.done.current == step) return `${step} current`
        else if ($scope.done[step]) return `${step} done`
        return step
      }

    }
  }
})


.directive('requestProgressAdmin', function() {
  return {
    template: require('./requestProgressAdmin.html'),
    scope: { r: '=req' },
    link(scope, element, attrs) {},
    controller($scope, $attrs) {}
  }
})


.directive('request', function($timeout, ServerErrors, DataService, SessionService, StepHelper) {
  return {
    template: require('./request.html'),
    scope: true,
    controllerAs: 'RequestFormCtrl',
    controller($rootScope, $scope) {
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

      var setDoneCurrent = function(done, current) {
        $scope.save(done);
        if (!$scope.done[done])
          $scope.done[done] = true

        if (done == $scope.done.current)
          $scope.done.current = current
      }

      $scope.setType = function(val) {
        if ($scope.request) $scope.request.type = val
        else $scope.request = { type: val }
        setDoneCurrent('type', 'tags')
      }

      $scope.setTime = () => setDoneCurrent('time', 'budget')
      $scope.setHours = () => setDoneCurrent('hours', 'time')
      $scope.setBuget = () => setDoneCurrent('budget', 'submit')
      $scope.setExperience = () => setDoneCurrent('experience', 'brief')
      $scope.doneBrief = () => setDoneCurrent('brief', 'hours')
      $scope.doneTags = () => {
        setDoneCurrent('tags', 'experience')
        if (!$rootScope.session.tags || $rootScope.session.tags.length == 0)
          SessionService.tags($scope.request.tags, ()=>{},()=>{});
      }
      $scope.submit = () => setDoneCurrent('submit', 'submit')

      StepHelper.setDefaultState($scope);
      $scope.$watch('request', (r) => StepHelper.setUpdatedState($scope,r) );

      $scope.save = function(step) {
        if ($scope.request._id) {
          DataService.requests.update($scope.request, step, function(r) {
            $scope.request = r
            if (step == "submit") {
              if ($rootScope.emailVerified) window.location = '/billing'
              else window.location = `/review/${r._id}`
            }
          }, ServerErrors.add)
        } else {
          DataService.requests.create($scope.request, function(r) {
            $scope.request = r
          },
            ServerErrors.add)
        }
      }

      $scope.sendVerificationEmail = () =>
        DataService.requests.sendVerifyEmailByCustomer($scope.request,
          (r) => {
            $scope.emailAlerts = [{ type: 'success', msg: `To continue, use the verification link sent to ${r.by.email}` }]
            $scope.verificationSent = true
        },
          (e) => $scope.emailAlerts = [{ type: 'danger', msg: `${e.message}` }]
        )


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

    }
  };

})


.directive('requestAdmin', function() {
  return {
    template: require('./requestAdmin.html'),
    scope: true,
    controller($rootScope, $scope, StepHelper) {

      StepHelper.setDefaultState($scope);
      $scope.$watch('request', (r) => StepHelper.setUpdatedState($scope,r) );

    }
  }
})


.directive('requestListItem', function() {

  return {
    template: require('./requestListItem.html'),
    scope: { r: '=req' },
    link(scope, element, attrs) {},
    controller($scope, $attrs) {}
  };

})



.directive('requestReviewSummary', function() {

  return {
    template: require('./requestReviewSummary.html'),
    link(scope, element, attrs) {
    },
    controller($scope, $attrs) {
    }
  };

})
