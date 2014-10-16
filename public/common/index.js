require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/sideNav.js');
require('./../common/directives/analytics.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/postHelpers.js');
require('./../auth/module.js');
require('./../posts/module.js');
require('./../workshops/module.js');

angular.module("AP", ['ngRoute', 'APSideNav', 'APAuth', 'APPosts', 'APWorkshops'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

  }])

  .run(['$rootScope', '$location', 'SessionService',
    function($rootScope, $location, SessionService) {


    $rootScope.$on('$routeChangeSuccess', function() {
      window.trackRoute($location.path());

      // Hack to hide menu on login pages
      $('nav#side').toggle(!($location.path().indexOf('/auth') != -1))
    });


    // SessionService.onAuthenticated( (session) => {
    //   $rootScope.session = session;
    // })

  }])

;
