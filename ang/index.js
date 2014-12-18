window.$ = window.jQuery = require('./../public/v1/lib/jquery/dist/jquery.js');
window._ = require('./../public/v1/lib/lodash/dist/lodash.js');
window.moment = require('./../public/v1/lib/moment/moment.js');
require('./../public/v1/lib/angular/angular.js');
require('./../public/v1/lib/angular-animate/angular-animate.js');
require('./../public/v1/lib/angular-route/angular-route.js');
require('./../public/v1/lib/angular-messages/angular-messages.js');
require('./../public/v1/lib/angular-load/angular-load.js');
require('./../public/v1/lib/angular-bootstrap/ui-bootstrap-tpls.js');
require('./../public/v1/lib/prism/prism.js');
require('./../public/v1/lib/jquery-ui-custom/jquery-ui.js');
window.marked = require('./../public/v1/lib/marked/lib/marked.js');
require('./common/models/viewDataService.js');
require('./common/models/postsService.js');
require('./common/models/sessionService.js');
require('./common/models/dataService.js');
require('./common/directives/ctas.js');
require('./common/directives/share.js');
require('./common/directives/post.js');
require('./common/directives/experts.js');
require('./common/directives/tagInput.js');
require('./common/directives/typeAheadInputs.js');
require('./common/directives/sideNav.js');
require('./common/directives/chatNav.js');
require('./common/directives/bookmarker.js');
require('./common/directives/analytics.js');
require('./common/directives/forms.js');
require('./common/directives/payment.js');
require('./common/directives/requests.js');
require('./common/directives/notifications.js');
require('./common/directives/serverTemplates.js');
require('./common/directives/providers.js');
require('./common/filters/filters.js');
require('./common/pageHelpers.js');
require('./auth/module.js');
require('./posts/module.js');
require('./workshops/module.js');
require('./billing/module.js');
require('./account/module.js');
require('./requests/module.js');


angular.module("AP", ['Providers', 'ngRoute', 'ngAnimate', 'APViewData', 'APDataSvc', 'APCTAs',
  'APAnalytics', 'APSideNav', 'APChatNav', 'APServerTemplates', 'APNotifications',
  'APAuth', 'APPosts', 'APWorkshops', 'APProfile', 'APBilling', 'APRequests'])

  .config(function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.when('/v1', {
      template: require('./home.html')
    });

    $routeProvider.when('/about', {
      template: require('./sales/about.html')
    });

    $routeProvider.when('/learn', {
      template: require('./learn.html')
    });

    $routeProvider.when('/angularjs/pair-programming', {
      template: require('./sales/angular.html')
    });

    if (angular.element('#serverTemplate').length > 0)
    {
      // '/c++/posts/preparing-for-cpp-interview'
      window.initialLocation = window.location.pathname.toString().replace(/\+/g,"\\\+");
      $routeProvider.when(initialLocation, {
        template: angular.element('#serverTemplate').html(),
        controller: 'ServerTemplateCtrl'
      });
    }
  })

  .run(function($rootScope, $location, Notifications) {

    $rootScope.$on('$routeChangeSuccess', function() {
      if ($location.path().indexOf(window.initialLocation) == -1) {
        window.trackRoute($location.path(),$location.search());
        window.scrollTo(0,0)
      }
      else if (!window.initialLocation) window.scrollTo(0,0)

      $rootScope.serverErrors = [];
      $rootScope.notifications = Notifications.calculateNextNotification()
    });

    pageHlpr.fixNavs('#side,#chat');
  })

  .factory('ServerErrors', function serverErrorsFactory($rootScope) {
    this.add = (e) => {
      $rootScope.serverErrors = []
      if (e) $rootScope.serverErrors = _.union($rootScope.serverErrors, [e.message])
      else $rootScope.serverErrors = _.union($rootScope.serverErrors, ["An error occured"])
    }
    this.remove = (msg) => $rootScope.serverErrors = _.without($rootScope.serverErrors, msg)

    return this;
  })

  .factory('Shared', function sharedFactory() {
    var shared = {
      util: require('../shared/util.js'),
      roles: require('../shared/roles.js')
    }
    _.idsEqual = shared.util.idsEqual
    return shared;
  })

  .controller('ServerTemplateCtrl', function($scope, ViewData, SessionService) {
    pageHlpr.loadPoSt();
    pageHlpr.highlightSyntax({ addCtrs: true });
    pageHlpr.fixPostRail();
    if ($scope.viewData && angular.element('#disqus_thread').length>0)
      pageHlpr.loadDisqus($scope.viewData.canonical);

    SessionService.onAuthenticated(function() {
      if (!$scope.request || !$scope.request.tags)
        $scope.request = { tags: _.first($scope.session.tags,3) };
    })

  })

;
