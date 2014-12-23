window.$ = window.jQuery = require('./../public/v1/lib/jquery/dist/jquery.js');
window._ = require('./../public/v1/lib/lodash/dist/lodash.js');
window.moment = require('./../public/v1/lib/moment/moment.js');
require('./../public/v1/lib/angular/angular.js');
require('./../public/v1/lib/angular-route/angular-route.js');
require('./../public/v1/lib/angular-messages/angular-messages.js');
require('./../public/v1/lib/angular-load/angular-load.js');
require('./../public/v1/lib/angular-bootstrap/ui-bootstrap-tpls.js');
require('./common/directives/forms.js');
require('./common/directives/post.js');
require('./common/directives/tagInput.js');
require('./common/directives/typeAheadInputs.js');
require('./common/directives/requests.js');
require('./common/directives/mailtemplates.js');
require('./common/filters/filters.js');
require('./common/models/dataService.js');
require('./common/models/postsService.js');
require('./common/models/sessionService.js');
require('./common/models/adminDataService.js');
require('./adm/posts/module.js');
require('./adm/users/module.js');
require('./adm/redirects/module.js');
require('./adm/views/module.js');
require('./adm/orders/module.js');
require('./adm/companys/module.js');
require('./adm/pipeline/module.js');
require('./adm/bookings/module.js');

angular.module('ADM', [
  'ngRoute',
  'APSvcSession', 'APSvcAdmin', 'APDataSvc',
  'APFilters', 'APFormsDirectives', 'APTypeAheadInputs', 'APMailTemplates',
  'ADMPipeline',
  'ADMPosts',
  'ADMUsers',
  'ADMRedirects',
  'ADMViews',
  'ADMOrders',
  'ADMBookings',
  'ADMCompanys'])

  .config(function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

  })

  .run(function($rootScope, $location, SessionService) {
    $rootScope.session = _.extend(window.viewData.session,{primaryPayMethodId:'adm'});
    SessionService.onAuthenticated( (session) => {});
  })

  .factory('ServerErrors', function serverErrorsFactory($rootScope) {
    this.add = (e) => $rootScope.serverErrors = _.union($rootScope.serverErrors, [e.message])
    this.remove = (msg) => $rootScope.serverErrors = _.without($rootScope.serverErrors, msg)

    return this;
  })

;
