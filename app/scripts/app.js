angular.module("AirPair", [])

  .run(['$rootScope', function($rootScope) {
    $rootScope.title = 'Hello Airpair';
  }])
