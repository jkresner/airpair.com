angular.module("ADMPipeline", ["APRequestDirectives","APProfileDirectives"])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/pipeline', 'Pipeline', require('./list.html'))
  route('/adm/pipeline-2015', 'Pipeline2015', require('./2015.html'))
  route('/adm/pipeline-metrics', 'PipelineMetrics', require('./metrics.html'))
  route('/adm/pipeline/:id', 'Request', require('./item.html'))

})

.directive('requestRow', () =>
  _.extend({scope: { r: '=r' }}, { template: require('./row.html')})
)


.controller('RequestCtrl', function($scope, $routeParams, $location, AdmDataService, Util, RequestsUtil, DateTime) {
  var _id = $routeParams.id
  $scope.composeGeneric = false

  var setScope = (r) => {
    if (!$scope.paymethods) return
    var meta = RequestsUtil.calcMeta(r)
    meta.noPaymethod = $scope.paymethods.length < 1
    meta.trustedLevel += (meta.noPaymethod) ? 0 : 1
    if ($scope.user) {
      meta.trustedLevel = ($scope.user.emailVerified) ?  1 : 0
      meta.trustedLevel += ($scope.user.googleId) ? 1 : 0
    }

    (r.suggested || []).forEach((s)=>{
      var suggestedUtc = Util.ObjectId2Moment(s._id)
      s.suggestedAfter =
        moment.duration(meta.submitted.diff(suggestedUtc)).humanize()
      if (s.reply)
        s.reply.replyAfter = moment.duration(suggestedUtc.diff(s.reply.time)).humanize()
      // console.log('sug',meta.submitted,sug)
    })

    $scope.meta = meta
    $scope.request = r
    $scope.composeGeneric = false
    $scope.shouldSend = RequestsUtil.shouldSend(r, meta)
  }

  $scope.toggleComposeGeneric = () =>
    $scope.composeGeneric = !$scope.composeGeneric

  $scope.send = (subject, body, type) => {
    var data = { type, _id, subject, body }
    AdmDataService.pipeline.sendMesssage(data,setScope)
  }

  AdmDataService.pipeline.getRequest({_id}, function (r) {
    $scope.user = r.user
    $scope.farmTweet = RequestsUtil.buildDefaultFarmTweet(r)
    if (r.bookings)
      r.bookings.forEach((b)=>{
        var o = _.find(r.orders,(oo)=>oo._id == b.orderId)
        if (o && o.requestId == r._id) b.thisRequest = true
      })
    $scope.bookings = r.bookings
    delete r.bookings
    $scope.orders = r.orders
    delete r.orders
    $scope.requests = r.prevs
    delete r.prevs

    AdmDataService.billing.getUserPaymethods({_id:r.userId}, function (pms) {
      $scope.paymethods = pms
      setScope(r)
    })

    AdmDataService.getUsersViews({_id:r.userId}, function (views) {
      $scope.views = views.reverse()
    })

  },
    () => $location.path('/adm/pipeline')
  )

  $scope.delete = () =>
    AdmDataService.pipeline.deleteRequest({_id}, (r) =>
      $location.path('/adm/pipeline'))

  $scope.removeSuggestion = (expertId) =>
    AdmDataService.pipeline.removeSuggestion({_id, expertId}, setScope)

  $scope.update = () => {
    AdmDataService.pipeline.updateRequest(_.omit($scope.request,'user','prevs'), setScope)
  }

  $scope.junk = () => {
    $scope.request.adm.owner = $scope.session.email.substring(0,2)
    $scope.request.status = 'junk'
    $scope.update()
  }

  $scope.farm = (tweet) =>
    AdmDataService.pipeline.farm({_id,tweet}, setScope)

  $scope.alertMessage = (msg) => alert(msg)
})


