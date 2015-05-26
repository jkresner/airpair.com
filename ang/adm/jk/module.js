angular.module("ADMjk", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/jk', 'JK', require('./list.html'))
  route('/adm/jk/requests', 'RequestsReport', require('./requests.html'))

})

.controller('JKCtrl', function($scope, AdmDataService, DateTime) {

  var setScope = (r) => $scope.reports = r

  AdmDataService.reports.getOrdersReport({},setScope)
})


.controller('RequestsReportCtrl', ($scope, AdmDataService, Util) => {
  $scope.tagsString = Util.tagsString

  var setScope = (r) => $scope.reports = r

  AdmDataService.reports.getRequestReport({},setScope)

})

