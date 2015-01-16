angular.module("APHangouts", ['angularLoad'])

.directive('apHangoutSpinner', function($rootScope, angularLoad, BookingsUtil) {

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

      var hangoutInputData = {}
      hangoutInputData['hash'] = "ABC";
      hangoutInputData['datetime'] = scope.booking.datetime
      hangoutInputData['minutes'] = scope.booking.minutes
      hangoutInputData['bookingId'] = scope.booking._id;
      hangoutInputData['participants'] = participants;
      hangoutInputData['hangoutName'] = hangoutName;
      hangoutInputData['admin'] = true;

      var hData = {
        topic: hangoutName,
        render: 'createhangout',
        hangout_type: 'onair',
        invites: participants,
        initial_apps: [{'app_id' : $rootScope.hangoutAppId, 'app_type' : 'LOCAL_APP', 'start_data':JSON.stringify(hangoutInputData) }]
      }

      ngLoadPromise.then(function(){
        gapi.hangout.render(scope.hangoutId, hData)
      });
    }
  };

});
