window.$ = window.jQuery = require('./../v1/lib/jquery/dist/jquery.js');
window._ = require('./../v1/lib/lodash/dist/lodash.js');
window.moment = require('./../v1/lib/moment/moment.js');
require('./../v1/lib/angular/angular.js');
require('./../v1/lib/angular-route/angular-route.js');
require('./../v1/lib/angular-messages/angular-messages.js');
require('./../v1/lib/angular-load/angular-load.js');
require('./../v1/lib/angular-bootstrap/ui-bootstrap-tpls.js');
require('./../common/directives/forms.js');
require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/directives/userInput.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/models/adminDataService.js');
require('./../adm/posts/module.js');
require('./../adm/users/module.js');
require('./../adm/redirects/module.js');
require('./../adm/views/module.js');
require('./../adm/orders/module.js');


angular.module('ADM', [
  'ngRoute',
  'APSvcSession',
  'ADMPosts',
  'ADMUsers',
  'ADMRedirects',
  'ADMViews',
  'ADMOrders',
  'APFormsDirectives'])

  .config(function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

  })

  .run(function($rootScope, $location, SessionService) {

    SessionService.onAuthenticated( (session) => {
    });

  })

  .factory('ServerErrors', function serverErrorsFactory($rootScope) {
    this.add = (e) => $rootScope.serverErrors = _.union($rootScope.serverErrors, [e.message])
    this.remove = (msg) => $rootScope.serverErrors = _.without($rootScope.serverErrors, msg)

    return this;
  })

;
