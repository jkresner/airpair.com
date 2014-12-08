
angular.module("ADMCompanys", [])

  .config(function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/companys', {
      template: require('./list.html'),
      controller: 'CompanysCtrl as companys'
    });

  })

  .controller('CompanysCtrl', function($scope, AdmDataService) {

    $scope.selectedCompany = {}

    // AdmDataService.getUsersInRole({role:'admin'}, function (result) {
    //   $scope.admins = result;
    // })

    // AdmDataService.getUsersInRole({role:'editor'}, function (result) {
    //   $scope.editors = result;
    // })

    // AdmDataService.getUsersInRole({role:'pipeliner'}, function (result) {
    //   $scope.pipeliners = result;
    // })

    // $scope.toggleRole = function() {
    //   AdmDataService.toggleRole({_id: $scope.selectedUser._id, role: $scope.role }, function (result) {
    //     AdmDataService.getUsersInRole({role:$scope.role}, function (result) {
    //       $scope[$scope.role+'s'] = result;
    //     })
    //   })
    // }


    $scope.selectCompany = (company) => $scope.selectedCompany = company

  })
