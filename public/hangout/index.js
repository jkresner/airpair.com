//import stringified JSON from appData query param
var appData = JSON.parse(decodeURI(
  /appData=(.*?)(&|$)/.exec(document.location.href)[1]
));

var youTubeId = /youTubeId=(.*?)(&|$)/.exec(document.location.href)[1]
console.log("YouTube ID = ", youTubeId);

//TODO send PUT request to associate youTubeId with booking

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
