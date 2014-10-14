angular.module("APShare", ['angularLoad'])

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

  });