.controller('PipelineCtrl', function($scope, AdmDataService, Util) {

  $scope.statusCss = (request) => {
    var css = ''
    if (moment(request.adm.lastTouch.utc).isBefore(moment().add(-5,'hours')))
      css += ' threehr'
    if (moment(request.adm.lastTouch.utc).isBefore(request.lastTouch.utc))
      css += ' nonadmtouch'
    if (moment(request.submitted).isBefore(moment().add(-96,'hours')))
      css += ' stale'
    return css
  }

  AdmDataService.pipeline.getActive((requests) => {
    var results = { nonadmtouch: [], threehr: [], other: [] }
    _.each(requests, (r) => {
      r.created = Util.ObjectId2Moment(r._id)
      r.submitted = r.adm.submitted||r.created.format()
      //-- Deal gracefully with v0
      if (!r.adm.owner && r.owner) r.adm.owner = r.owner
      if (!r.adm.lastTouch) r.adm.lastTouch = { utc: moment().add(-1, 'days').format() }
      if (!r.lastTouch) r.lastTouch = { utc: r.submitted }

      if (moment(r.adm.lastTouch.utc).isBefore(r.lastTouch.utc))
        results.nonadmtouch.push(r)
      else if (moment(r.adm.lastTouch.utc).isBefore(moment().add(-3,'hours')))
        results.threehr.push(r)
      else
        results.other.push(r)
    })

    results.nonadmtouch = _.sortBy(results.nonadmtouch,(rr)=>rr.lastTouch.utc)
    results.threehr = _.sortBy(results.threehr,(rr)=>rr.adm.lastTouch.utc)
    results.other = _.sortBy(results.other,(rr)=>rr.adm.lastTouch.utc)

    $scope.attentionCount = results.nonadmtouch.length + results.threehr.length
    $scope.isOrganized = $scope.attentionCount < 6

    $scope.requests = results
  })

})



.controller('Pipeline2015Ctrl', function($scope, AdmDataService, Util) {

  AdmDataService.pipeline.get2015({}, (requests) => {
    _.each(requests, (r) => {
      r.created = Util.ObjectId2Moment(r._id)
      r.submitted = (r.adm) ? r.adm.submitted : r.created.format()
    })
    $scope.requests = requests
  })

})


.controller('PipelineMetricsCtrl', function($scope, AdmDataService) {

  AdmDataService.pipeline.get2015({}, (requests) => {
    $scope.requests = requests
  })

    // var todays = [], incomplete = [], complete = [];
    // _.each(requests, (r) => {
    //   r.created = util.ObjectId2Moment(r._id)
    //   r.submitted = r.adm.submitted||r.created.format()
    //   // console.log('r.submitted', r.submitted)
    //   //-- Deal gracefully with v0
    //   if (!r.adm.owner && r.owner) r.adm.owner = r.owner
    //   if (!r.adm.lastTouch) r.adm.lastTouch = moment().add(-1, 'days').format()

    //   // console.log('r.created', r.created.format(), util.dateInRange(r.created, $scope.today, $scope.tomorrow))
    //   if (util.dateInRange(r.created, $scope.today, $scope.tomorrow)) todays.push(r)
    //   if (r.budget) {
    //     count = count+1
    //     r.num = count
    //     // console.log('complete', count, r._id, r.budget, r.adm.lastTouch)
    //     complete.push(r)
    //   }
    //   else incomplete.push(r)
    // })

    // var budgetCount=0, briefCount=0, tagsCount=0, typeCount=0;
    // for (var i=0;i<todays.length;i++)
    // {
    //   budgetCount += todays[i].budget ? 1 : 0
    //   briefCount += todays[i].brief ? 1 : 0
    //   tagsCount += (todays[i].tags.length > 0) ? 1 : 0
    //   typeCount += todays[i].type ? 1 : 0
    // }

    // $scope.requests = { todays, incomplete, complete }

    // console.log('setScope', requests.length, $scope.requests.complete.length, moment().diff(start,'milliseconds'))
    // $scope.requests = requestsUtil.sortByLastAdmTouch($scope.requests.complete)


    // $scope.todays = { budgetCount, briefCount, tagsCount, typeCount }

})




// .controller('PipelineIncompleteCtrl', function($scope, AdmDataService) {


// })
