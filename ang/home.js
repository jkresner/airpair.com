window.$ = window.jQuery = require('./../public/lib/jquery/dist/jquery.js');
window._ = require('./../public/lib/lodash/dist/lodash.js');
require('./../public/lib/angular/angular.js');
require('./../public/lib/angular-animate/angular-animate.js');
require('./../public/lib/angular-messages/angular-messages.js');
require('./common/models/viewDataService.js');
require('./common/models/staticDataService.js');
require('./common/models/sessionService.js');
require('./common/directives/ctas.js');
require('./common/directives/post.js');
require('./common/directives/analytics.js');
require('./common/directives/forms/forms.js');
require('./common/filters/filters.js');


angular.module("AP", ['ngAnimate',
  'APViewData', 'APPost',
  'APSvcSession', 'APSvcStatic', 'APFilters', 'APCTAs',
  'APAnalytics', 'APFormsDirectives'])

  .config(function() {})

  .run(function($rootScope, $location, $anchorScroll) {

    $rootScope.focusInput = function(elem) {
      angular.element('body').addClass('focus')
      $location.hash('join')
      $anchorScroll()
    }

    $rootScope.blurInput = function(elem) {
      angular.element('body').removeClass('focus')
    }

  })
