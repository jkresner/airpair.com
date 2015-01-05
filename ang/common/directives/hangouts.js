angular.module("APHangouts", ['angularLoad'])

.directive('apHangoutSpinner', function(angularLoad) {

  var src = 'https://apis.google.com/js/plusone.js'
  var ngLoadPromise = angularLoad.loadScript(src);

  return {
    template: '<div class="g-hangout" id="{{hangoutId}}"></div>',
    scope: {
      hangoutId: '=hangoutId',
      participants: '=participants',
    },
    link: function(scope, element, attrs) {

      var hData = {
        topic: attrs.hangoutName,
        render: 'createhangout',
        hangout_type: 'onair',
        invites: scope.participants,
        initial_apps: [{'app_id' : '140030887085', 'app_type' : 'LOCAL_APP' }],
        widget_size: 72
      }

      ngLoadPromise.then(function(){
        gapi.hangout.render(scope.hangoutId, hData)
      });
    }
  };

});
