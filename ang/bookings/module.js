angular.module("APBookings", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/bookings', 'Bookings', require('./list.html'))
  route('/bookings/:id', 'Booking', require('./item.html'))

})

.controller('BookingCtrl', ($scope, $routeParams, DataService, ServerErrors, BookingsUtil, OrdersUtil, Util) => {
  $scope.data = {}
  $scope.util = BookingsUtil

  var setScope = function(r) {
    if (!r.participants) return

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
      booking: r
    }
    // console.log("SCOPE", $scope)
    angular.extend($scope, scope)
  }

  // console.log("hi", $routeParams.id)

  DataService.billing.getBooking({_id:$routeParams.id}, setScope)

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
