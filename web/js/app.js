window.$ = window.jQuery = require('./components/jquery-2.3.1.js')
window._                 = require('./components/lodash-3.10.1.js')
var marked               = require('./components/marked-0.3.5.js')

require('./components/angular-1.4.5.js')
require('./components/angular-route-1.4.5.js')
require('./components/angular-load-0.4.0.js')
// require('./../components/angular-animate/angular-animate.js');
// require('./../components/angular-messages/angular-messages.js');
// require('./../components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js');
require('./components/ui-bootstrap-custom-tpls-0.14.3.js')
require('./components/moment-timezone-with-data-2010-2020.js')
require('./components/prism-custom.js')
// require('./components/prism2.js');
// require('./components/jquery-ui-custom.js');
require('./components/ace-ap.js')

// require('./ang/common/directives/forms/forms.js');
// require('./ang/common/directives/forms/inputs.js');
// require('./ang/common/directives/forms/tagInput.js');
// require('./ang/common/directives/surveys/surveys.js');
// require('./ang/common/directives/analytics.js');
// require('./ang/common/directives/payment.js');
// require('./ang/common/directives/notifications.js');
// require('./ang/common/directives/serverTemplates.js');
// require('./ang/common/directives/providers.js');
// require('./ang/common/routes/routes.js');
// require('./ang/account/module.js')
// require('./ang/posts/module.js')
// require('./ang/account/module.js')

require('./ang.v1/services/errorService.js')
require('./ang.v1/services/apiService.js')
require('./ang.v1/services/pageService.js')
require('./ang.v1/services/staticData.js')

require('./ang.v1/directives/input/directives.js')
require('./ang.v1/directives/layout/directives.js')
// require('./.lib/ang.v1/directives/post/directives.js')

require('./ang.v1/util/filters.js')
require('./ang.v1/util/markdown.js')
require('./ang.v1/util/window.js')

require('./author/module.js')
require('./me/module.js')

var util = {
  post: require('../../es/post.js'),
   // str: require('../../es/.lib/string.js')
}

angular.module("AP", [

  //-- External
  'ngRoute',
  'ui.ace',

  // 'AirPair.Services',
  'AirPair.Services.Error',
  'AirPair.Services.API',
  'AirPair.Services.Page',
  'AirPair.Services.StaticData',
  'AirPair.Util.Filters',
  'AirPair.Util.Markdown',
  'AirPair.Util.Window',

  //-- App common
  "AirPair.Directives.Input",
  "AirPair.Directives.Layout",
  // 'AirPair.Directives.Post',

  //-- App modules (namespaces)
  'AirPair.Author',
  'AirPair.Author.Me',

])


.factory('UTIL', function utilFactory() {
  util.post.marked = marked
  return util
})

.config(($locationProvider, $routeProvider) => {

  $locationProvider.html5Mode(true)

//   if (angular.element('#srv').length > 0)
//   {
//     var initialLocation = window.location.pathname
//       .toString()
//       .toLowerCase()
//       .replace(/\+/g,"\\\+") // '/c++/posts/preparing-for-cpp-interview'
//       .replace(/f\%23/g,"f\\\#") // '/f%23/tips-n-tricks/blah'
//       .replace(/c\%23/g,"c\\\#") // '/c%23/interview-questions'

//     $routeProvider.when(initialLocation, {
//       template: angular.element('#srv').html(),
//       controller: 'server:tmpl'
//     })
//   }

})

.run(($rootScope, $location, ERR) => {
  $rootScope.$on('$routeChangeSuccess', function() {
// //     if ($location.path().indexOf(window.initialLocation) == -1) {
// //       // window.trackRoute($location.path(),$location.search());
// //       window.scrollTo(0,0)
// //     }
// //     else if (!window.initialLocation) window.scrollTo(0,0)
    ERR.clear()
  })
})


// .controller('server:tmpl', ($scope) => {
//   console.log('server:tmpl')
//   // PageHlpr.loadPoSt();
//   // PageHlpr.highlightSyntax({ addCtrs: true });
//   // PageHlpr.fixPostRail();
// })
