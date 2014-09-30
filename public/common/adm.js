require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/models/adminDataService.js');
require('./../adm/posts/module.js');

angular.module("ADM", ['ngRoute', 'APSvcSession', 'ADMPosts'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {
  
    $locationProvider.html5Mode(true);

  }])

  .run(['$rootScope', '$location', 'SessionService', 
    function($rootScope, $location, SessionService) {

    SessionService.onAuthenticated( (session) => {
      $rootScope.session = session;
    });
  
  }])


;