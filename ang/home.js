window.$ = window.jQuery = require('./../public/v1/lib/jquery/dist/jquery.js');
require('./../public/v1/lib/angular/angular.js');
require('./../public/v1/lib/angular-animate/angular-animate.js');
require('./../public/v1/lib/angular-messages/angular-messages.js');
require('./common/directives/ctas.js');
require('./common/directives/analytics.js');
require('./common/directives/forms.js');
require('./common/filters/filters.js');
require('./common/models/sessionService.js');


angular.module("AP", ['ngAnimate', 'APCTAs', 'APSvcSession', 'APFilters',
  'APAnalytics', 'APFormsDirectives'])

  .config(function() {})

  .run(function($rootScope, $location, $anchorScroll) {

    $rootScope.session = window.user;

    $rootScope.focusInput = function(elem) {
      angular.element('body').addClass('focus')
      $location.hash('join')
      $anchorScroll()
    }
    $rootScope.blurInput = function(elem) {
      angular.element('body').removeClass('focus')
    }

  })

;
