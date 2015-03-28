var timestart     = new Date().getTime()
var timeLast      = new Date().getTime()


module.exports    = function(msg) {

  var subLapsed   = (new Date().getTime() - timeLast).toString()
  timeLast        = new Date().getTime()
  var lapsed      = (timeLast-timestart).toString()
  console.log(
      (lapsed+"      a".substring(0,6-lapsed.length)).magenta,
      (subLapsed+"        b".substring(0,8-subLapsed.length)).green,
      msg.magenta
    )

}
