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

    // $scope.spinHangouts = () => {
      // require('/scripts/providers/gapi')()
      // renderHangoutBtn: (c) =>
      //   var hData =
      //     topic: @model.roomName(c.expert._id)
      //     render: 'createhangout'
      //     hangout_type: 'onair'
      //     invites: [{id:c.expert.email,invite_type:'EMAIL'},{'id':@model.contact(0).gmail,invite_type:'EMAIL'}]
      //     initial_apps: [{'app_id' : '140030887085', 'app_type' : 'LOCAL_APP' }]
      //     widget_size: 72
      //   // $log 'hData', hData
      //   gapi.hangout.render "#{c._id}", hData

  })

  .controller('BookingsCtrl', function($scope, AdmDataService) {

    $scope.query = {
      start: moment().add(-15,'day'),
      end: moment().add(45,'day'),
      user: { _id: '' }
    }

    var setScope = (r) => {
      $scope.bookings = r
      var start = moment().add(-1,'hours')
      var end = moment().add(48, 'hours')
      $scope.upcoming = _.where(r, (b) => util.dateInRange(moment(b.datetime), start, end))
    }

    $scope.fetch = () => AdmDataService.bookings.getBookings($scope.query,setScope)
    $scope.selectUser = (user) => $scope.query.user = user

    // console.log('get', $scope.query, $scope.query.start.format('x'))
    $scope.fetch()
  })
