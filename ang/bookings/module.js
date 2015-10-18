angular.module("APBookings", [])

.config(function(apRouteProvider) {

  var authd = apRouteProvider.resolver(['session'])
  var route = apRouteProvider.route
  // route('/bookings', 'Bookings', require('./list.html'), { resolve: authd })
  route('/bookings/:id', 'Booking', require('./item.html'), { resolve: authd })
  route('/booking/:id', 'Booking', require('./item.html'), { resolve: authd })
})

.controller('BookingCtrl', ($scope, $routeParams, DataService, ServerErrors, BookingsUtil, OrdersUtil, Util, Roles) => {
  var _id = $routeParams.id
  $scope.data = {}
  $scope.util = BookingsUtil

  var setScope = function(r) {
    if (!r.participants) return

    var hangoutReadyDate = moment(r.datetime).add(-12,"minutes")
    var endDate = moment(r.datetime).add(r.minutes,'minutes')
    var hangoutState = {};
    if (Util.dateInRange(moment(), hangoutReadyDate, endDate)){
      hangoutState.inProgress = true
    } else if (moment().isBefore(hangoutReadyDate)){
      hangoutState.none = true
    } else {
      hangoutState.complete = true
    }

    var isCustomer = Roles.booking.isCustomer($scope.session,r)
    var isExpert = Roles.booking.isExpert($scope.session,r)


    if (isCustomer && r.status == 'pending' && r.order.released)
      r.status = 'complete'
    else if (isExpert && r.order.paidout && r.status == 'pending')
      r.status = 'complete'

    var meSlack = BookingsUtil.meSlack(r,$scope.session._id)

    var scope = {
      first: Util.firstName,
      slackinInviteUrl: meSlack ? null : BookingsUtil.slackinUrl(r.slackin.host,$scope.session),
      isCustomer,
      isExpert,
      newTime: null,
      hangoutState: hangoutState,
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
      firstExpert: BookingsUtil.experts(r)[0],
      multitime: BookingsUtil.multitime(r),
      suggestedTimes: (r.status == "pending") ? BookingsUtil.suggestedTimesInflate(r,$scope.session.timeZoneId) : [],
      timeToBookNextPair: BookingsUtil.timeToBookAgain(r,$scope.session),
      chat: r.chat,
      chatSyncOptions: r.chatSyncOptions,
      request: r.request,
      order: r.order,
      booking: _.omit(r,'order','request','chat','chatSyncOptions','slackin')
    }

    // if ($scope.session) {
    //   $scope.data = _.pick($scope.session, ['name','email','initials','username'])
    //   $scope.data.location = $scope.session.location.name,
    //   $scope.data.timeZoneId = $scope.session.location.timeZoneId
    // }

    if ($scope.session.timeZoneId)
      scope.currentTimezone = moment.tz(moment().format('z')).format('z')

    if (scope.chatSyncOptions)
      scope.newGroupChat = BookingsUtil.chatGroup(r)

    // console.log("SCOPE", $scope)
    angular.extend($scope, scope)
  }

  DataService.billing.getBooking({_id}, setScope)

  $scope.suggestTime = (time) =>
    DataService.bookings.suggestTime({_id,time}, setScope)

  $scope.confirmTime = (timeId) =>
    DataService.bookings.confirmTime({_id,timeId}, setScope)

  $scope.removeTime = (timeId) =>
    DataService.bookings.removeTime({_id,timeId}, setScope)

  $scope.releasePayout = () =>
    DataService.bookings.releasePayout({_id:$scope.order._id},(r) =>
      $scope.order.released = true)

  $scope.associateGroupChat = (type, providerId) => {
    var d = {_id,type,providerId}
    DataService.bookings.associateChat(d,setScope)
  }

  $scope.createGroupChat = (type) => {
    var d = {_id,type,groupchat:$scope.newGroupChat}
    DataService.bookings.createChat(d,setScope)
  }

  $scope.fadeClass = (cssClass) => {
    if ($scope.booking.status == "pending") return `${cssClass} faded`
    else return cssClass
  }
})

.controller('BookingsCtrl', ($scope, DataService, DateTime, BookingsUtil) => {
  $scope.util = BookingsUtil

  var setScope = (r) => {
    var bs = { upcoming: [], pending: [], other: [] }
    r.forEach((b)=>{
      if (DateTime.inRange(b.datetime, 'anHourAgo', 'in48hours')) bs.upcoming.push(b)
      if (b.status == 'pending') bs.pending.push(b)
      else bs.other.push(b)
    })
    $scope.bookings = bs
  }

  $scope.fetch = () => DataService.billing.getBookings({}, setScope)
  $scope.fetch()

})
