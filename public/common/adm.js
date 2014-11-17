window.$ = window.jQuery = require('./../v1/lib/jquery/dist/jquery.js');
window._ = require('./../v1/lib/lodash/dist/lodash.js');
window.moment = require('./../v1/lib/moment/moment.js');
require('./../v1/lib/angular/angular.js');
require('./../v1/lib/angular-route/angular-route.js');
require('./../v1/lib/angular-messages/angular-messages.js');
require('./../v1/lib/angular-load/angular-load.js');
require('./../v1/lib/angular-bootstrap/ui-bootstrap-tpls.js');

require('./../common/directives/post.js');
require('./../common/directives/tagInput.js');
require('./../common/filters/filters.js');
require('./../common/models/postsService.js');
require('./../common/models/sessionService.js');
require('./../common/models/adminDataService.js');
require('./../adm/posts/module.js');
require('./../adm/users/module.js');
require('./../adm/redirects/module.js');


angular.module("ADM", [
  'ngRoute',
  'APSvcSession',
  'ADMPosts',
  'ADMUsers',
  'ADMRedirects'])

  .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);

  }])

  .run(['$rootScope', '$location', 'SessionService',
    function($rootScope, $location, SessionService) {

    SessionService.onAuthenticated( (session) => {
    });

  }])

;
