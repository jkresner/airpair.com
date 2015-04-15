angular.module("ADMjk", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/jk', 'JK', require('./list.html'))

})

.controller('JKCtrl', function($scope, AdmDataService, DateTime) {

  var setScope = (r) => $scope.reports = r

  AdmDataService.reports.getOrdersReport({},setScope)

})

