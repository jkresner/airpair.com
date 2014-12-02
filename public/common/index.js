window.$ = window.jQuery = require('./../v1/lib/jquery/dist/jquery.js');
window._ = require('./../v1/lib/lodash/dist/lodash.js');
window.moment = require('./../v1/lib/moment/moment.js');
require('./../v1/lib/angular/angular.js');
require('./../v1/lib/angular-animate/angular-animate.js');
require('./../v1/lib/angular-route/angular-route.js');
require('./../v1/lib/angular-messages/angular-messages.js');
require('./../v1/lib/angular-load/angular-load.js');
require('./../v1/lib/angular-bootstrap/ui-bootstrap-tpls.js');
window.marked = require('./../v1/lib/marked/lib/marked.js');
require('./../v1/lib/prism/prism.js');
require('./../v1/lib/jquery-ui-custom/jquery-ui.js');
require('./../common/directives/share.js');
require('./../common/directives/post.js');
require('./../common/directives/experts.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/userInput.js');
require('./../common/directives/sideNav.js');
require('./../common/directives/bookmarker.js');
require('./../common/directives/analytics.js');
require('./../common/directives/forms.js');
require('./../common/directives/payment.js');
require('./../common/directives/notifications.js');
require('./../common/directives/serverTemplates.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/models/billingService.js');
require('./../common/pageHelpers.js');
require('./../auth/module.js');
require('./../posts/module.js');
require('./../workshops/module.js');
require('./../billing/module.js');
require('./../profile/module.js');


angular.module("AP", ['ngRoute', 'ngAnimate', 'APSideNav', 'APAuth', 'APPosts', 'APWorkshops',
  'APProfile', 'APBilling', 'APNotifications', 'APServerTemplates'])

  .config(function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.when('/v1', {
      template: require('../home.html')
    });

    $routeProvider.when('/about', {
      template: require('../about.html')
    });

    $routeProvider.when('/learn', {
      template: require('../learn.html')
    });

    $routeProvider.when('/', {
      template: require('../about.html')
    });

    $routeProvider.when('/angularjs/pair-programming', {
      template: require('../sales/angular.html')
    });

    if (angular.element('#serverTemplate').length > 0)
    {
                                        // '/c++/posts/preparing-for-cpp-interview'
      var initialLocation = window.location.pathname.toString().replace(/\+/g,"\\\+");
      $routeProvider.when(initialLocation, {
        template: angular.element('#serverTemplate').html(),
        controller: 'ServerTemplateCtrl'
      });
    }
  })

  .run(function($rootScope, $location, SessionService) {

    $rootScope.$on('$routeChangeSuccess', function() {
      window.trackRoute($location.path());
      $rootScope.serverErrors = [];
      angular.element('.notify').toggle($location.path().indexOf('login') == -1)
    });

    if (window.viewData)
    {
      if (window.viewData.post) $rootScope.post = window.viewData.post
      if (window.viewData.workshop) $rootScope.workshop = window.viewData.workshop
      if (window.viewData.expert) $rootScope.expert = window.viewData.expert
    }

  })

  .factory('ServerErrors', function serverErrorsFactory($rootScope) {
    this.add = (e) => {
      console.log('e', e, e.message)
      $rootScope.serverErrors = _.union($rootScope.serverErrors, [e.message])
    }

    this.remove = (msg) =>
      $rootScope.serverErrors = _.without($rootScope.serverErrors, msg)

    return this;
  })

  .controller('ServerTemplateCtrl', function($scope) {
    pageHlpr.fixNavs('#side');
    pageHlpr.loadPoSt();
    pageHlpr.highlightSyntax({ addCtrs: true });
    pageHlpr.fixPostRail();
    if (viewData && angular.element('#disqus_thread').length>0)
      pageHlpr.loadDisqus(viewData.canonical);
  })

;
