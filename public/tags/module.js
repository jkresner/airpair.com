

angular.module("APPosts", ['ngRoute', 'APFilters','APShare',
  'APMyPostsList','APPostEditor','APPost', 'APBookmarker','APSvcSession', 'APSvcPosts','APTagInput'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $routeProvider.when('/angularjs', {
      template: require('./angularjs.html'),
      controller: 'IndexCtrl'
    });

  }])

  .controller('IndexCtrl', ['$scope','PostsService', 'SessionService',
      function($scope, PostsService, SessionService) {
    var self = this;


  }])


;
