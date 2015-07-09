angular.module("APBookings", [])

.config(function(apRouteProvider) {

  var authd = apRouteProvider.resolver(['session'])
  var route = apRouteProvider.route
  route('/bookings', 'Bookings', require('./list.html'), { resolve: authd })
  route('/bookings/:id', 'Booking', require('./item.html'), { resolve: authd })
  route('/booking/:id', 'Booking', require('./item.html'), { resolve: authd })
})

.controller('BookingCtrl', ($scope, $routeParams, DataService, ServerErrors, BookingsUtil, OrdersUtil, Util, Roles) => {
  var _id = $routeParams.id
  $scope.data = {}
  $scope.util = BookingsUtil

  var setScope = function(r) {
    if (!r.participants) return

    var hangoutReadyDate = moment(r.datetime).add(-10,"minutes")
    var endDate = moment(r.datetime).add(r.minutes,'minutes')
    var hangoutState = {};
    if (Util.dateInRange(moment(), hangoutReadyDate, endDate)){
      hangoutState.inProgress = true
    } else if (moment().isBefore(hangoutReadyDate)){
      hangoutState.none = true
    } else {
      hangoutState.complete = true
    }

    var scope = {
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
      isCustomer: Roles.booking.isCustomer($scope.session,r),
      isExpert: Roles.booking.isExpert($scope.session,r),
      chat: r.chat,
      request: r.request,
      order: r.order,
      booking: _.omit(r,'order','request','chat','chatSyncOptions')
    }

    if ($scope.session.timeZoneId)
      scope.currentTimezone = moment.tz(moment().format('z')).format('z')

    // console.log("SCOPE", $scope)
    angular.extend($scope, scope)
  }

  DataService.billing.getBooking({_id}, setScope)

  $scope.suggestTime = (time) =>
    DataService.bookings.suggestTime({_id,time}, setScope)

  $scope.confirmTime = (timeId) =>
    DataService.bookings.confirmTime({_id,timeId}, setScope)

  $scope.releasePayout = () =>
    DataService.bookings.releasePayout({_id:$scope.order._id},(r) =>
      $scope.order.released = true)
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
