angular.module("Providers", ['angularLoad'])

.directive('apShare', function(angularLoad) {

  var src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
    + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true&init=lazy';

  var ngLoadPromise = angularLoad.loadScript(src);

  window.pwidget_config = { shareQuote: false, afterShare: false };

  return {
    template: require('./share.html'),
    scope: {
      fb: '=apFb',
      tw: '=apTw',
      in: '=apIn'
    },
    link: function(scope, element) {
      ngLoadPromise.then(function(){
        post_init(element[0]);
      });
    }
  };

})

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

})


.directive('youtubeEmbed', function($sce) {
  return {
    restrict: 'A',
    scope: {
      id: '=youtubeId',
    },
    template: '<iframe width="640" height="360" ng-src="{{url}}" frameborder="0" allowfullscreen></iframe>',
    controller($scope) {
      $scope.url = $sce.trustAsResourceUrl("https://www.youtube-nocookie.com/embed/" + $scope.id)
    }
  };
})
