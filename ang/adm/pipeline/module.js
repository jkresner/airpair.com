var util = require('../../../shared/util.js');


angular.module("ADMPipeline", ["APRequestDirectives","APProfileDirectives"])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/adm/pipeline', {
      template: require('./list.html'),
      controller: 'PipelineCtrl'
    });

    $routeProvider.when('/adm/pipeline/:id', {
      template: require('./item.html'),
      controller: 'RequestCtrl'
    });

  })

  .controller('RequestCtrl', function($scope, $routeParams, $location, AdmDataService, ServerErrors) {

    $scope.request = {}

    $scope.getMatches = () => {
      AdmDataService.pipeline.getRequestMatches($scope.request._id, function (experts) {
        $scope.matches = experts;
        console.log('$scope.matches', $scope.matches.length)
      })
    }

    $scope.$watch('request.status', function() {
      if ($scope.request.status == 'waiting'
        && $scope.user.emailVerified)
        $scope.getMatches()
    })

    $scope.$watch('request', function(r) {
      if (!$scope.user || !$scope.paymethods) return
      var created = util.ObjectId2Moment(r._id)
      var submitted = (r.adm && r.adm.submitted) ? moment(r.adm.submitted) : false
      var meta = {
        created, submitted,
        moreThan1HourOld: (submitted) ? submitted.isBefore(moment().add('-1','hours')) : submitted,
        moreThan2HourOld: (submitted) ? submitted.isBefore(moment().add('-2','hours')) : submitted,
        moreThan1DayOld: (submitted) ? submitted.isBefore(moment().add('-1','days')) : submitted,
        moreThan2DayOld: (submitted) ? submitted.isBefore(moment().add('-2','days')) : submitted,
        shortBrief: r.brief.length < 100,
        okToDelete: r.suggested.length == 0,
        trustedLevel: ($scope.user.emailVerified) ?  1 : 0
      }
      if (submitted)
        meta.timeToSubmit = moment.duration(submitted.diff(created)).humanize()
      if (submitted && r.adm.received)
        meta.timeToReceived = moment.duration(submitted.diff(r.adm.received)).humanize()
      if (submitted && r.adm.reviewable)
        meta.timeToReviewable = moment.duration(submitted.diff(r.adm.reviewable)).humanize()

      meta.timeToCancelFromWaiting = r.status == 'waiting' && meta.moreThan1DayOld
      meta.trustedLevel += ($scope.user.googleId) ? 1 : 0
      meta.noPaymethod = $scope.paymethods.length < 1
      meta.trustedLevel += (meta.noPaymethod) ? 0 : 1
      $scope.meta = meta
    })


    AdmDataService.pipeline.getRequest($routeParams.id, function (r) {
      $scope.user = r.user

      AdmDataService.billing.getUserPaymethods(r.userId, function (pms) {
        $scope.paymethods = (pms.btoken) ? [] : pms;
        $scope.request = r
      })
      AdmDataService.getUsersViews({_id:r.userId}, function (views) {
        $scope.views = views.reverse()
      })
    },
      () => $location.path('/adm/pipeline')
    )

    $scope.delete = () =>
      AdmDataService.pipeline.deleteRequest($routeParams.id, function (r) {
        $location.path('/adm/pipeline')
      }, ServerErrors.add)


    $scope.addSuggestion = (expertId) => {
      var expert = _.find($scope.matches, (e) => e._id == expertId)
      AdmDataService.pipeline.addSuggestion({_id:$scope.request._id, expertId}, function (r) {
        $scope.request = r
        $scope.matches = _.without($scope.matches, expert)
      }, ServerErrors.add)
    }

    $scope.removeSuggestion = (expertId) =>
      AdmDataService.pipeline.removeSuggestion({_id:$scope.request._id, expertId}, function (r) {
        $scope.request = r
      }, ServerErrors.add)

    $scope.update = () => {
      var status = $scope.request.status
      if (status == 'canceled' || status == 'completed' || status == 'junk')
        delete $scope.request.adm.active

      AdmDataService.pipeline.updateRequest($scope.request, function (r) {
        $scope.request = r
      }, ServerErrors.add)
    }

    $scope.sentReceivedCallback = () => {
      $scope.request.adm.owner = $scope.session.email.substring(0,2)
      if ($scope.meta.trustedLevel > 1)
        $scope.request.status = 'waiting'
      $scope.update()
    }

    $scope.sentReviewCallback = () => {
      // TODO: add email to request object
      // $scope.update()
    }

    $scope.junk = () => {
      $scope.request.adm.owner = $scope.session.email.substring(0,2)
      $scope.request.status = 'junk'
      $scope.update()
    }

    $scope.selectExpert = (expert) =>
    {
      var existing = _.find($scope.request.suggested, (s)=>expert._id == s._id)
      if (!existing) $scope.addSuggestion(expert._id)
    }
  })


  .controller('PipelineCtrl', function($scope, AdmDataService) {

    $scope.filterByLastTouch = function() {
      var sorted = _.sortBy($scope.requests.complete,(r)=>r.adm.lastTouch)
      // console.log('filterByLastTouch', sorted[0].adm.lastTouch, sorted[1].adm.lastTouch)
      $scope.requests.complete = sorted
    }

    $scope.today = moment().startOf('day')
    $scope.tomorrow = moment().startOf('day').add(1,'days')

    var start = moment()
    AdmDataService.pipeline.getActive((requests) => {
      var count = 1;
      var todays = [], incomplete = [], complete = [];
      _.each(requests, (r) => {
        r.created = util.ObjectId2Moment(r._id)

        //-- Deal gracefully with v0
        if (!r.adm.owner && r.owner) r.adm.owner = r.owner
        if (!r.adm.lastTouch) r.adm.lastTouch = moment().add(-1, 'days').format()

        // console.log('r.created', r.created.format(), util.dateInRange(r.created, $scope.today, $scope.tomorrow))
        if (util.dateInRange(r.created, $scope.today, $scope.tomorrow)) todays.push(r)
        if (r.budget) {
          count = count+1
          r.num = count
          // console.log('complete', count, r._id, r.budget, r.adm.lastTouch)
          complete.push(r)
        }
        else incomplete.push(r)
      })

      var budgetCount=0, briefCount=0, tagsCount=0, typeCount=0;
      for (var i=0;i<todays.length;i++)
      {
        budgetCount += todays[i].budget ? 1 : 0
        briefCount += todays[i].brief ? 1 : 0
        tagsCount += (todays[i].tags.length > 0) ? 1 : 0
        typeCount += todays[i].type ? 1 : 0
      }

      $scope.todays = { budgetCount, briefCount, tagsCount, typeCount }
      $scope.requests = { todays, incomplete, complete }

      console.log('setScope', requests.length, $scope.requests.complete.length, moment().diff(start,'milliseconds'))
      $scope.filterByLastTouch()
    })

  })
