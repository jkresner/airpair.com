angular.module("APHangouts", ['angularLoad'])

.directive('apHangoutSpinner', function($rootScope, angularLoad, BookingsUtil) {

  var src = 'https://apis.google.com/js/plusone.js'
  var ngLoadPromise = angularLoad.loadScript(src);
  var hLoaded = {}

  return {
    template: '<div class="g-hangout" id="{{hangoutId}}"></div>',
    scope: {
      hangoutId: '=hangoutId',
      participants: '=participants',
      booking: '=booking',
      once: '=once',
    },
    link(scope, element, attrs) {

      var participants = scope.participants
      var hangoutName = attrs.hangoutName
      if (scope.booking) {
        participants = BookingsUtil.hangoutParticipants(scope.booking)
        if (!hangoutName)
          hangoutName = BookingsUtil.hangoutName(scope.booking)
      }

      var hangoutInputData = {}
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
        if (!hLoaded[scope.hangoutId] || !scope.once) {
          hLoaded[scope.hangoutId] = true
          gapi.hangout.render(scope.hangoutId, hData)
        }
      });
    }
  };

});
