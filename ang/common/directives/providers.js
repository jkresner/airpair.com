angular.module("Providers", ['angularLoad'])

  .directive('userVoice', function($rootScope, $location, angularLoad) {

    var src = '//widget.uservoice.com/mR3VvBofcDuVX51PtVfpqw.js';

    if (document.location.hostname != "localhost")
    {
      var ngLoadPromise = angularLoad.loadScript(src);
    }

    return {
      scope: {},
      link: function(scope, element) {
        if (ngLoadPromise)
        {
          ngLoadPromise.then(function(){

            UserVoice = window.UserVoice || [];
            UserVoice.push(['showTab', 'classic_widget', {
              mode: 'full',
              primary_color: '#ce5424',
              link_color: '#007dbf',
              default_mode: 'support',
              forum_id: 205019,
              tab_label: 'Feedback & Support',
              tab_color: '#ce5424',
              tab_position: 'bottom-left',
              tab_inverted: false
            }]);

            $rootScope.$on('$routeChangeSuccess', function() {
              $("#uvTab").toggle($location.path() == '/v1');
            });

          });
        }

      }
    };

  });


