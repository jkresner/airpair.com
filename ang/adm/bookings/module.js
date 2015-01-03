var util = require('../../../shared/util')


angular.module("ADMBookings", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/adm/bookings', {
      template: require('./list.html'),
      controller: 'BookingsCtrl'
    });

    $routeProvider.when('/adm/bookings/:id', {
      template: require('./item.html'),
      controller: 'BookingCtrl'
    });

  })


  .controller('BookingCtrl', function($scope, $routeParams, $location, AdmDataService, ServerErrors) {
    $scope.booking = {}
    $scope.data = {}

    $scope.$watch('booking', function(r) {
      $scope.previousDatetime = moment(r.datetime)
      $scope.data = {
        type: r.type,
        datetime: moment(r.datetime),
        status: r.status,
        notify: false
      }
      $scope.customers = _.where(r.participants, (p)=> p.role == 'customer')
      $scope.experts = _.where(r.participants, (p)=> p.role == 'expert')
    })


    AdmDataService.bookings.getBooking($routeParams.id, (r) =>
      $scope.booking = r,
      () => $location.path('/adm/bookings')
    )

    $scope.update = () =>
      AdmDataService.bookings.updateBooking($scope.booking, function (r) {
        $scope.booking = r
        delete $scope.booking.sendGCal
      }, ServerErrors.add)


    $scope.updateTime = (datetime) => {
      $scope.booking.datetime = datetime
      $scope.update()
    }

    $scope.onTimeSet = function (queryVar, newDate, oldDate) {
      $scope.data.datetime = moment(newDate)
      angular.element('.dropdown').removeClass('open')
    }

    $scope.datetimeChanged = (datetime) =>
      (datetime) ? !datetime.isSame($scope.previousDatetime) : true

    $scope.updateStatus = () => {
      $scope.booking.status = $scope.data.status
      $scope.update()
    }

    $scope.addGcal = () => {
      $scope.booking.sendGCal = { notify: $scope.data.notify }
      $scope.update()
    }

  })

  .controller('BookingsCtrl', function($scope, AdmDataService) {

    $scope.selectedUser = {}

    $scope.query = { start: moment().add(-15,'day'), end: moment().add(45,'day'),
      userId: '' }

    var setScope = (bookings) => {
      $scope.bookings = bookings
      var start = moment().add(-1,'hours')
      var end = moment().add(48, 'hours')
      $scope.upcoming = _.where(bookings, (b) => util.dateInRange(moment(b.datetime), start, end))
    }

    $scope.refresh = () => {
       // console.log('refresh', $scope.query)
      AdmDataService.bookings.getBookings($scope.query,setScope)
    }

    $scope.onTimeSet = function (queryVar, newDate, oldDate) {
      $scope.query[queryVar] = moment(newDate)
      angular.element('.dropdown').removeClass('open')
    }

    console.log('get', $scope.query, $scope.query.start.format('x'))
    AdmDataService.bookings.getBookings($scope.query, setScope)

    $scope.selectUser = (user) => {
      $scope.selectedUser = user
      $scope.query.userId = user._id
    }

  })
