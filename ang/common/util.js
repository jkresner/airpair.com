angular.module("APUtil", [])

.factory('Util', function utilFactory() {
  return require('../../shared/util.js')
})

.factory('Roles', function rolesFactory() {
  return require('../../shared/roles.js')
})

.factory('DateTime', function dateTimeFactory() {
  return require('../../shared/util.js').datetime
})

.factory('BookingsUtil', function bookingsUtilFactory() {
  return require('../../shared/bookings.js')
})
