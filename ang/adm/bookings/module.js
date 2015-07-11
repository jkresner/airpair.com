angular.module("ADMBookings", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/bookings', 'Bookings', require('./list.html'))
  route('/adm/bookings/:id', 'Booking', require('./item.html'))

})

.controller('BookingCtrl', ($scope, $routeParams, AdmDataService, DataService, ServerErrors,
    Util, BookingsUtil, OrdersUtil) =>
{
  var _id = $routeParams.id
  $scope.data = {}
  $scope.util = BookingsUtil

  var setScope = function(r) {
    if (!r.participants) return
    if (r.sendGCal) delete r.sendGCal

    var scope = {
      previousDatetime: moment(r.datetime),
      data: {
        type: r.type,
        datetime: moment(r.datetime),
        status: r.status,
        notify: false,
        gcal: r.gcal
      },
      customers: BookingsUtil.customers(r),
      experts: BookingsUtil.experts(r),
      chatSyncOptions: r.chatSyncOptions,
      botMsgKeys: _.keys(r.botMsgs),
      chat: r.chat,
      request: r.request,
      order: r.order,
      booking: _.omit(r,'order','request','chat','chatSyncOptions','botMsgs')
    }

    if (r.order)
      scope.lineForPayout = OrdersUtil.lineForPayout(r.order)

    if (r.chatSyncOptions)
      scope.newGroupChat = BookingsUtil.chatGroup(r)

    angular.extend($scope, scope)

    if (r.botMsgs && $scope.botMsgKeys.length > 0) {
      console.log('got em')
      $scope.botMsgs = r.botMsgs
      $scope.setMsgTemplate($scope.botMsgKeys[0])
    }
  }

  AdmDataService.bookings.getBooking({_id}, setScope,
    ServerErrors.fetchFailRedirect('/adm/bookings'))

  $scope.datetimeChanged = (datetime) =>
    (datetime) ? !datetime.isSame($scope.previousDatetime) : true

  var updateBooking = (ups) =>
    AdmDataService.bookings.updateBooking(_.extend($scope.booking,ups), setScope)

  $scope.updateTime = (val) => updateBooking({datetime:val})
  $scope.updateStatus = (val) => updateBooking({status:val})
  $scope.addGcal = (val) => updateBooking({ sendGCal: { notify: val } })
  $scope.addYouTubeData = function(val){
    var youTubeId = Util.parseYouTubeId(val);
    AdmDataService.bookings.addYouTubeData({_id, youTubeId}, setScope)
  }

  $scope.deleteRecording = function(recordingId){
    AdmDataService.bookings.deleteRecording({_id, recordingId}, setScope)
  }

  $scope.releasePayout = () =>
    DataService.bookings.releasePayout({_id:$scope.order._id},(r) => {
      $scope.order = r
      $scope.lineForPayout = OrdersUtil.lineForPayout(r)
    })

  $scope.swapExpert = (suggestionId) => {
    var swap = {_id:$scope.booking._id,orderId:$scope.order._id,requestId:$scope.request._id,suggestionId}
    AdmDataService.bookings.cheatBookingExpertSwap(swap,setScope)
  }

  $scope.associateGroupChat = (type, providerId) => {
    var d = {_id,type,providerId}
    DataService.bookings.associateChat(d,setScope)
  }

  $scope.createGroupChat = (type) => {
    var d = {_id,type,groupchat:$scope.newGroupChat}
    DataService.bookings.createChat(d,setScope)
  }

  $scope.saveNote = (body) =>
    AdmDataService.bookings.saveNote({_id,body},setScope)

  $scope.setMsgTemplate = (key) => {
    $scope.slackMessage = $scope.botMsgs[key].text
    $scope.slackMessageTmpl = _.extend($scope.botMsgs[key],{key})
  }

  $scope.postChatMessage = (text) => {
    var d = _.extend($scope.slackMessageTmpl,{_id,text})
    AdmDataService.bookings.postChatMessage(d,setScope)
  }
})

.controller('BookingsCtrl', ($scope, AdmDataService, DateTime, BookingsUtil) => {
  $scope.util = BookingsUtil

  $scope.query = {
    start: moment().add(-15,'day'),
    end: moment().add(45,'day'),
    user: { _id: '' }
  }

  var setScope = (r) => {
    var bs = { upcoming: [], pending: [], other: [], minsOnAir: 0 }
    r.forEach((b)=>{
      if (DateTime.inRange(b.datetime, 'anHourAgo', 'in48hours')
            && b.status != 'canceled')
        bs.upcoming.push(b)
      if (b.status == 'pending')
        bs.pending.push(b)
      else
        bs.other.push(b)

      if (b.status == 'followup' || b.status == 'complete')
        bs.minsOnAir += b.minutes
    })
    $scope.bookings = bs
  }

  $scope.selectUser = (user) => $scope.query.user = user
  $scope.fetch = () => AdmDataService.bookings.getBookings($scope.query,setScope)
  $scope.fetch()
})
