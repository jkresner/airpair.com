AirPair.directive('airpairRequests', [function() {
  return {
    restrict: 'A',
    templateUrl : 'requests.html',
    controller: 'RequestsController'
  };
}]);

AirPair.controller('RequestsHeaderController', ['$scope','chat', function($scope, chat){
  $scope.chat = chat;
}]);

AirPair.controller('RequestsController', ['$scope','chat', function($scope, chat) {
  $scope.chat = chat;
}]);
