angular.module("APHangouts", ['angularLoad'])

.directive('apHangoutSpinner', function(angularLoad, BookingsUtil) {

  var src = 'https://apis.google.com/js/plusone.js'
  var ngLoadPromise = angularLoad.loadScript(src);

  return {
    template: '<div class="g-hangout" id="{{hangoutId}}"></div>',
    scope: {
      hangoutId: '=hangoutId',
      participants: '=participants',
      booking: '=booking',
    },
    link: function(scope, element, attrs) {

      var participants = scope.participants
      var hangoutName = attrs.hangoutName
      if (scope.booking) {
        participants = BookingsUtil.hangoutParticipants(scope.booking)
        if (!hangoutName)
          hangoutName = BookingsUtil.hangoutName(scope.booking)
      }

      var hData = {
        topic: hangoutName,
        render: 'createhangout',
        hangout_type: 'onair',
        invites: participants,
        initial_apps: [{'app_id' : '140030887085', 'app_type' : 'LOCAL_APP' }]
      }

      ngLoadPromise.then(function(){
        gapi.hangout.render(scope.hangoutId, hData)
      });
    }
  };

});
