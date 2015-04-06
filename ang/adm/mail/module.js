angular.module("ADMMail", [])

.config(function(apRouteProvider) {

  var route = apRouteProvider.route
  route('/adm/mail', 'Mail', require('./list.html'))

})

.controller('MailCtrl', function($scope, AdmDataService) {

})
