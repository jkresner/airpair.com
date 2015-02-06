
module.exports = function(logging) {
  return () => {
    return {
      send(to, data, callback) {
        if (logging)
          $log('devmail.send', to, data.Subject, data.Text)
        if (callback)
          callback()
      }
    }
  }
}
