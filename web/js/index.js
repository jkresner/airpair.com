window.$ = window.jQuery = require('./../components/jquery/dist/jquery.js');
window._ = require('./../components/lodash/dist/lodash.js');
window.moment = require('./../components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js');
require('./../components/angular/angular.js');
require('./../components/angular-animate/angular-animate.js');
require('./../components/angular-route/angular-route.js');
require('./../components/angular-messages/angular-messages.js');
require('./../components/angular-load/angular-load.js');
require('./../components/angular-bootstrap/ui-bootstrap-tpls.js');
require('./../components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js');
require('./../js/components/prism.js');
require('./../js/components/jquery-ui-custom.js');
window.marked = require('./../components/marked/lib/marked.js');
require('./../../web/components/ace-builds/src-min-noconflict/ace.js');
require('./../../web/components/angular-ui-ace/ui-ace.js');
require('./../../web/components/ace-builds/src-min-noconflict/ext-language_tools.js');
require('./../../web/components/ace-builds/src-min-noconflict/mode-markdown.js');
require('./../../web/components/ace-builds/src-min-noconflict/theme-dawn.js');
require('./../../ang/common/models/viewDataService.js');
require('./../../ang/common/models/sessionService.js');
require('./../../ang/common/models/dataService.js');
require('./../../ang/common/models/staticDataService.js');
require('./../../ang/common/util.js');
require('./../../ang/common/filters.js');
require('./../../ang/common/directives/hangouts.js');
require('./../../ang/common/directives/forms/forms.js');
require('./../../ang/common/directives/forms/inputs.js');
require('./../../ang/common/directives/forms/tagInput.js');
require('./../../ang/common/directives/surveys/surveys.js');
require('./../../ang/common/directives/experts.js');
require('./../../ang/common/directives/sideNav.js');
require('./../../ang/common/directives/analytics.js');
require('./../../ang/common/directives/payment.js');
require('./../../ang/common/directives/requests.js');
require('./../../ang/common/directives/notifications.js');
require('./../../ang/common/directives/serverTemplates.js');
require('./../../ang/common/directives/providers.js');
require('./../../ang/common/directives/profiles.js');
require('./../../ang/common/pageHelpers.js');
require('./../../ang/common/routes/routes.js');
require('./../../ang/auth/module.js')
require('./../../ang/posts/module.js')
require('./../../ang/billing/module.js')
require('./../../ang/account/module.js')
require('./../../ang/requests/module.js')
require('./../../ang/bookings/module.js')
require('./../../ang/dashboard/module.js')


angular.module("AP", ['ngRoute', 'ngAnimate',
  'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ui.ace',
  'Providers',
  'APRoutes', 'APServerTemplates', 'APPageHelpers',
  'APFilters', 'APUtil', 'APFormsDirectives', 'APInputs',
  'APViewData', 'APSvcSession', 'APDataSvc', 'APSvcStatic',
  'APAnalytics', 'APNotifications',
  'APProfileDirectives', 'APSurveyDirectives',
  'APSideNav', 'APHangouts',
  'APAuth', 'APPosts', 'APProfile', 'APBilling',
  'APRequests','APBookings', 'APDashboard'])

.config(function($locationProvider, $routeProvider) {

  $locationProvider.html5Mode(true)

  if (angular.element('#serverTemplate').length > 0)
  {
    window.initialLocation = window.location.pathname.toString()
      .replace(/\+/g,"\\\+") // '/c++/posts/preparing-for-cpp-interview'
      .replace(/f\%23/g,"f\\\#") // '/f%23/tips-n-tricks/blah'
      .replace(/c\%23/g,"c\\\#") // '/c%23/interview-questions'

    $routeProvider.when(initialLocation, {
      template: angular.element('#serverTemplate').html(),
      controller: 'ServerTemplateCtrl'
    });
  }
})

.run(($rootScope, $location, PageHlpr, Notifications) => {

  $rootScope.$on('$routeChangeSuccess', function() {
    if ($location.path().indexOf(window.initialLocation) == -1) {
      // window.trackRoute($location.path(),$location.search());
      window.scrollTo(0,0)
    }
    else if (!window.initialLocation) window.scrollTo(0,0)

    $rootScope.serverErrors = [];
    $rootScope.notifications = Notifications.calculateNextNotification()
  });

  PageHlpr.fixNavs('#side') //,#chat'
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
    util: require('../../shared/util.js'),
    roles: require('../../shared/roles.js')
  }
  _.idsEqual = shared.util.idsEqual
  return shared;
})

.controller('ServerTemplateCtrl', ($scope, ViewData, SessionService, RequestHelper, PageHlpr) => {
  PageHlpr.loadPoSt();
  PageHlpr.highlightSyntax({ addCtrs: true });
  PageHlpr.fixPostRail();
  if ($scope.viewData && angular.element('#disqus_thread').length>0)
    PageHlpr.loadDisqus($scope.viewData.canonical);

  RequestHelper.setRequestTagsFromSession($scope)

})
