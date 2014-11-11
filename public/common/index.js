require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/userInput.js');
require('./../common/directives/sideNav.js');
require('./../common/directives/bookmarker.js');
require('./../common/directives/analytics.js');
require('./../common/directives/forms.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/pageHelpers.js');
require('./../auth/module.js');
require('./../posts/module.js');
require('./../workshops/module.js');
require('./../billing/module.js');
require('./../profile/module.js');

angular.module("AP", ['ngRoute', 'ngAnimate', 'APSideNav', 'APAuth', 'APPosts', 'APWorkshops', 'APProfile', 'APBilling'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.when('/v1', {
      template: require('../home.html')
    });

    $routeProvider.when('/about', {
      template: require('../about.html')
    });

    $routeProvider.when('/', {
      template: require('../about.html')
    });

  }])

  .run(['$rootScope', '$location', 'SessionService',
    function($rootScope, $location, SessionService) {

    pageHlpr.fixNavs('#side');

    $rootScope.$on('$routeChangeSuccess', function() {
      window.trackRoute($location.path());
    });

  }])

;
