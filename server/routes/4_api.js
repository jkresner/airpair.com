module.exports = function(app, mw) {


  // user api routes
  var api = app.API('session')
    .uses('noBot')
    .get({'full':                  ''})


}
