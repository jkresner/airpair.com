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

.factory('StepHelper', function StepHelper(DataService) {

  var getPayMethods = function(scope) {
    DataService.billing.getPaymethods({},(r) => {
      if (r.btoken) {
        scope.paymethods = null
        scope.btoken = r.btoken
      }
      else scope.paymethods = r
    })
  }

  var order = [
    'type',
    'tags',
    // 'experience',
    'brief',
    'time',
    'hours',
    'budget',
    'submit'  ]

  this.stepBack = (scope) => {
    var currentIdx = order.indexOf(scope.done.current)
    // console.log('current.back', scope.done.current, currentIdx, order[currentIdx-1])
    if (currentIdx > 0)
      scope.done.current = order[currentIdx-1]
  }

  this.canForward = (scope) => {
    var c = scope.done.current
    if (c == 'type') return scope.done.type
    if (c == 'tags') return scope.request.tags && scope.request.tags.length > 0
    // if (c == 'experience') return scope.request.experience
    if (c == 'brief') return scope.request.brief && scope.request.brief.length > 10
    if (c == 'hours') return scope.request.hours
    if (c == 'budget') return scope.request.budget
    if (c == 'submit') return false
    if (c == 'time') return scope.request.time &&
      (scope.request.time != 'rush' ||
      (scope.request.time == 'rush' && scope.paymethods && scope.paymethods.length > 0))
    return false
  }

  this.setDone = (scope, step) => {
    // console.log('setDone', step, scope.done.current)
    if (!scope.done[step])
      scope.done[step] = true

    // console.log('step', step)
    if (step == 'submit')
      window.location = `/review/${scope.request._id}`
    if (step == scope.done.current) {
      var currentIdx = order.indexOf(scope.done.current)
      if (this.canForward(scope)) {
        scope.done.current = order[currentIdx+1]
        scope.entercard = false
        if (scope.done.current == 'time')
          getPayMethods(scope)
      }
      else if (step == 'time') {
        if (scope.btoken != null) {
          scope.entercard = true
          scope.cardSubmitText = 'Save'
        }
      }
    }
  }

  this.stepForward = (scope) => {
    this.setDone(scope, scope.done.current)
  }

  this.setDefaultState = (scope) => {
    scope.done = {
      type: false,
      tags: false,
      brief: false,
      // experience: true,
      time: false,
      hours: false,
      budget: false,
      current: 'type'
    }
  }

  this.setUpdatedState = (scope, r) => {
    if (scope.done.current == 'type' && r && r._id)
    {
      scope.done.type = (r.type) ? true : false,
      scope.done.tags = (r.tags && r.tags.length > 0) ? true : false,
      // scope.done.experience = (r.experience) ? true : false,
      scope.done.brief = (r.brief) ? true : false,
      scope.done.hours = (r.hours) ? true : false,
      scope.done.time = (r.time) ? true : false,
      scope.done.budget = (r.budget) ? true : false
      scope.done.submit = (r.title) ? true : false

      var current = 'submit'
      if (!scope.done.tags) current = 'tags'
      // else if (!scope.done.experience) current = 'experience'
      else if (!scope.done.brief) current = 'brief'
      else if (!scope.done.hours) current = 'hours'
      else if (!scope.done.time) current = 'time'
      else if (!scope.done.budget) current = 'budget'
      else if (!scope.done.submit) current = 'submit'
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


.directive('request', function($timeout, ServerErrors, DataService,
  SessionService, StepHelper, Util, RequestsUtil) {

  return {
    template: require('./request.html'),
    scope: true,
    controllerAs: 'RequestFormCtrl',
    controller($rootScope, $scope) {
      $scope.sortSuccess = function() {}
      $scope.sortFail = function() {}
      $scope.tags = () => $scope.request.tags ? $scope.request.tags : null;
      $scope.updateTags = (scope, newTags) => $scope.request.tags = newTags;
      $scope.deselectTag = (tag) => $scope.request.tags = _.without($scope.request.tags, tag);
      $scope.tagsString = () => Util.tagsString($scope.request.tags)
      $scope.selectTag = function(tag) {
        var tags = $scope.request.tags
        var updated = []
        var existing = _.find(tags, (t) => t._id == tag._id)
        if (existing) updated = _.without(tags, existing)
        else updated = _.union(tags, [tag])
        if (updated.length > 3) return alert('You are allowed up to 3 tags for a request.')
        else
          for (var i=0;i<updated.length;i++) { updated[i].sort = i }
        $scope.request.tags = updated
      }

      $scope.save = function(step) {
        if ($scope.request._id)
          DataService.requests.update(_.extend({step:step}, _.clone($scope.request)), setScope)
        else
          DataService.requests.create($scope.request, setScope)
      }

      $scope.stepBack = () => StepHelper.stepBack($scope)
      $scope.canForward = () => StepHelper.canForward($scope)
      var stepForward = function(currentStep) {
        var update = currentStep!=null || !$scope.done[$scope.done.current]
        if (!currentStep) currentStep = $scope.done.current
        if (update || currentStep == 'brief')
          $scope.save(currentStep)
        StepHelper.setDone($scope, currentStep)
      }
      $scope.stepForward = stepForward

      $scope.$watch('request', (r) =>
        StepHelper.setUpdatedState($scope,r) )

      var setScope = function(r) {
        $scope.request = r
        if ($scope.done.current == 'submit' && $scope.request.title == null)
          $scope.request.title = RequestsUtil.defaultTitle($scope.request)
      }

      $scope.setType = function(val) {
        if ($scope.request) $scope.request.type = val
        else $scope.request = { type: val, experience: 'proficient' }
        stepForward('type')
      }

      $scope.setTime = () => stepForward('time')
      $scope.setBuget = () => stepForward('budget')
      // $scope.setExperience = () => {
      //   $scope.request.experience = 'proficient'
      //   stepForward('breif')
      // }
      $scope.setHours = () => {
        stepForward('hours')
      }

      $scope.doneTags = () => {
        stepForward('tags')
        if (!$rootScope.session.tags || $rootScope.session.tags.length == 0)
          SessionService.tags($scope.request.tags, ()=>{},()=>{});
      }
      $scope.submit = () => stepForward('submit')

      StepHelper.setDefaultState($scope)

      $scope.setPayMethods = function(val) {
        // console.log('setPayMethods', val)
        $scope.paymethods = [val]
        $scope.entercard = false
        this.stepForward()
      }

      $scope.exitcard = () => {
        $scope.entercard = false
        $scope.request.time = null
      }

      $scope.sendVerificationEmail = () =>
        DataService.requests.sendVerifyEmailByCustomer($scope.request,
          (r) => {
            $scope.emailAlerts = [{ type: 'success', msg: `To continue, use the verification link sent to ${r.by.email}` }]
            $scope.verificationSent = true
        },
          (e) => $scope.emailAlerts = [{ type: 'danger', msg: `${e.message}` }]
        )
    }
  };

})


.directive('requestWidget', function() {
  return {
    template: require('./requestWidget.html'),
    scope: { r: '=req' },
    controller($rootScope, $scope, StepHelper) {
    }
  }
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


.directive('requestListItem', function(DataService) {

  return {
    template: require('./requestListItem.html'),
    scope: { r: '=req' },
    link(scope, element, attrs) {},
    controller($scope, $element, $attrs) {
      $scope.deleteRequest = function(_id) {
        DataService.requests.deleteRequest({_id}, (r) =>
          $element.remove()
        )
      }
    }
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




.directive('requestGate', function(DataService, RequestHelper) {

  return {
    template: require('../../dashboard/gatevnext.html'),
    controller($rootScope, $scope, $attrs) {
      DataService.requests.getAuthd({}, function(r) {
        if (r.welcome) {
          $rootScope.reqsAuthd = true
          RequestHelper.setRequestTagsFromSession($scope)
        }
        else if (r.require == 'spend')
          $scope.topUp = true
        else if (r.require == 'location')
          $scope.setLoc = true
      })
    }
  };

})
