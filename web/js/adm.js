window.$ = window.jQuery = require('./../components/jquery/dist/jquery.js');
window._ = require('./../components/lodash/dist/lodash.js');
require('./components/moment-timezone-with-data-2010-2020.js');
require('./../components/angular/angular.js');
require('./../components/angular-route/angular-route.js');
require('./../components/angular-messages/angular-messages.js');
require('./../components/angular-load/angular-load.js');
require('./../components/angular-bootstrap/ui-bootstrap-tpls.js');
require('./../components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js');
require('./../../ang/common/util.js');
require('./../../ang/common/filters.js');
require('./../../ang/common/directives/forms/forms.js');
require('./../../ang/common/directives/forms/inputs.js');
require('./../../ang/common/directives/forms/tagInput.js');
require('./../../ang/common/directives/experts.js');
require('./../../ang/common/directives/requests.js');
require('./../../ang/common/directives/mailtemplates.js');
require('./../../ang/common/directives/profiles.js');
require('./../../ang/common/directives/notifications.js');
require('./../../ang/common/directives/hangouts.js');
require('./../../ang/common/models/viewDataService.js');
require('./../../ang/common/models/dataService.js');
require('./../../ang/common/models/sessionService.js');
require('./../../ang/common/models/adminDataService.js');
require('./../../ang/common/routes/routes.js');
// require('./../../ang/posts/module.js');
// require('./../../ang/adm/posts/module.js');
require('./../../ang/adm/users/module.js');
require('./../../ang/adm/redirects/module.js');
require('./../../ang/adm/orders/module.js');
require('./../../ang/adm/pipeline/module.js');
require('./../../ang/adm/bookings/module.js');
require('./../../ang/adm/experts/module.js');


angular.module('ADM', [
  'ngRoute', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'APViewData',
  'APSvcSession', 'APSvcAdmin', 'APDataSvc', 'APNotifications', 'APRoutes', 'APUtil',
  'APFilters', 'APFormsDirectives', 'APInputs', 'APTagInput', 'APMailTemplates', 'APHangouts', 'APRequestDirectives',
  'ADMPipeline',
  // 'ADMPosts',
  'ADMUsers',
  'ADMRedirects',
  'ADMOrders',
  'ADMBookings',
  'ADMExperts',
  ])

  .config(function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

  })

  .run(function($rootScope, $location, SessionService, ViewData) {
    $rootScope.session.primaryPayMethodId='adm';
    SessionService.onAuthenticated( (session) => {});
  })

  .factory('ServerErrors', function serverErrorsFactory($rootScope, $location) {
    this.add = (e) => $rootScope.serverErrors = _.union($rootScope.serverErrors, [e.message])
    this.remove = (msg) => $rootScope.serverErrors = _.without($rootScope.serverErrors, msg)
    this.fetchFailRedirect = (redirectUrl) =>
      (e) => {
        $location.path(redirectUrl)
      }

    return this;
  })

;
