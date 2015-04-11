angular.module("ADMBookings", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/bookings', 'Bookings', require('./list.html'))
  route('/adm/bookings/:id', 'Booking', require('./item.html'))

})

.controller('BookingCtrl', ($scope, $routeParams, AdmDataService, ServerErrors,
    Util, BookingsUtil, OrdersUtil) =>
{
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
      booking: r,
      lineForPayout: OrdersUtil.lineForPayout(r.order)
    }

    angular.extend($scope, scope)
  }

  AdmDataService.bookings.getBooking({_id:$routeParams.id}, setScope,
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
    AdmDataService.bookings.addYouTubeData({_id: $scope.booking._id, youTubeId}, setScope)
  }

  $scope.releasePayout = () =>
    AdmDataService.bookings.releasePayout({_id:$scope.booking.order._id},(r) => {
      console.log('r.order?', r)
      $scope.booking.order = r
      $scope.lineForPayout = OrdersUtil.lineForPayout(r)
    })

  $scope.swapExpert = (suggestionId) => {
    var swap = {_id:$scope.booking._id,orderId:$scope.booking.order._id,requestId:$scope.booking.request._id,suggestionId}
    AdmDataService.bookings.cheatBookingExpertSwap(swap,setScope)
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
    var bs = { upcoming: [], pending: [], other: [] }
    r.forEach((b)=>{
      if (DateTime.inRange(b.datetime, 'anHourAgo', 'in48hours')) bs.upcoming.push(b)
      if (b.status == 'pending') bs.pending.push(b)
      else bs.other.push(b)
    })
    $scope.bookings = bs
  }

  $scope.selectUser = (user) => $scope.query.user = user
  $scope.fetch = () => AdmDataService.bookings.getBookings($scope.query,setScope)
  $scope.fetch()
})
