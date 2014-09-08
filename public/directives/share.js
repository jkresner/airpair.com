angular.module("APShare", ['angularLoad'])

  .directive('apShare', function(angularLoad) {
    
    var ngLoadPromise = angularLoad
      .loadScript('//i.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true&init=lazy');
    
    window.pwidget_config = { shareQuote: false, afterShare: false }; 

    return {
      templateUrl: '/directives/share.html',
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
