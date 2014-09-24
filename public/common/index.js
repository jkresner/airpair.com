require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/postHelpers.js');
require('./../auth/module.js');
require('./../posts/module.js');
require('./../workshops/module.js');

angular.module("AP", ['ngRoute', 'APAuth', 'APPosts', 'APWorkshops'])

  .config(['$locationProvider', '$routeProvider', 
      function($locationProvider, $routeProvider) {
  
    $locationProvider.html5Mode(true);

  }])

  .run(['$rootScope', 'SessionService', function($rootScope, SessionService) {
    
    // SessionService.onAuthenticated( (session) => {
    //   $rootScope.session = session;
    // })
  
  }])

;