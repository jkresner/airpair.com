//import stringified JSON from appData query param
var appData = JSON.parse(decodeURI(
  /appData=(.*?)(&|$)/.exec(document.location.href)[1]
));

var youTubeId = /youTubeId=(.*?)(&|$)/.exec(document.location.href)[1];
var addHangoutUrl = "/v1/api/adm/bookings/" + appData.bookingId + "/hangout";
var hangoutUrl = /hangoutUrl=(.*?)(&|$)/.exec(document.location.href)[1];
var participant = JSON.parse(decodeURI(/participant=(.*?)(&|$)/.exec(document.location.href)[1]));

var invalidAccount = false;
//TODO would be cleaner to rely on some immutable ID, unfortunately email isn't available
if (appData.admin &&
      !(participant.person.displayName === "AirPair Experts" ||
        participant.person.displayName === "Air Pair" ||
        participant.person.displayName === "Customer Support"
      )
    ){
  invalidAccount = true;
  alert("We cannot start the hangout recording. You must be logged in with" +
    "the experts@airpair.com team@airpair.com or support@airpair.com account. ");
}

invalidAccount = false;

if (!invalidAccount && appData.admin){
  $.ajax({
    url: addHangoutUrl,
    method: "PUT",
    data: {
      youTubeId: youTubeId,
      hangoutUrl: hangoutUrl,
      youTubeAccount: participant.person.displayName
    }
  }).done(function(data, status){
    console.log("GOT DATA", data);
  }).fail(function(jqXHR, status){
    console.error("STATUS", status);
  });

  //TODO send PUT request to associate youTubeId with booking
}

$(document).ready(function(){
  $("#minutes").html(appData.minutes);
  $("#date").html(formatDate(appData.datetime));
  $("#title").html(appData.hangoutName)
});

var formatDate = function(dateString){
  var now = new Date(dateString);

  // Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

  // Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

  // Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

  // Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

  // If hour is 0, set it to 12
  time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

  // Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
};
