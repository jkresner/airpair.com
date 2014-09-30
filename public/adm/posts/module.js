
angular.module("ADMPosts", ['ngRoute', 'APSvcAdmin', 'APSvcPosts', 'APFilters'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {

    $routeProvider.when('/v1/adm/posts', {
      template: require('./list.html'),
      controller: 'PostsCtrl as posts'
    });

  }])

  .run(['$rootScope', 'SessionService', 'AdmDataService', function($rootScope, SessionService, AdmDataService) {
    
  }])

  .directive('apPostListItem', ['$parse', function($parse) {
    return {
      template: require('./item.html'),
      link: function(scope, element, attrs) {
        scope.post = scope.$eval(attrs.post)
      }
    };
  }])


  .controller('PostsCtrl', ['$scope','PostsService', 'AdmDataService', 
      function($scope, PostsService, AdmDataService) {
    
    AdmDataService.getPosts(function (result) {
      $scope.recent = result;
    })  

  }])