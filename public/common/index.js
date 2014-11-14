window.$ = window.jQuery = require('./../v1/lib/jquery/dist/jquery.js');
window._ = require('./../v1/lib/lodash/dist/lodash.js');
window.moment = require('./../v1/lib/moment/moment.js');
require('./../v1/lib/angular/angular.js');
require('./../v1/lib/angular-route/angular-route.js');
require('./../v1/lib/angular-messages/angular-messages.js');
require('./../v1/lib/angular-load/angular-load.js');
require('./../v1/lib/angular-bootstrap/ui-bootstrap-tpls.js');
require('./../v1/lib/marked/lib/marked.js');
require('./../v1/lib/prism/prism.js');
require('./../v1/lib/jquery-ui/jquery-ui.min.js');
require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
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

angular.module("AP", ['ngRoute', 'APSideNav', 'APAuth', 'APPosts', 'APWorkshops', 'APProfile', 'APBilling'])

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


angular.module("APLite", ['ngRoute', 'APFilters', 'APAnalytics', 'APSideNav', 'APBookmarker'])

  .config( ['$provide', function ($provide){

  }])

  .run(['$rootScope', 'SessionService',
    function($rootScope, SessionService) {

    pageHlpr.fixNavs('#side');

    if (window.viewData)
    {
      if (window.viewData.post) $rootScope.post = window.viewData.post
      if (window.viewData.workshop) $rootScope.workshop = window.viewData.workshop
      if (window.viewData.expert) $rootScope.expert = window.viewData.expert
    }

  }])

;
