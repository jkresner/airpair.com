var util = require('../../../shared/util.js');
var requestsUtil = require('../../../shared/requests.js');

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

.factory('MessageFns', function messageFnsFactory(AdmDataService, ServerErrors) {

  this.getMessageFns = function($scope) {
    var requestId = $scope.request._id
    var updateScope = (r) => $scope.request = r
    var send = (subject, body, type) => {
      var data = { type, requestId, subject, body }
      AdmDataService.pipeline.sendMesssage(data,updateScope,ServerErrors.add)
    }

    return {
      received: (s, b, t) => send(s, b, t),
      review: (s, b, t) => send(s, b, t),
      cancelfromwaiting: (s, b, t) => send(s, b, t),
    }
  }

  this.shouldSend = {
    received:(r) => r.status == 'received' && !_.find(r.messages,(msg) => msg.type == 'received'),
    review:(r) => r.status == 'review' && _.find(r.suggested,(s)=>s.expertStatus=='available') && !_.find(r.messages,(msg) => msg.type == 'review'),
    cancelfromwaiting:(r,m) => r.status == 'waiting' && m.timeToCancelFromWaiting && !_.find(r.messages,(msg) => msg.type == 'cancelfromwaiting'),
  }

  return this
})

.controller('RequestCtrl', function($scope, $routeParams, $location, AdmDataService, MessageFns, ServerErrors) {
  var updateScope = (r) => $scope.request = r
  var errCB = ServerErrors.add

  $scope.request = {}

  $scope.highlightedTag = (tagId) => {
    return _.find($scope.focusTagIds,(id)=>id==tagId)
  }

  $scope.updateExpertMatching = (expertId) => {
    AdmDataService.pipeline.matchifyExpert(expertId, function (expert) {
      console.log('expert', expert.name, expert.matching)
    })
  }

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
    $scope.focusTagIds = _.pluck(r.tags,'_id')
  })


  AdmDataService.pipeline.getRequest($routeParams.id, function (r) {
    $scope.user = r.user
    $scope.farmTweet = requestsUtil.buildDefaultFarmTweet(r)

    AdmDataService.billing.getUserPaymethods(r.userId, function (pms) {
      $scope.paymethods = (pms.btoken) ? [] : pms;
      $scope.request = r
      $scope.send = MessageFns.getMessageFns($scope)
      $scope.shouldSend = MessageFns.shouldSend
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
    }, errCB)


  $scope.addSuggestion = (expertId) => {
    var expert = _.find($scope.matches, (e) => e._id == expertId)
    AdmDataService.pipeline.addSuggestion({_id:$scope.request._id, expertId}, function (r) {
      $scope.request = r
      $scope.matches = _.without($scope.matches, expert)
    }, errCB)
  }

  $scope.removeSuggestion = (expertId) => {
    var data = { _id: $scope.request._id, expertId: expertId }
    AdmDataService.pipeline.removeSuggestion(data, updateScope, errCB)
  }

  $scope.update = () => {
    var status = $scope.request.status
    if (status == 'canceled' || status == 'completed' || status == 'junk')
      delete $scope.request.adm.active

    AdmDataService.pipeline.updateRequest($scope.request, updateScope, errCB)
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

  $scope.farm = (tweet) => {
    AdmDataService.pipeline.farm({requestId:$scope.request._id,tweet}, updateScope, errCB)
  }

  $scope.alertMessage = (msg) => alert(msg)
})


.controller('PipelineCtrl', function($scope, AdmDataService) {

  $scope.filterByLastTouch = function() {
    var sorted = _.sortBy($scope.requests.complete,(r)=>r.adm.lastTouch.utc)
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
      r.submitted = r.adm.submitted||r.created.format()
      // console.log('r.submitted', r.submitted)
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
