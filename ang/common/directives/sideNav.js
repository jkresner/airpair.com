angular.module("APSideNav", [])

.directive('sideNav', function($rootScope, $modal, $animate, SessionService) {
  return {
    template: require('./sideNav.html'),
    link(scope, element, attrs) {

      // Only track menu behavior for anonymous users
      SessionService.onAuthenticated( (session) =>
        scope.tracking = (session._id && session.primaryPayMethodId) ? false : true )

      element.bind('mouseenter', function() {
        element.removeClass('collapse');
        storage('sideNavOpen', 'true');
      });
      element.bind('mouseleave', function() {
        element.addClass('collapse');
        storage('sideNavOpen', 'false');
      });

      element.css('display','block')
    },
    controllerAs: 'sideNav',
    controller($scope, $element, $attrs) {

      // this.toggle = function() {
      //   if($element.hasClass('expert'))
      //     $animate.removeClass($element, 'expert')
      //   else
      //     $animate.addClass($element, 'expert')

      //   var storeFn = () => storage('sideExpertOpen', $element.hasClass('expert').toString())
      //   setTimeout(storeFn, 3000)
      // }

      // if (storage('sideExpertOpen') == 'true') $element.addClass('expert')

      // set init state
      $element.toggleClass('collapse', storage('sideNavOpen') != 'true')
      $scope.toggleAction = (storage('sideNavOpen') != 'true') ? 'Show' : 'Hide';

      var self = this;
    }
  };

})


// .directive('sortable', function(SessionService) {
//   return {
//     link: function(scope, element, attrs) {
//       $(element).sortable({
//         stop: function(event, ui) {
//           var list = scope[attrs['get']]();
//           var elems = $(element).children();

//           for (var i = 0; i < elems.length; i++) {
//             var elem = $(elems[i]);
//             var obj = _.find(list, (t) => t._id === elem.data('id'));
//             obj.sort = i;
//           }

//           scope[attrs['set']](scope, list);
//         }
//       });
//       $(element).disableSelection();
//     }
//   }
// })
