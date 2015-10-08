window.$ = window.jQuery = require('./../public/lib/jquery/dist/jquery.js');
window._ = require('./../public/lib/lodash/dist/lodash.js');
window.moment = require('./../public/lib/moment-timezone/builds/moment-timezone-with-data-2010-2020.js');
require('./../public/lib/angular/angular.js');
require('./../public/lib/angular-route/angular-route.js');
require('./../public/lib/angular-messages/angular-messages.js');
require('./../public/lib/angular-load/angular-load.js');
require('./../public/lib/angular-bootstrap/ui-bootstrap-tpls.js');
require('./../public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js');
require('./common/util.js');
require('./common/directives/forms/forms.js');
require('./common/directives/forms/inputs.js');
require('./common/directives/forms/tagInput.js');
require('./common/directives/posts.js');
require('./common/directives/deals.js');
require('./common/directives/requests.js');
require('./common/directives/mailtemplates.js');
require('./common/directives/profiles.js');
require('./common/directives/notifications.js');
require('./common/directives/hangouts.js');
require('./common/filters/filters.js');
require('./common/models/viewDataService.js');
require('./common/models/dataService.js');
require('./common/models/sessionService.js');
require('./common/models/adminDataService.js');
require('./common/models/mmDataService.js');
require('./common/routes/routes.js');
require('./adm/posts/module.js');
require('./adm/users/module.js');
require('./adm/redirects/module.js');
require('./adm/orders/module.js');
require('./adm/pipeline/module.js');
require('./adm/bookings/module.js');
require('./adm/experts/module.js');
require('./matchmaking/module.js');

angular.module('ADM', [
  'ngRoute', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'APViewData',
  'APSvcSession', 'APSvcAdmin', 'APDataSvc', 'APNotifications', 'APRoutes', 'APUtil',
  'APFilters', 'APFormsDirectives', 'APInputs', 'APTagInput', 'APMailTemplates', 'APHangouts', 'APRequestDirectives',
  'ADMPipeline',
  'ADMPosts',
  'ADMUsers',
  'ADMRedirects',
  'ADMOrders',
  'ADMBookings',
  'ADMExperts',
  'APMatchmaking',
  ])

  .config(function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

  })

  .run(function($rootScope, $location, SessionService, ViewData) {
    $rootScope.session.primaryPayMethodId='adm';
    SessionService.onAuthenticated( (session) => {});

    // $rootScope.$on('$routeChangeSuccess', function() {
      // var path = $location.path()
      //$('#chat').toggle(path.indexOf('orders') == -1 && path.indexOf('bookings') == -1)
    // })
  })

  .factory('ServerErrors', function serverErrorsFactory($rootScope, $location) {
    this.add = (e) => $rootScope.serverErrors = _.union($rootScope.serverErrors, [e.message])
    this.remove = (msg) => $rootScope.serverErrors = _.without($rootScope.serverErrors, msg)
    this.fetchFailRedirect = (redirectUrl) =>
      (e) => {
        console.log('fetch.fail', e)
        $location.path(redirectUrl)
      }

    return this;
  })

;
